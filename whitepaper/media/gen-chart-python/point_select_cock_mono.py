import matplotlib.pyplot as plt

# Benchmark results for cockroach 16c*3
thread_num_s = ['100', '200', '500', '1000', '2000']
qps_s = [86584.43, 99771.46, 102525.20, 101016.58, 98238.32]
# Benchmark results for T-shirt S
thread_num_m = ['100', '200', '500', '1000', '2000']
qps_m = [130761.37, 168830.09, 185296.62, 185997.72, 179489.25]
# Benchmark results for T-shirt M
thread_num_l = ['100', '200', '500', '1000', '2000']
qps_l = [197813.1,238094.2, 294788.7, 333901.29,334684.91]

thread_num_x = ['100', '200', '500', '1000', '2000']
qps_x = [286851.8,462074.3, 613974.99, 685592.67,701395.52]

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


#num_bars = len(thread_num_s)  # Number of bars per group
#bar_width1 = 0.25  # Adjust width as needed
#gap_width = 0.1  # Adjust gap width as needed
#bar_width = num_bars * bar_width1 + gap_width  # Total width of each group, including gap
#index = [i * bar_width for i in range(len(thread_num_s))]


# Plotting the bar chart with custom colors
plt.figure(figsize=(12, 7))

plt.bar([i - 3*bar_width/2 for i in index], qps_s, bar_width, color=color_s, label='NewSQL 16*3')
plt.bar([i - bar_width/2 for i in index], qps_m, bar_width, color=color_m, label='NewSQL 32*3')
plt.bar([i +  bar_width/2 for i in index], qps_l, bar_width, color=color_l, label='MonographDB 16*3')  # Adjust bar positions
plt.bar([i + 3*bar_width/2 for i in index], qps_x, bar_width, color=color_x, label='MonographDB 32*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Point Select Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s)  # Using thread_num_s as x-axis labels
plt.legend()

plt.tight_layout()
plt.savefig('point_select_cock_mono.png')  # Save the updated plot as PNG

