import matplotlib.pyplot as plt

# Benchmark results for 48c log*1
thread_num_s = ['100', '200', '500', '1000', '2000']
qps_s = [368528.7,413695.48,447322.42,427887.73,387937.4]
lat_s=[2.94,3.23,5.34,9.06,16.91]
lat95_s=[3.3,3.55,6.67,10.65,18.95]

# Benchmark results for 64c log*1
thread_num_m = ['100', '200', '500', '1000', '2000']
qps_m = [394138.9,474934.88,517475.55,528053.78,478606.67]
lat_m=[2.9,3.26,5.28,8.91,16.64,]
lat95_m=[3.19,3.55,6.55,10.46,18.95]

# Benchmark results for 48c log*3
thread_num_l = ['100', '200', '500', '1000', '2000']
qps_l = [365151.94,415315.58,446315.16,426284.38,386103.81]
lat_l=[2.94,3.15,4.05,5.86,10.35]
lat95_l=[3.49,3.75,5.18,7.43,14.21]

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
bar_width = 0.3 # Reduce bar width for clearer visualization of multiple bars
index = range(len(thread_num_s))  # Using the length of any size for indexing


# Plotting the bar chart with custom colors
plt.figure(figsize=(12, 7))

plt.bar([i - bar_width for i in index], qps_s, bar_width, color=color_s, label='EloqSQL 48c 1 disk')
plt.bar([i for i in index], qps_m, bar_width, color=color_m, label='EloqSQL 64c 1 disk')
plt.bar([i +  bar_width for i in index], qps_l, bar_width, color=color_l, label='EloqSQL 48c 3 disk')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Single Update Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s)  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')

plt.tight_layout()
plt.savefig('scale_cpu_qps.png')  # Save the updated plot as PNG
plt.close()  # Close the current plot

# Plotting the bar chart with custom colors

plt.figure(figsize=(12, 7))

plt.bar([i - bar_width for i in index], lat_s, bar_width, color=color_s,align='center', label='EloqSQL 48c 1 disk')
plt.bar([i for i in index], lat_m, bar_width, color=color_m, align='center',label='EloqSQL 64c 1 disk')
plt.bar([i +  bar_width for i in index], lat_l, bar_width, color=color_l, align='center',label='EloqSQL 48c 3 disks')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('Latency(ms)', fontsize=12, fontweight='bold')
plt.title('Single Update Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s,ha="left")  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')
plt.tight_layout()
plt.savefig('nouse.png')  # Save the updated plot as PNG
