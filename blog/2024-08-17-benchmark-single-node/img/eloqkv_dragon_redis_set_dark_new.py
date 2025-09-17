import matplotlib.pyplot as plt
import numpy as np
import sys
import os

sys.path.append(os.path.abspath('../../'))
import globals

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = [128, 256, 512, 1024]

redis_read_throughput = [215.691, 207.421, 198.162, 182.797]  # converted to K
dragonfly_read_throughput = [985.558, 1518.033, 1750.048, 1750.019]  # converted to K
eloqkv_read_throughput = [957.403,1408.006,1703.075,1700.957]

redis_read_latency = [0.812, 2.015, 4.906, 11.754]
dragonfly_read_latency = [0.255,0.468,0.996,2.410]
eloqkv_read_latency = [0.292,0.594,1.524,2.836]

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

bar1_read = ax1.bar(index_read - bar_width, redis_read_throughput, bar_width, alpha=0.8, color=globals.redis1n_color_2, label='Redis Throughput')
bar2_read = ax1.bar(index_read, dragonfly_read_throughput, bar_width, alpha=0.8, color=globals.dragon1n_color, label='Dragonfly Throughput')
bar3_read = ax1.bar(index_read + bar_width, eloqkv_read_throughput, bar_width, alpha=0.8, color=globals.eloqkv1n_color_1, label='EloqKV Throughput')

ax1.set_xlabel('Concurrent Connections', color='white',fontsize=globals.axis_label_size)
ax1.set_ylabel('Throughput ($\mathbf{KOps}$)', color='white',fontsize=globals.axis_label_size)
ax1.set_title('Write Only Workload Comparison', color='white',fontsize=globals.title_size)
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white',fontsize=globals.axis_value_size)
ax1.tick_params(axis='y',labelsize=globals.axis_value_size, colors='white')


# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, redis_read_latency_ms, '--', marker='o', color=globals.redis1n_color_2, label='Redis P999 Latency', linewidth=2)
line2_read = ax2.plot(index_read, dragonfly_read_latency_ms, '--', marker='o', color=globals.dragon1n_color, label='Dragonfly P999 Latency', linewidth=2)
line3_read = ax2.plot(index_read, eloqkv_read_latency_ms, '--', marker='o', color=globals.eloqkv1n_color_1, label='EloqKV P999 Latency', linewidth=2)

ax2.set_ylabel('P999 Latency ($\mathbf{ms}$)', color='white', fontsize=globals.axis_label_size)
ax2.tick_params(axis='y',labelsize=globals.axis_value_size, colors='white')


# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
legend = ax2.legend(lines + lines2, labels + labels2, loc='upper left', facecolor='#2e2e2e',fontsize=globals.legend_size, ncol=2)

# Set legend text color to white
plt.setp(legend.get_texts(), color='white')

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
#plt.show()
plt.savefig('eloqkv_dragon_redis_set_new.png')
plt.close()
