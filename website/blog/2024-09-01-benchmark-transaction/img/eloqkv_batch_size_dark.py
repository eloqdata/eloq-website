import matplotlib.pyplot as plt
import numpy as np

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = ['write', 'mixed', 'read']

#redis_read_throughput = [223.579,212.677,203.522,189.701]  # converted to K
#dragonfly_read_throughput = [992.120,1529.612,1750.050, 1750.024]  # converted to K
#eloqkv_read_throughput = [959.015,1405.901,1697.739,1593.660]
#kvrocks_d1=[7.188,7.482,7.532]
eloqkv_b1=[710.093, 748.217,733.441]
eloqkv_b2=[609.558,591.177,619.505]
eloqkv_b3=[531.852,518.649,541.366]
eloqkv_b4=[464.404,450.643,482.582]
eloqkv_b5=[411.768,389.826,411.803]
eloqkv_b6=[369.556,345.931,373.184]

#redis_read_latency = [0.786,1.983,4.788,11.412]
#dragonfly_read_latency = [0.252,0.444,0.956,2.191]
#eloqkv_read_latency = [0.271,0.554,1.367,3.375]

# Convert latency to milliseconds for better readability on the graph
#redis_read_latency_ms = [lat * 1000 for lat in redis_read_latency]
#dragonfly_read_latency_ms = [lat * 1000 for lat in dragonfly_read_latency]
#eloqkv_read_latency_ms = [lat * 1000 for lat in eloqkv_read_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))  # 10 inches wide, 6 inches tall
fig.patch.set_facecolor('#2e2e2e')  # Figure background color
ax1.set_facecolor('#2e2e2e')  # Axes background color

# Bar plots for read throughput
bar_width = 0.13
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(index_read - 2.5*bar_width, eloqkv_b1, bar_width, alpha=0.8, color='#1A6B3D', label='Batch Size: 1')
bar1_read = ax1.bar(index_read - 1.5*bar_width, eloqkv_b2, bar_width, alpha=0.8, color='#1A4D6B', label='Batch Size: 2')
bar2_read = ax1.bar(index_read - 0.5*bar_width, eloqkv_b3, bar_width, alpha=0.8, color='#9CC725', label='Batch Size: 3')
bar3_read = ax1.bar(index_read + 0.5*bar_width, eloqkv_b4, bar_width, alpha=0.8, color='#E0BD28', label='Batch Size: 4')
bar4_read = ax1.bar(index_read+ 1.5*bar_width, eloqkv_b5, bar_width, alpha=0.8, color='#E07D28', label='Batch Size: 5')
bar4_read = ax1.bar(index_read+ 2.5*bar_width, eloqkv_b6, bar_width, alpha=0.8, color='#D64326', label='Batch Size: 6')

ax1.set_xlabel('Workload Type', color='white', fontsize=16)
ax1.set_ylabel('Throughput ($\mathbf{KOps}$)', color='white', fontsize=16)
ax1.set_title('EloqKV Throughput Analysis with Varying Batch Sizes', color='white', fontsize=18)
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white', fontsize=14)
ax1.tick_params(axis='y', colors='white')
ax1.set_ylim(0, 1000)  # Adjust this value to leave more space at the top
#ax1.set_xlim(0, 800)  # Adjust this value to leave more space at the top

# Latency data (line graph)
#ax2 = ax1.twinx()
#line1_read = ax2.plot(index_read, eloqkv_d8_lat, 'b--', marker='o', color='#208B8E', label='EloqKV 32C 1D Latency', linewidth=3)
#line2_read = ax2.plot(index_read, eloqkv_d10_lat, 'g--', marker='o', color='#739C23', label='EloqKV 32C 2D Latency', linewidth=3)
#line3_read = ax2.plot(index_read, eloqkv_d8_48_lat, 'r--', marker='o', color='#E07D28', label='EloqKV 32C 4D Latency', linewidth=3)
#line3_read = ax2.plot(index_read, eloqkv_d10_48_lat, 'r--', marker='o', color='#D64326', label='EloqKV 32C 6D Latency', linewidth=3)

#ax2.set_ylabel('Avg Latency ($\mathbf{ms}$)', color='white', fontsize=16)
#ax2.tick_params(axis='y', colors='white')
#ax2.set_ylim(0, 15)  # Adjust this value to leave more space at the top

# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
#lines2, labels2 = ax2.get_legend_handles_labels()
legend = ax1.legend(lines, labels, loc='upper left', facecolor='#2e2e2e',fontsize=14, ncol=2)
#ax2.legend(ncol=2)  # Legend with two columns

# Set legend text color to white
plt.setp(legend.get_texts(), color='white', fontsize=14)

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
#plt.show()

plt.savefig('eloqkv_batch_size.png')  # Saves the plot as 'my_plot.png' in the current directory
plt.close()
