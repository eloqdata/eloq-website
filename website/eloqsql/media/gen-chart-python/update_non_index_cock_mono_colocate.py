import matplotlib.pyplot as plt

# Benchmark results for cockroach 16c*3
thread_num_s = ['100', '200', '500', '1000', '2000']
#qps_s = [23667.09, 26893.95,29108.16,30162.21, 30444.77]
#lat_s=[4.22,7.44,17.17,33.13,65.6]
#lat95_s=[8.13,16.71,41.1,75.82,134.9]
# Benchmark results for T-shirt M
#thread_num_l = ['100', '200', '500', '1000', '2000']
#qps_l = [32854.08, 55777.87, 87811.37, 117633.25,149810.25]
#qps_l= [18276.41,29033.77,51285.89,74067.80,98517.50]
#lat_l=[5.47,6.89,9.75,13.49,20.27]
#lat95_l=[12.52,16.41,23.95,34.33,54.83]

# cockroach 32*3
thread_num_m = ['100', '200', '500', '1000', '2000']
qps_m = [36004.19,45525.52,51368.46,53285.93, 55520.81]
lat_m=[2.72,4.35,9.65,18.72,35.91]
lat95_m=[4.25,9.22,23.1,44.17,82.96]

# mono 32c*3 log1
thread_num_l = ['100', '200', '500', '1000', '2000']
qps_l=[21382.50, 34016.34, 57125.32, 78683.82, 88048.33]
lat_l=[4.68, 5.88, 8.75, 12.70, 22.68]
lat95_l=[8.43, 10.46, 13.95, 19.29, 28.16]

# mono 32c*3 log*3
thread_num_x = ['100', '200', '500', '1000', '2000']
qps_x=[24258.99,43909.69,81444.02,122159.01,168279.94]
lat_x=[4.12,4.55,6.14,8.18,11.87]
lat95_x=[9.22,9.91,13.95,17.63,24.38]

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

#plt.bar([i - 3*bar_width/2 for i in index], qps_s, bar_width, color=color_s, label='NewSQL 16*3')
plt.bar([i - bar_width for i in index], qps_m, bar_width, color=color_m, label='NewSQL-X 32c*3')
plt.bar([i for i in index], qps_l, bar_width, color=color_l, label='EloqSQL 32c*3 log*1')  # Adjust bar positions
plt.bar([i + bar_width for i in index], qps_x, bar_width, color=color_x, label='EloqSQL 32c*3 log*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Single Update Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s)  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')

plt.tight_layout()
plt.savefig('update_non_index_cock_mono_colocate_qps.png')  # Save the updated plot as PNG
plt.close()  # Close the current plot


# Plotting the bar chart with custom colors

plt.figure(figsize=(12, 7))

#plt.bar([i - 3*bar_width/2 for i in index], lat_s, bar_width, color=color_s,align='center', label='NewSQL 16*3')
plt.bar([i - bar_width for i in index], lat_m, bar_width, color=color_m, align='center',label='NewSQL-X 32c*3')
plt.bar([i for i in index], lat_l, bar_width, color=color_l, align='center',label='EloqSQL 32c*3 log*1')  # Adjust bar positions
plt.bar([i + bar_width for i in index], lat_x, bar_width, color=color_x, align='center',label='EloqSQL 32c*3 log*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('Latency(ms)', fontsize=12, fontweight='bold')
plt.title('Single Update Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s,ha="left")  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')
plt.tight_layout()
plt.savefig('update_non_index_cock_mono_colocate_lat.png')  # Save the updated plot as PNG
