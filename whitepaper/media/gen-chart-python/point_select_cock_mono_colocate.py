import matplotlib.pyplot as plt

# Benchmark results for cockroach 16c*3
thread_num_s = ['100', '200', '500', '1000', '2000']
#qps_s = [86584.43, 99771.46, 102525.20, 101016.58, 98238.32]
#lat_s=[1.15,2,4.87,9.89,20.33]
#lat95_s=[2.61,4.65,12.75,26.2,48.34]

# Benchmark results for mono 16c*3
#thread_num_l = ['100', '200', '500', '1000', '2000']
##qps_l=[192679.19,263357.28,336257.34,378206.02,385542.01]
#lat_l=[0.52,0.76,1.49,2.64,5.18]
#lat95_l=[0.69,2.43,4.25,6.55,10.27]

# Benchmark results for cockroach32c
thread_num_m = ['100', '200', '500', '1000', '2000']
qps_m = [130761.37, 168830.09, 185296.62, 185997.72, 179489.25]
lat_m=[0.74,1.15,2.68,5.37,11.07]
lat95_m=[1.16,2.66,7.43,16.12,36.89]

# mono 32c*3 1*log
thread_num_l = ['100', '200', '500', '1000', '2000']
qps_l=[333012.20, 537523.82, 762697.64, 825721.28, 744121.28]
lat_l=[0.30, 0.37, 0.65, 1.21, 2.68]
lat95_l=[0.42, 0.54, 1.04, 2.11, 4.03]

# mono 32c*3 3*log
thread_num_x = ['100', '200', '500', '1000', '2000']
qps_x=[316670.95,517454.86,739429.56,811595.01,770954.76]
lat_x=[0.31,0.39,0.67,1.23,2.59]
lat95_x=[0.45,0.56,1.04,2.11,3.96]
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


#num_bars = len(thread_num_s)  # Number of bars per group
#bar_width1 = 0.25  # Adjust width as needed
#gap_width = 0.1  # Adjust gap width as needed
#bar_width = num_bars * bar_width1 + gap_width  # Total width of each group, including gap
#index = [i * bar_width for i in range(len(thread_num_s))]


# Plotting the bar chart with custom colors
plt.figure(figsize=(12, 7))

#plt.bar([i - 3*bar_width/2 for i in index], qps_s, bar_width, color=color_s, label='NewSQL 16*3')
plt.bar([i - bar_width for i in index], qps_m, bar_width, color=color_m, label='NewSQL-X 32c*3')
plt.bar([i for i in index], qps_l, bar_width, color=color_l, label='MonographSQL 32c*3')  # Adjust bar positions
plt.bar([i + bar_width for i in index], qps_x, bar_width, color=color_x, label='MonographSQL 32c*3 log*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Point Select Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s)  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')

plt.tight_layout()
plt.savefig('point_select_cock_mono_colocate_qps.png')  # Save the updated plot as PNG
plt.close()  # Close the current plot

# Plotting the bar chart with custom colors

plt.figure(figsize=(12, 7))

#plt.bar([i - 3*bar_width/2 for i in index], lat_s, bar_width, color=color_s,align='center', label='NewSQL 16*3')
plt.bar([i - bar_width for i in index], lat_m, bar_width, color=color_m, align='center',label='NewSQL-X 32c*3')
plt.bar([i  for i in index], lat_l, bar_width, color=color_l, align='center',label='MonographSQL 32c*3')  # Adjust bar positions
plt.bar([i + bar_width for i in index], lat_x, bar_width, color=color_x, align='center',label='MonographSQL 32c*3 log*3')  # Adjust bar positions

plt.xlabel('Thread Num', fontsize=12, fontweight='bold')
plt.ylabel('Latency(ms)', fontsize=12, fontweight='bold')
plt.title('Point Select Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i + bar_width for i in index], thread_num_s,ha="left")  # Using thread_num_s as x-axis labels
plt.legend(loc='upper left')
plt.tight_layout()
plt.savefig('point_select_cock_mono_colocate_lat.png')  # Save the updated plot as PNG
