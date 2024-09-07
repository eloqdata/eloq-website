import matplotlib.pyplot as plt
import numpy as np
import sys
import os

sys.path.append(os.path.abspath('../../'))
import globals

# Set the dark background style
#plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = [400,800,1600,3200]

#redis_read_throughput = [223.579,212.677,203.522,189.701]  # converted to K
#dragonfly_read_throughput = [992.120,1529.612,1750.050, 1750.024]  # converted to K
#eloqkv_read_throughput = [959.015,1405.901,1697.739,1593.660]
#kvrocks_d1=[7.188,7.482,7.532]
kvrocks_ebs=[77.512,78.239,76.909,77.735]
kvrocks_ssd=[266.295,269.186,269.600,264.539]
eloqkv_ebs=[723.765,898.093,950.454,928.489]
eloqkv_ssd=[810.566,890.901,918.444,883.972]


#kvrocks_d1=[445,667,872]
kvrocks_ebs_r_lat=[4.85,9.31,19.97,39.97]
kvrocks_ssd_r_lat=[1.45, 2.93, 5.88, 12.04]
eloqkv_ebs_r_lat=[0.21,0.51,1.21,2.76]
eloqkv_ssd_r_lat=[0.38,0.74, 1.51, 3.18]
kvrocks_ebs_w_lat=[8.18,19.21,28.99,52.80]
kvrocks_ssd_w_lat=[1.91, 3.34, 6.40, 12.49]
eloqkv_ebs_w_lat=[3.89,4.64,6.38,10.17]
eloqkv_ssd_w_lat=[1.58,2.45,4.01,7.89]
#eloqkv_d1_lat=[25.2,36.6,48.7]
#eloqkv_d2_lat=[13.5,19.5,25.8]
#eloqkv_d4_lat=[7.5,10.5,14.1]
#eloqkv_d6_lat=[6.2,7.9,10.2]

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
bar_width = 0.2
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(index_read - 1.5*bar_width, kvrocks_ebs, bar_width, alpha=0.8, color=globals.kvrocks1n_color_1, label='Kvrocks EBS')
bar2_read = ax1.bar(index_read - 0.5*bar_width, kvrocks_ssd, bar_width, alpha=0.8, color=globals.kvrocks1n_color_2, label='Kvrocks Local SSD')
bar3_read = ax1.bar(index_read + 0.5*bar_width, eloqkv_ebs, bar_width, alpha=0.8, color=globals.eloqkv1n_color_1, label='EloqKV EBS')
bar4_read = ax1.bar(index_read+ 1.5*bar_width, eloqkv_ssd, bar_width, alpha=0.8, color=globals.eloqkv1n_color_2, label='EloqKV Local SSD')

ax1.set_xlabel('Concurrent Connections', color='white', fontsize=globals.axis_label_size)
ax1.set_ylabel('Throughput ($\mathbf{KOps}$)', color='white', fontsize=globals.axis_label_size)
ax1.set_title('EloqKV & Kvrocks Mix Workload Comparison', color='white', fontsize=globals.title_size)
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color='white',fontsize=globals.axis_value_size)
ax1.set_ylim(0, 1400)  # Adjust this value to leave more space at the top
ax1.tick_params(axis='y',labelsize=globals.axis_value_size, colors='white')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, kvrocks_ebs_w_lat, ':', marker='o', color=globals.kvrocks1n_color_1, label='Kvrocks EBS W-Lat', linewidth=2.5)
line2_read = ax2.plot(index_read, kvrocks_ssd_w_lat, ':', marker='o', color=globals.kvrocks1n_color_2, label='Kvrocks Local SSD W-Lat', linewidth=2.5)
line3_read = ax2.plot(index_read, eloqkv_ebs_w_lat, ':', marker='o', color=globals.eloqkv1n_color_1, label='EloqKV EBS W-Lat', linewidth=2.5)
line4_read = ax2.plot(index_read, eloqkv_ssd_w_lat, ':', marker='o', color=globals.eloqkv1n_color_2, label='EloqKV Local SSD W-Lat', linewidth=2.5)
line5_read = ax2.plot(index_read, kvrocks_ebs_r_lat, '-.', marker='*', color=globals.kvrocks1n_color_1, label='Kvrocks EBS R-Lat', linewidth=2.5)
line6_read = ax2.plot(index_read, kvrocks_ssd_r_lat, '-.', marker='*', color=globals.kvrocks1n_color_2, label='Kvrocks Local SSD R-Lat', linewidth=2.5)
line7_read = ax2.plot(index_read, eloqkv_ebs_r_lat, '-.', marker='*', color=globals.eloqkv1n_color_1, label='EloqKV EBS R-Lat', linewidth=2.5)
line8_read = ax2.plot(index_read, eloqkv_ssd_r_lat, '-.', marker='*', color=globals.eloqkv1n_color_2, label='EloqKV Local SSD R-Lat', linewidth=2.5)

ax2.set_ylabel('Avg Latency ($\mathbf{ms}$)', color='white', fontsize=globals.axis_label_size)
ax2.set_ylim(0, 80)  # Adjust this value to leave more space at the top
ax2.tick_params(axis='y',labelsize=globals.axis_value_size, colors='white')

# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
legend = ax2.legend(lines2, labels2, loc='upper left', facecolor='#2e2e2e',fontsize=globals.legend_size, ncol=2)
#ax2.legend(ncol=2)  # Legend with two columns

# Set legend text color to white
plt.setp(legend.get_texts(), color='white')

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
#plt.show()

plt.savefig('eloqkv_kvrocks_setget.png')  # Saves the plot as 'my_plot.png' in the current directory
plt.close()
