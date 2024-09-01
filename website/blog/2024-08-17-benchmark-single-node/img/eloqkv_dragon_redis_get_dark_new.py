import matplotlib.pyplot as plt
import numpy as np

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = [128, 256, 512,1024]

redis_read_throughput = [227.053,215.988,205.523,194.250]  # converted to K
dragonfly_read_throughput = [996.835,1533.526,1750.048,1750.018]  # converted to K
eloqkv_read_throughput = [948.436,1407.663,1668.245,1671.334]  # converted to K

redis_read_latency = [0.775,1.951,4.714,11.071]
dragonfly_read_latency = [0.250,0.500,0.919,2.292]
eloqkv_read_latency = [0.287,0.527,1.503,2.847]

# Convert latency to milliseconds for better readability on the graph
redis_read_latency_ms = [lat * 1 for lat in redis_read_latency]
dragonfly_read_latency_ms = [lat * 1 for lat in dragonfly_read_latency]
eloqkv_read_latency_ms = [lat * 1 for lat in eloqkv_read_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))  # 10 inches wide, 6 inches tall
fig.patch.set_facecolor('#2e2e2e')  # Figure background color
ax1.set_facecolor('#2e2e2e')  # Axes background color
ax1.set_ylim(0, 2500)  # Adjust this value to leave more space at the top

# Bar plots for read throughput
bar_width = 0.2
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(index_read - bar_width, redis_read_throughput, bar_width, alpha=0.8, color='#1A6B3D', label='Redis Throughput')
bar2_read = ax1.bar(index_read, dragonfly_read_throughput, bar_width, alpha=0.8, color='#1A4D6B', label='Dragonfly Throughput')
bar3_read = ax1.bar(index_read + bar_width, eloqkv_read_throughput, bar_width, alpha=0.8, color='#D64326', label='EloqKV Throughput')

ax1.set_xlabel('Concurrent Connections', color='white',fontsize=16)
ax1.set_ylabel('Throughput ($\mathbf{KOps}$)', color='white',fontsize=16)
ax1.set_title('Read Only Workload Comparison', color='white',fontsize=18)
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white',fontsize=12)
ax1.tick_params(axis='y', colors='white')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, redis_read_latency_ms, 'b--', marker='o', color='#1A6B3D', label='Redis P999 Latency', linewidth=2)
line2_read = ax2.plot(index_read, dragonfly_read_latency_ms, 'g--', marker='o', color='#1A4D6B', label='Dragonfly P999 Latency', linewidth=2)
line3_read = ax2.plot(index_read, eloqkv_read_latency_ms, 'r--', marker='o', color='#D64326', label='EloqKV P999 Latency', linewidth=2)

ax2.set_ylabel('P999 Latency ($\mathbf{ms}$)', color='white',fontsize=14)
ax2.tick_params(axis='y', colors='white')

# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
legend = ax2.legend(lines + lines2, labels + labels2, loc='upper left', facecolor='#2e2e2e',fontsize=14, ncol=2)

# Set legend text color to white
plt.setp(legend.get_texts(), color='white',fontsize=16)

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
#plt.show()
plt.savefig('eloqkv_dragon_redis_get_new.png')  # Saves the plot as 'my_plot.png' in the current directory
plt.close()
