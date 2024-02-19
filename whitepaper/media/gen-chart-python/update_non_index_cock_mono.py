import matplotlib.pyplot as plt

# Benchmark results for cockroach 16c*3
thread_num_s = ['100', '200', '500', '1000', '2000']
qps_s = [23667.09, 26893.95,29108.16,30162.21, 30444.77]
# Benchmark results for T-shirt S
thread_num_m = ['100', '200', '500', '1000', '2000']
qps_m = [36004.19,45525.52,51368.46,53285.93, 55520.81]
# Benchmark results for T-shirt M
thread_num_l = ['100', '200', '500', '1000', '2000']
qps_l = [32854.08, 55777.87, 87811.37, 117633.25,149810.25]
thread_num_x = ['100', '200', '500', '1000', '2000']
qps_x = [34080.49,64030.73, 135422.29,200779.77,256266.34]

# Custom colors for bars
#color_s = '#ff9999'  # Red
#color_m = '#66b3ff'  # Blue
#color_l = '#66ff66'  # Green
#color_x = '#b366ff'
color_s = '#003f5c'  # Red
color_m = '#7a5195'  # Blue
color_l = '#ef5675'  # Green
color_x = '#ffa600'

# Bar width for better visualization
bar_width = 0.2 # Reduce bar width for clearer visualization of multiple bars
index = range(len(thread_num_s))  # Using the length of any size for indexing

# Plotting the bar chart with custom colors
plt.figure(figsize=(12, 7))

plt.bar([i - 3*bar_width/2 for i in index], qps_s, bar_width, color=color_s, label='NewSQL 16*3')
plt.bar([i - bar_width/2 for i in index], qps_m, bar_width, color=color_m, label='NewSQL 32*3')
plt.bar([i +  bar_width/2 for i in index], qps_l, bar_width, color=color_l, label='MonographDB 16*3')  # Adjust bar positions
plt.bar([i + 3*bar_width/2 for i in index], qps_x, bar_width, color=color_x, label='MonographDB 32*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Single Update Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s)  # Using thread_num_s as x-axis labels
plt.legend()

plt.tight_layout()
plt.savefig('update_non_index_cock_mono.png')  # Save the updated plot as PNG

