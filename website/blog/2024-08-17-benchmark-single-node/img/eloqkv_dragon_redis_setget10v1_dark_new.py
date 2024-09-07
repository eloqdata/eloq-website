import matplotlib.pyplot as plt
import numpy as np
import sys
import os

sys.path.append(os.path.abspath('../../'))
import globals

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = [128, 256, 512,1024]

redis_read_throughput = [223.579,212.677,203.522,189.701]  # converted to K
dragonfly_read_throughput = [992.120,1529.612,1750.050, 1750.024]  # converted to K
eloqkv_read_throughput = [959.015,1405.901,1697.739,1593.660]

redis_read_latency = [0.786,1.983,4.788,11.412]
dragonfly_read_latency = [0.252,0.444,0.956,2.191]
eloqkv_read_latency = [0.271,0.554,1.367,3.375]

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

ax1.set_xlabel('Concurrent Connections', color='white',fontsize=16)
ax1.set_ylabel('Throughput ($\mathbf{KOps}$)', color='white',fontsize=16)
ax1.set_title('Read Write Mixed Workload Comparison', color='white',fontsize=18)
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white',fontsize=12)
ax1.tick_params(axis='y', colors='white')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, redis_read_latency_ms, '--', marker='o', color=globals.redis1n_color_2, label='Redis P999 Latency', linewidth=2)
line2_read = ax2.plot(index_read, dragonfly_read_latency_ms, '--', marker='o', color=globals.dragon1n_color, label='Dragonfly P999 Latency', linewidth=2)
line3_read = ax2.plot(index_read, eloqkv_read_latency_ms, '--', marker='o', color=globals.eloqkv1n_color_1, label='EloqKV P999 Latency', linewidth=2)

ax2.set_ylabel('P999 Latency ($\mathbf{ms}$)', color='white',fontsize=16)
ax2.tick_params(axis='y', colors='white')

# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
legend = ax2.legend(lines + lines2, labels + labels2, loc='upper left', facecolor='#2e2e2e',fontsize=14, ncol=2)

# Set legend text color to white
plt.setp(legend.get_texts(), color='white',fontsize=14)

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
#plt.show()
plt.savefig('eloqkv_dragon_redis_setget_new.png')  # Saves the plot as 'my_plot.png' in the current directory
plt.close()

