import matplotlib.pyplot as plt
import numpy as np

# Data based on provided actual data
concurrency_levels = [100, 200, 500]

# Throughput data (bar graph) in thousands (K)
redis_throughput = [316.285, 321.186, 287.329]  # converted to K
io_thread_throughput = [492.438, 399.212, 418.029]  # converted to K
eloqkv_throughput = [848.354, 1543.058, 1742.274]  # converted to K

# Latency data (line graph) in seconds
redis_latency = [0.423, 0.863, 2.543]
io_thread_latency = [0.279, 0.543, 1.423]
eloqkv_latency = [0.175, 0.263, 0.511]

# Convert latency to milliseconds for better readability on the graph
redis_latency_ms = [lat * 1000 for lat in redis_latency]
io_thread_latency_ms = [lat * 1000 for lat in io_thread_latency]
eloqkv_latency_ms = [lat * 1000 for lat in eloqkv_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))

# Bar plots for throughput
bar_width = 0.2
index = np.arange(len(concurrency_levels))
opacity = 0.8

bar1 = ax1.bar(index - bar_width, redis_throughput, bar_width, alpha=opacity, color='#7a5195', label='Redis Throughput')
bar2 = ax1.bar(index, io_thread_throughput, bar_width, alpha=opacity, color='#ef5675', label='Redis with IO Thread Throughput')
bar3 = ax1.bar(index + bar_width, eloqkv_throughput, bar_width, alpha=opacity, color='#ffa600', label='EloqKV Throughput')

ax1.set_xlabel('Concurrency Levels')
ax1.set_ylabel('Throughput (K)')
ax1.set_title('Write Workload Comparison')
ax1.set_xticks(index)
ax1.set_xticklabels(concurrency_levels)

# Latency data (line graph)
ax2 = ax1.twinx()
line1, = ax2.plot(index, redis_latency_ms, 'b--', marker='o', color='#7a5195', label='Redis Latency')
line2, = ax2.plot(index, io_thread_latency_ms, 'g--', marker='o', color='#ef5675', label='Redis with IO Thread Latency')
line3, = ax2.plot(index, eloqkv_latency_ms, 'r--', marker='o', color='#ffa600', label='EloqKV Latency')

ax2.set_ylabel('P99 Latency (ms)')

# Legends
#ax1.legend(loc='upper left')
#ax2.legend(loc='upper left')
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax2.legend(lines + lines2, labels + labels2, loc='upper left')



fig.tight_layout()
plt.show()

