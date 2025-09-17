import matplotlib.pyplot as plt
import numpy as np
from matplotlib.ticker import FuncFormatter

import sys
import os

sys.path.append(os.path.abspath('../../'))
import globals


# Set the dark background style
# plt.style.use('dark_background')

# Data for read workload
read_concurrency_levels = ["read", "mixed", "write"]

# redis_read_throughput = [223.579,212.677,203.522,189.701]  # converted to K
# dragonfly_read_throughput = [992.120,1529.612,1750.050, 1750.024]  # converted to K
# eloqkv_read_throughput = [959.015,1405.901,1697.739,1593.660]
# kvrocks_d1=[7.188,7.482,7.532]
#eloqkv_b1 = [552.821, 610.495, 637.585]
#eloqkv_b2 = [327.373, 342.626, 383.335]
#eloqkv_b3 = [247.061, 239.161, 261.655]
#eloqkv_b4 = [188.104, 178.573, 192.970]
#eloqkv_b5 = [150.262, 153.487, 153.347]
#eloqkv_b6 = [114.269, 122.170, 132.704]

#eloqkv_b1_retry=[314,243,0]
#eloqkv_b2_retry=[1421,1102,0]
#eloqkv_b3_retry=[3320,2802,0]
#eloqkv_b4_retry=[6349,5189,0]
#eloqkv_b5_retry=[9972,7961,0]
#eloqkv_b6_retry=[14784,12168,0]

eloqkv_b1= [637.585, 610.495, 552.821]
eloqkv_b2= [383.335, 342.626, 327.373]
eloqkv_b3= [261.655, 239.161, 247.061]
eloqkv_b4= [192.970, 178.573, 188.104]
eloqkv_b5= [153.347, 153.487, 150.262]
eloqkv_b6= [132.704, 122.170, 114.269]

eloqkv_b1_retry= [0, 1271, 1684]
eloqkv_b2_retry= [0, 5535, 6547]
eloqkv_b3_retry= [0, 12529, 15255]
eloqkv_b4_retry= [0, 22144, 27302]
eloqkv_b5_retry= [0, 34783, 43087]
eloqkv_b6_retry= [0, 49952, 60674]

# Function to calculate the retry rate
def calculate_retry_rate(retry_list):
    return [x / 5000000 for x in retry_list]

# Calculating the retry rates
eloqkv_b1_retry_rate = calculate_retry_rate(eloqkv_b1_retry)
eloqkv_b2_retry_rate = calculate_retry_rate(eloqkv_b2_retry)
eloqkv_b3_retry_rate = calculate_retry_rate(eloqkv_b3_retry)
eloqkv_b4_retry_rate = calculate_retry_rate(eloqkv_b4_retry)
eloqkv_b5_retry_rate = calculate_retry_rate(eloqkv_b5_retry)
eloqkv_b6_retry_rate = calculate_retry_rate(eloqkv_b6_retry)

eloqkv_b1_retry_rate = [rate * 100 for rate in eloqkv_b1_retry_rate]
eloqkv_b2_retry_rate = [rate * 100 for rate in eloqkv_b2_retry_rate]
eloqkv_b3_retry_rate = [rate * 100 for rate in eloqkv_b3_retry_rate]
eloqkv_b4_retry_rate = [rate * 100 for rate in eloqkv_b4_retry_rate]
eloqkv_b5_retry_rate = [rate * 100 for rate in eloqkv_b5_retry_rate]
eloqkv_b6_retry_rate = [rate * 100 for rate in eloqkv_b6_retry_rate]

# redis_read_latency = [0.786,1.983,4.788,11.412]
# dragonfly_read_latency = [0.252,0.444,0.956,2.191]
# eloqkv_read_latency = [0.271,0.554,1.367,3.375]

# Convert latency to milliseconds for better readability on the graph
# redis_read_latency_ms = [lat * 1000 for lat in redis_read_latency]
# dragonfly_read_latency_ms = [lat * 1000 for lat in dragonfly_read_latency]
# eloqkv_read_latency_ms = [lat * 1000 for lat in eloqkv_read_latency]

# Plotting the data
fig, ax1 = plt.subplots(figsize=(10, 6))  # 10 inches wide, 6 inches tall
fig.patch.set_facecolor("#2e2e2e")  # Figure background color
ax1.set_facecolor("#2e2e2e")  # Axes background color

# Bar plots for read throughput
bar_width = 0.13
index_read = np.arange(len(read_concurrency_levels))

bar1_read = ax1.bar(
    index_read - 2.5 * bar_width,
    eloqkv_b1,
    bar_width,
    alpha=0.8,
    color=globals.group_1,
    label="Batch Size: 1",
)
bar1_read = ax1.bar(
    index_read - 1.5 * bar_width,
    eloqkv_b2,
    bar_width,
    alpha=0.8,
    color=globals.group_2,
    label="Batch Size: 2",
)
bar2_read = ax1.bar(
    index_read - 0.5 * bar_width,
    eloqkv_b3,
    bar_width,
    alpha=0.8,
    color=globals.group_3,
    label="Batch Size: 3",
)
bar3_read = ax1.bar(
    index_read + 0.5 * bar_width,
    eloqkv_b4,
    bar_width,
    alpha=0.8,
    color=globals.group_4,
    label="Batch Size: 4",
)
bar4_read = ax1.bar(
    index_read + 1.5 * bar_width,
    eloqkv_b5,
    bar_width,
    alpha=0.8,
    color=globals.group_5,
    label="Batch Size: 5",
)
bar4_read = ax1.bar(
    index_read + 2.5 * bar_width,
    eloqkv_b6,
    bar_width,
    alpha=0.8,
    color=globals.group_6,
    label="Batch Size: 6",
)

ax1.set_xlabel("Workload Type", color="white", fontsize=globals.axis_label_size)
ax1.set_ylabel("Throughput ($\mathbf{KOps}$)", color="white", fontsize=globals.axis_label_size)
ax1.set_title(
    "EloqKV Throughput Analysis with Varying Batch Sizes", color="white", fontsize=globals.title_size
)
ax1.set_xticks(index_read)
ax1.set_xticklabels(read_concurrency_levels, color="white", fontsize=globals.axis_value_size)
ax1.set_ylim(0, 1000)  # Adjust this value to leave more space at the top
ax1.tick_params(axis='y',labelsize=globals.axis_value_size, colors='white')

# Latency data (line graph)
ax2 = ax1.twinx()
line1_read = ax2.plot(index_read, eloqkv_b1_retry_rate, '--', marker='o', color=globals.group_1, linewidth=3)
line2_read = ax2.plot(index_read, eloqkv_b2_retry_rate, '--', marker='o', color=globals.group_2, linewidth=3)
line3_read = ax2.plot(index_read, eloqkv_b3_retry_rate, '--', marker='o', color=globals.group_3, linewidth=3)
line4_read = ax2.plot(index_read, eloqkv_b4_retry_rate, '--', marker='o', color=globals.group_4, linewidth=3)
line5_read = ax2.plot(index_read, eloqkv_b5_retry_rate, '--', marker='o', color=globals.group_5, linewidth=3)
line6_read = ax2.plot(index_read, eloqkv_b6_retry_rate, '--', marker='o', color=globals.group_6, linewidth=3)

# Function to format the y-axis labels as percentages
def percent_formatter(x, pos):
    return f'{x:.1f}%'

ax2.set_ylabel('TX Retry Rate', color='white', fontsize=globals.axis_label_size)
ax2.set_ylim(0, 2)  # Adjust this value to leave more space at the top
ax2.tick_params(axis='y',labelsize=globals.axis_value_size, colors='white')
ax2.yaxis.set_major_formatter(FuncFormatter(percent_formatter))


# Combine legends from both axes
lines, labels = ax1.get_legend_handles_labels()
# lines2, labels2 = ax2.get_legend_handles_labels()
legend = ax1.legend(
    lines, labels, loc="upper left", facecolor="#2e2e2e", fontsize=globals.legend_size, ncol=2
)
# ax2.legend(ncol=2)  # Legend with two columns

# Set legend text color to white
plt.setp(legend.get_texts(), color="white")

# Adjust layout to prevent clipping
fig.tight_layout()

# Show plot
# plt.show()

plt.savefig(
    "eloqkv_cluster_batch_size.png"
)  # Saves the plot as 'my_plot.png' in the current directory
plt.close()
