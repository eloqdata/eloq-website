#!/usr/bin/env bash
set -eo pipefail


# ----------------- USER CONFIG -----------------
# Replace these placeholders
ENDPOINT="https://s3.example.com"    # 你的 S3 endpoint（含 scheme）
ACCESS_KEY="YOUR_ACCESS_KEY"
SECRET_KEY="YOUR_SECRET_KEY"
REGION="us-east-1"                   # 可选
BUCKET="my-test-bucket"
PREFIX="concurrent-test"             # S3 对象前缀
FILE_SIZE_MB=50
NUM_FILES=10
CONCURRENCY=8
TEST_DIR="./s3_test_files"
DEV_SRC="/dev/zero"                  # 测试用 /dev/zero（真实负载用 /dev/urandom）


# s3cmd extra options (add --host-bucket if your endpoint requires it)
S3CMD_OPTS="--access_key=${ACCESS_KEY} --secret_key=${SECRET_KEY} --host=${ENDPOINT} --region=${REGION} --no-check-certificate"
# ------------------------------------------------


# Helper: detect parallel runner
parallel_cmd() {
 if command -v parallel >/dev/null 2>&1; then
   echo "parallel"
 else
   echo "xargs"
 fi
}


# Creates test files named file.1, file.2, ...
prepare_files() {
 mkdir -p "$TEST_DIR"/upload
 echo "Generating $NUM_FILES files of ${FILE_SIZE_MB} MiB each in $TEST_DIR/upload ..."
 for i in $(seq 1 $NUM_FILES); do
   f="$TEST_DIR/upload/file.${i}"
   if [ -f "$f" ]; then
     echo "  - $f exists, skipping generation"
     continue
   fi
   # Use dd for portable creation; bs=1M count=... creates MiB
   dd if="$DEV_SRC" of="$f" bs=1M count="$FILE_SIZE_MB" status=none
   # optional: sync to ensure disk write finished
   sync
 done
 echo "Files ready."
}


# Upload single file (used by parallel/xargs)
upload_one() {
 local localpath="$1"
 local key="${PREFIX}/$(basename "$localpath")"
 # measure per-file time (seconds with nanoseconds)
 start=$(date +%s.%N)
 s3cmd put $S3CMD_OPTS "$localpath" "s3://${BUCKET}/${key}" >/dev/null 2>&1
 rc=$?
 end=$(date +%s.%N)
 if [ $rc -ne 0 ]; then
   echo "ERR_UP|$(basename "$localpath")|$rc"
   return $rc
 fi
 echo "OK_UP|$(basename "$localpath")|$(awk "BEGIN {print ($end - $start)}")"
}


# Download single file
download_one() {
 local keyfile="$1"  # basename like file.1
 local remote="s3://${BUCKET}/${PREFIX}/${keyfile}"
 local dest="$TEST_DIR/download/${keyfile}"
 start=$(date +%s.%N)
 s3cmd get $S3CMD_OPTS "$remote" "$dest" >/dev/null 2>&1
 rc=$?
 end=$(date +%s.%N)
 if [ $rc -ne 0 ]; then
   echo "ERR_DL|${keyfile}|$rc"
   return $rc
 fi
 echo "OK_DL|${keyfile}|$(awk "BEGIN {print ($end - $start)}")"
}


run_uploads() {
 echo "Starting concurrent upload test: $NUM_FILES files, concurrency=$CONCURRENCY ..."
 mkdir -p "$TEST_DIR/logs"
 rm -rf "$TEST_DIR/logs/upload.log" "$TEST_DIR/logs/upload_summary.log" || true
 runner=$(parallel_cmd)
 start_all=$(date +%s.%N)


 if [ "$runner" = "parallel" ]; then
   # GNU parallel: we pass list of files
   ls "$TEST_DIR/upload" | parallel -j "$CONCURRENCY" --no-notice --will-cite \
     bash -c 'bash -lc "upload_one \"${0}\""' {} 2> >(grep -v '^$' > "$TEST_DIR/logs/upload.log")
 else
   # fallback to xargs -P
   ls "$TEST_DIR/upload" | xargs -n1 -P "$CONCURRENCY" -I{} bash -c 'upload_one "{}"' 2> >(grep -v '^$' > "$TEST_DIR/logs/upload.log")
 fi


 end_all=$(date +%s.%N)
 # Summarize
 echo "Parsing upload logs..."
 awk -F'|' '
   BEGIN{ok=0;err=0;sumt=0}
   /^OK_UP/ {ok++; sumt+=($3)}
   /^ERR_UP/ {err++}
   END{
     print "upload_ok=" ok; print "upload_err=" err;
     print "sum_seconds=" sumt;
   }' "$TEST_DIR/logs/upload.log" > "$TEST_DIR/logs/upload_summary.log"


 total_seconds=$(awk -F'=' '/sum_seconds/ {print $2}' "$TEST_DIR/logs/upload_summary.log")
 total_bytes=$(( FILE_SIZE_MB * 1024 * 1024 * NUM_FILES ))
 # compute throughput MB/s using awk for floating math
 if [ -z "$total_seconds" ] || (( $(echo "$total_seconds == 0" | bc -l) )); then
   throughput="N/A"
 else
   throughput=$(awk -v tb="$total_bytes" -v s="$total_seconds" 'BEGIN{printf "%.2f", (tb/1024/1024)/s}')
 fi
 wall_time=$(awk "BEGIN {print ($end_all - $start_all)}")
 echo "UPLOAD_SUMMARY: total_bytes=${total_bytes} B, wall_time=${wall_time}s, aggregate_throughput=${throughput} MB/s"
 cat "$TEST_DIR/logs/upload_summary.log"
}


run_downloads() {
 echo "Starting concurrent download test: $NUM_FILES files, concurrency=$CONCURRENCY ..."
 mkdir -p "$TEST_DIR/download"
 mkdir -p "$TEST_DIR/logs"
 rm -f "$TEST_DIR/logs/download.log" "$TEST_DIR/logs/download_summary.log" || true
 runner=$(parallel_cmd)
 start_all=$(date +%s.%N)


 # Build list of filenames to download (assumes the same names as uploaded)
 filelist=$(ls "$TEST_DIR/upload")


 if [ "$runner" = "parallel" ]; then
   echo "$filelist" | parallel -j "$CONCURRENCY" --no-notice --will-cite \
     bash -c 'bash -lc "download_one \"${0}\""' {} 2> >(grep -v '^$' > "$TEST_DIR/logs/download.log")
 else
   echo "$filelist" | xargs -n1 -P "$CONCURRENCY" -I{} bash -c 'download_one "{}"' 2> >(grep -v '^$' > "$TEST_DIR/logs/download.log")
 fi


 end_all=$(date +%s.%N)
 # Summarize
 echo "Parsing download logs..."
 awk -F'|' '
   BEGIN{ok=0;err=0;sumt=0}
   /^OK_DL/ {ok++; sumt+=($3)}
   /^ERR_DL/ {err++}
   END{
     print "download_ok=" ok; print "download_err=" err;
     print "sum_seconds=" sumt;
   }' "$TEST_DIR/logs/download.log" > "$TEST_DIR/logs/download_summary.log"


 total_seconds=$(awk -F'=' '/sum_seconds/ {print $2}' "$TEST_DIR/logs/download_summary.log")
 total_bytes=$(( FILE_SIZE_MB * 1024 * 1024 * NUM_FILES ))
 if [ -z "$total_seconds" ] || (( $(echo "$total_seconds == 0" | bc -l) )); then
   throughput="N/A"
 else
   throughput=$(awk -v tb="$total_bytes" -v s="$total_seconds" 'BEGIN{printf "%.2f", (tb/1024/1024)/s}')
 fi
 wall_time=$(awk "BEGIN {print ($end_all - $start_all)}")
 echo "DOWNLOAD_SUMMARY: total_bytes=${total_bytes} B, wall_time=${wall_time}s, aggregate_throughput=${throughput} MB/s"
 cat "$TEST_DIR/logs/download_summary.log"
}


cleanup_remote_prefix() {
 echo "Cleaning up remote objects under s3://${BUCKET}/${PREFIX}/ ..."
 # Danger: this will recursively delete all objects under prefix
 s3cmd del $S3CMD_OPTS "s3://${BUCKET}/${PREFIX}/*" || true
 echo "Remote cleanup done (errors ignored)."
}


usage() {
 cat <<EOF
Usage: $0 [prepare|upload|download|both|cleanup]
 prepare   - create local files for upload
 upload    - run concurrent uploads
 download  - run concurrent downloads (assumes objects already on S3)
 both      - prepare + upload + download
 cleanup   - delete remote prefix objects
EOF
}


# Export functions so subshells (parallel/xargs) can call them
export -f upload_one download_one
export S3CMD_OPTS ENDPOINT ACCESS_KEY SECRET_KEY BUCKET PREFIX TEST_DIR FILE_SIZE_MB NUM_FILES


# main
cmd=${1:-both}
case "$cmd" in
 prepare)
   prepare_files
   ;;
 upload)
   prepare_files
   run_uploads
   ;;
 download)
   run_downloads
   ;;
 both)
   prepare_files
   run_uploads
   run_downloads
   ;;
 cleanup)
   cleanup_remote_prefix
   ;;
 *)
   usage
   exit 1
   ;;
esac

