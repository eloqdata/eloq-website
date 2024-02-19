import matplotlib.pyplot as plt

# Benchmark results for cockroach 16c*3
thread_num_s = ['100', '200', '500', '1000', '2000']
#qps_s = [24066.87, 25533.99, 27062.25, 27489.52, 26603.30]
#lat_s=[25.08,47.4,114.57,228.21,461.72]
#lat95_s=[41.1,77.19,186.54,369.77,746.32]
# Benchmark results for T-shirt M
#thread_num_l = ['100', '200', '500', '1000', '2000']
#qps_l = [100307.44, 140445.38, 196051.22, 242377.92, 276046.42]
#qps_l=[52901.57,77298.98,116593.82,146266.23,169554.24]
#lat_l=[11.36,15.57,25.90,41.55,72.53]
#lat95_l=[21.89,31.94,57.87,99.33,186.54]
# cockroach 32*3
thread_num_m = ['100', '200', '500', '1000', '2000']
qps_m = [38122.63, 41699.32, 44490.05, 44453.96, 41104.90]
lat_m=[15.59,28.91,67.21,134.51,284.45]
lat95_m=[26.2,48.34,114.72,240.02,559.5]

#mono 32*3 log *1
thread_num_l = ['100', '200', '500', '1000', '2000']
qps_l=[70529.74, 124537.13, 179525.37, 220167.13, 240093.26]
lat_l=[8.52, 9.67, 16.86, 27.75, 51.90]
lat95_l=[12.98, 15.55, 26.68, 45.79, 155.80]

#mono 32*3 log *3
thread_num_x = ['100', '200', '500', '1000', '2000']
qps_x=[84400.90,129890.64,206729.14,263702.38,305715.75]
lat_x=[7.12,9.27,14.62,23.07,40.31]
lat95_x=[14.21,18.61,28.67,44.98,80.03]
# Custom colors for bars
#color_s = '#ff9999'  # Red
#color_m = '#66b3ff'  # Blue
#color_l = '#66ff66'  # Green
#color_x = '#b366ff'
#color_s = '#003f5c'  # Red
color_m = '#7a5195'  # Blue
color_l = '#ef5675'  # Green
color_x = '#ffa600'

# Bar width for better visualization
bar_width = 0.3 # Reduce bar width for clearer visualization of multiple bars
index = range(len(thread_num_s))  # Using the length of any size for indexing

# Plotting the bar chart with custom colors
plt.figure(figsize=(12, 7))

#plt.bar([i - 3*bar_width/2 for i in index], qps_s, bar_width, color=color_s, label='NewSQL 16*3')
plt.bar([i - bar_width for i in index], qps_m, bar_width, color=color_m, label='NewSQL-X 32c*3')
plt.bar([i  for i in index], qps_l, bar_width, color=color_l, label='MonographSQL 32c*3 log*3')  # Adjust bar positions
plt.bar([i + bar_width for i in index], qps_x, bar_width, color=color_x, label='MonographSQL 32c*3 log*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Distributed Transaction Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s)  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')

plt.tight_layout()
plt.savefig('write_only_cock_mono_colocate_qps.png')  # Save the updated plot as PNG
plt.close()  # Close the current plot


# Plotting the bar chart with custom colors

plt.figure(figsize=(12, 7))

#plt.bar([i - 3*bar_width/2 for i in index], lat_s, bar_width, color=color_s,align='center', label='NewSQL 16*3')
plt.bar([i - bar_width for i in index], lat_m, bar_width, color=color_m, align='center',label='NewSQL-c 32c*3')
plt.bar([i for i in index], lat_l, bar_width, color=color_l, align='center',label='MonographSQL 32c*3 log*1')  # Adjust bar positions
plt.bar([i + bar_width for i in index], lat_x, bar_width, color=color_x, align='center',label='MonographSQL 32c*3 log*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('Latency(ms)', fontsize=12, fontweight='bold')
plt.title('Distributed Transaction Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s,ha="left")  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')
plt.tight_layout()
plt.savefig('write_only_cock_mono_colocate_lat.png')  # Save the updated plot as PNG
