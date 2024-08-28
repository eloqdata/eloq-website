import matplotlib.pyplot as plt
import numpy as np

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = ['write', 'read', 'mixed']

#redis_read_throughput = [237.433, 227.734, 220.342]  # converted to K
#dragonfly_read_throughput = [672.876, 1164.402, 1750.047]  # converted to K
eloqkv_read_throughput = [1726.032, 1738.958, 1726.461]  # converted to K
eloqkv_cluster_read_throughput = [4833.860,4981.322,4889.497]

#redis_read_latency = [0.85,1.625,5.545]
#dragonfly_read_latency = [0.295, 0.393,1.092]
#eloqkv_read_latency = [0.300, 0.579, 1.796]

# Convert latency to milliseconds for better readability on the graph
#redis_read_latency_ms = [lat * 1000 for lat in redis_read_latency]
#dragonfly_read_latency_ms = [lat * 1000 for lat in dragonfly_read_latency]
#eloqkv_read_latency_ms = [lat * 1000 for lat in eloqkv_read_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))  # 10 inches wide, 6 inches tall
fig.patch.set_facecolor('#2e2e2e')  # Figure background color
ax1.set_facecolor('#2e2e2e')  # Axes background color

# Bar plots for read throughput
bar_width = 0.2
index_read = np.arange(len(read_concurrency_levels))

#bar1_read = ax1.bar(index_read - bar_width, redis_read_throughput, bar_width, alpha=0.8, color='#1f77b4', label='Redis Throughput')
#bar2_read = ax1.bar(index_read, dragonfly_read_throughput, bar_width, alpha=0.8, color='#ff7f0e', label='Dragonfly Throughput')
#bar3_read = ax1.bar(index_read + bar_width, eloqkv_read_throughput, bar_width, alpha=0.8, color='#2ca02c', label='EloqKV Throughput')
bar3_read = ax1.bar(index_read - 0.5*bar_width, eloqkv_read_throughput, bar_width, alpha=0.8, color='#ff7f0e', label='EloqKV*1 Throughput')
bar3_read = ax1.bar(index_read + 0.5 * bar_width, eloqkv_cluster_read_throughput, bar_width, alpha=0.8, color='#2ca02c', label='EloqKV*3 Throughput')

ax1.set_xlabel('Concurrency Levels', color='white', fontsize=14)
ax1.set_ylabel('Throughput (($\mathbf{K}$))', color='white', fontsize=14)
ax1.set_title('Cluster Mode Throught Comparison', color='white', pad=10,  fontsize=16)
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white')
ax1.tick_params(axis='y', colors='white')
ax1.set_ylim(0, 6000)  # Adjust this value to leave more space at the top


# Latency data (line graph)
#ax2 = ax1.twinx()
#line1_read = ax2.plot(index_read, redis_read_latency_ms, 'b--', marker='o', color='#1f77b4', label='Redis P999 Latency')
#line2_read = ax2.plot(index_read, dragonfly_read_latency_ms, 'g--', marker='o', color='#ff7f0e', label='Dragonfly P999 Latency')
#line3_read = ax2.plot(index_read, eloqkv_read_latency_ms, 'r--', marker='o', color='#2ca02c', label='EloqKV P999 Latency')

#ax2.set_ylabel('P999 Latency (us)', color='white')
#ax2.tick_params(axis='y', colors='white')

# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
#lines2, labels2 = ax2.get_legend_handles_labels()
#legend = ax2.legend(lines + lines2, labels + labels2, loc='upper left', facecolor='#2e2e2e',fontsize=12)
legend = ax1.legend(lines, labels, loc='upper left', facecolor='#2e2e2e',fontsize=14)

# Set legend text color to white
plt.setp(legend.get_texts(), color='white', fontsize=14)

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
#plt.show()
plt.savefig('eloqkv_scale.png')  # Saves the plot as 'my_plot.png' in the current directory
plt.close()
