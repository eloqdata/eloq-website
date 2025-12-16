import matplotlib.pyplot as plt
import numpy as np

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = [3200,4800,6400]

#redis_read_throughput = [223.579,212.677,203.522,189.701]  # converted to K
#dragonfly_read_throughput = [992.120,1529.612,1750.050, 1750.024]  # converted to K
#eloqkv_read_throughput = [959.015,1405.901,1697.739,1593.660]
#kvrocks_d1=[7.188,7.482,7.532]
eloqkv_d1=[126.518, 130.953, 131.253]
eloqkv_d2=[237.073, 245.262, 247.005]
eloqkv_d4=[421.385, 454.685, 453.196]
eloqkv_d6=[508.021, 605.293, 621.535]
eloqkv_d8=[562.457,640.401,639.804]
eloqkv_d8_48=[629.282,733.341, 803.157]
eloqkv_d10_48=[646.299,792.101, 860.527]

#kvrocks_d1=[445,667,872]
eloqkv_d1_lat=[25.2,36.6,48.7]
eloqkv_d2_lat=[13.5,19.5,25.8]
eloqkv_d4_lat=[7.5,10.5,14.1]
eloqkv_d6_lat=[6.2,7.9,10.2]
eloqkv_d8_lat=[5.6,7.4,9.9]
eloqkv_d8_48_lat=[5.0,6.5,7.9]
eloqkv_d10_48_lat=[4.9,6.0,7.4]

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
bar_width = 0.1
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(index_read - 3*bar_width, eloqkv_d1, bar_width, alpha=0.8, color='#1f77b4', label='EloqKV 32C 1D Throughput')
bar2_read = ax1.bar(index_read - 2*bar_width, eloqkv_d2, bar_width, alpha=0.8, color='#ff7f0e', label='EloqKV 32C 2D Throughput')
bar3_read = ax1.bar(index_read - bar_width, eloqkv_d4, bar_width, alpha=0.8, color='#2ca02c', label='EloqKV 32C 4D Throughput')
#bar3_read = ax1.bar(index_read - bar_width, eloqkv_d4, bar_width, alpha=0.8, color='#2ca02c', label='EloqKV 32C 4D Throughput')
bar4_read = ax1.bar(index_read, eloqkv_d6, bar_width, alpha=0.8, color='#d62728', label='EloqKV 32C 6D Throughput')
bar5_read = ax1.bar(index_read + bar_width, eloqkv_d8, bar_width, alpha=0.8, color='#9467bd', label='EloqKV 32C 8D Throughput')
bar6_read = ax1.bar(index_read + 2*bar_width, eloqkv_d8_48, bar_width, alpha=0.8, color='#8c564b', label='EloqKV 48C 8D Throughput')
bar7_read = ax1.bar(index_read + 3*bar_width, eloqkv_d10_48, bar_width, alpha=0.8, color='#e377c2', label='EloqKV 48C 10D Throughput')

ax1.set_xlabel('Concurrency Levels', color='white')
ax1.set_ylabel('Throughput (K)', color='white')
ax1.set_title('Write Workload Comparison', color='white')
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white')
ax1.tick_params(axis='y', colors='white')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, eloqkv_d1_lat, 'b--', marker='o', color='#1f77b4', label='EloqKV 32C 1D Latency')
line2_read = ax2.plot(index_read, eloqkv_d2_lat, 'g--', marker='o', color='#ff7f0e', label='EloqKV 32C 2D Latency')
line3_read = ax2.plot(index_read, eloqkv_d4_lat, 'r--', marker='o', color='#2ca02c', label='EloqKV 32C 4D Latency')
line3_read = ax2.plot(index_read, eloqkv_d6_lat, 'r--', marker='o', color='#d62728', label='EloqKV 32C 6D Latency')
line3_read = ax2.plot(index_read, eloqkv_d8_lat, 'r--', marker='o', color='#9467bd', label='EloqKV 32C 8D Latency')
line3_read = ax2.plot(index_read, eloqkv_d8_48_lat, 'r--', marker='o', color='#8c564b', label='EloqKV 48C 8D Latency')
line3_read = ax2.plot(index_read, eloqkv_d10_48_lat, 'r--', marker='o', color='#e377c2', label='EloqKV 48C 10D Latency')

ax2.set_ylabel('Avg Latency (ms)', color='white')
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

