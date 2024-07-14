import matplotlib.pyplot as plt
import numpy as np

# Data for read workload
read_concurrency_levels = [100, 200, 500]

redis_read_throughput = [337.815, 327.240, 291.278]  # converted to K
io_thread_read_throughput = [452.643, 455.942, 410.710]  # converted to K
eloqkv_read_throughput = [951.573, 1292.003, 1836.534]  # converted to K

redis_read_latency = [0.399, 0.847, 2.687]
io_thread_read_latency = [0.287, 0.519, 1.927]
eloqkv_read_latency = [0.167, 0.263, 0.495]

# Convert latency to milliseconds for better readability on the graph
redis_read_latency_ms = [lat * 1000 for lat in redis_read_latency]
io_thread_read_latency_ms = [lat * 1000 for lat in io_thread_read_latency]
eloqkv_read_latency_ms = [lat * 1000 for lat in eloqkv_read_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))  # 10 inches wide, 6 inches tall

# Bar plots for read throughput
bar_width = 0.2
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(index_read - bar_width, redis_read_throughput, bar_width, alpha=0.8, color='#7a5195', label='Redis Throughput')
bar2_read = ax1.bar(index_read, io_thread_read_throughput, bar_width, alpha=0.8, color='#ef5675', label='Redis with IO Thread Throughput')
bar3_read = ax1.bar(index_read + bar_width, eloqkv_read_throughput, bar_width, alpha=0.8, color='#ffa600', label='EloqKV Throughput')

ax1.set_xlabel('Concurrency Levels')
ax1.set_ylabel('Throughput (K)')
ax1.set_title('Read Workload Comparison')
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels)
#ax1.legend(loc='upper left')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, redis_read_latency_ms, 'b--', marker='o', color='#7a5195', label='Redis Latency')
line2_read = ax2.plot(index_read, io_thread_read_latency_ms, 'g--', marker='o', color='#ef5675', label='Redis with IO Thread Latency')
line3_read = ax2.plot(index_read, eloqkv_read_latency_ms, 'r--', marker='o', color='#ffa600', label='EloqKV Latency')

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
