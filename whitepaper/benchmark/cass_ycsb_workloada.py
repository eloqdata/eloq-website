import matplotlib.pyplot as plt
import numpy as np

# Data for read workload
read_concurrency_levels = [100, 200, 500]

kvrocks_throughput = [218.161, 246.939,233.743]  # converted to K
eloqkv_throughput = [785.620, 1024.182,1099.032]  # converted to K

kvrocks_read_latency = [1.570,3.159,13.343]
kvrocks_update_latency = [1.407, 3.141, 14.391]
eloqkv_read_latency = [0.215,0.378 , 0.856]
eloqkv_update_latency = [0.206,0.370 , 0.850]

# Convert latency to milliseconds for better readability on the graph
#redis_read_latency_ms = [lat * 1000 for lat in redis_read_latency]
#io_thread_read_latency_ms = [lat * 1000 for lat in io_thread_read_latency]
#eloqkv_read_latency_ms = [lat * 1000 for lat in eloqkv_read_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))  # 10 inches wide, 6 inches tall

# Bar plots for read throughput
bar_width = 0.2
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(index_read - bar_width, kvrocks_throughput, bar_width, alpha=0.8, color='#7a5195', label='Kvrocks Throughtput')
bar2_read = ax1.bar(index_read, eloqkv_throughput, bar_width, alpha=0.8, color='#ffa600', label='EloqKV Throughput')

ax1.set_xlabel('Concurrency Levels')
ax1.set_ylabel('Throughput (K)')
ax1.set_title('YCSB Workloada Comparison')
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels)
#ax1.legend(loc='upper left')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, kvrocks_read_latency, 'b--', marker='o', color='#7a5195', label='Kvrocks Read Latency')
line2_read = ax2.plot(index_read, kvrocks_update_latency, 'g--', marker='o', color='#ef5675', label='Kvrocks Update Latency')
line3_read = ax2.plot(index_read, eloqkv_read_latency, 'r--', marker='o', color='#ffa600', label='EloqKV Read Latency')
line4_read = ax2.plot(index_read, eloqkv_update_latency, 'o--', marker='o', color='#003f5c', label='EloqKV Update Latency')

ax2.set_ylabel('P99 Latency (ms)')
#ax2.legend(loc='upper right')

lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax2.legend(lines + lines2, labels + labels2, loc='upper left')


fig.tight_layout()
plt.show()


# Legends
#ax1.legend(loc='upper left')
#ax2.legend(loc='upper left')
