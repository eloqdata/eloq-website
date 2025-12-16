import matplotlib.pyplot as plt
import numpy as np

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = [128, 256, 640]

redis_read_throughput = [230.370, 221.307, 214.191]  # converted to K
dragonfly_read_throughput = [660.514, 1154.724, 1750.049]  # converted to K
eloqkv_read_throughput = [993.415, 1416.331, 1726.032]  # converted to K

redis_read_latency = [1.319, 2.735, 7.273]
dragonfly_read_latency = [0.295, 0.412, 1.161]
eloqkv_read_latency = [0.313, 0.615, 1.759]

# Convert latency to milliseconds for better readability on the graph
redis_read_latency_ms = [lat * 1000 for lat in redis_read_latency]
dragonfly_read_latency_ms = [lat * 1000 for lat in dragonfly_read_latency]
eloqkv_read_latency_ms = [lat * 1000 for lat in eloqkv_read_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))  # 10 inches wide, 6 inches tall
fig.patch.set_facecolor('#2e2e2e')  # Figure background color
ax1.set_facecolor('#2e2e2e')  # Axes background color

# Bar plots for read throughput
bar_width = 0.2
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(index_read - bar_width, redis_read_throughput, bar_width, alpha=0.8, color='#1f77b4', label='Redis Throughput')
bar2_read = ax1.bar(index_read, dragonfly_read_throughput, bar_width, alpha=0.8, color='#ff7f0e', label='Dragonfly Throughput')
bar3_read = ax1.bar(index_read + bar_width, eloqkv_read_throughput, bar_width, alpha=0.8, color='#2ca02c', label='EloqKV Throughput')

ax1.set_xlabel('Concurrency Levels', color='white')
ax1.set_ylabel('Throughput (K)', color='white')
ax1.set_title('Write Only Workload Comparison', color='white')
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white')
ax1.tick_params(axis='y', colors='white')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, redis_read_latency_ms, 'b--', marker='o', color='#1f77b4', label='Redis P999 Latency')
line2_read = ax2.plot(index_read, dragonfly_read_latency_ms, 'g--', marker='o', color='#ff7f0e', label='Dragonfly P999 Latency')
line3_read = ax2.plot(index_read, eloqkv_read_latency_ms, 'r--', marker='o', color='#2ca02c', label='EloqKV P999 Latency')

ax2.set_ylabel('P999 Latency (us)', color='white')
ax2.tick_params(axis='y', colors='white')

# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
legend = ax2.legend(lines + lines2, labels + labels2, loc='upper left', facecolor='#2e2e2e',fontsize=12)

# Set legend text color to white
plt.setp(legend.get_texts(), color='white')

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
plt.show()

