import matplotlib.pyplot as plt

# Benchmark results 16c rds 
thread_num_s = ['10M', '100M']
qps_s = [121459,121441]
lat_s = [1.65,1.65]
# Benchmark results for 16c mono
thread_num_m = ['10M', '100M']
qps_m = [165922.79,166766.55]
lat_m = [1.2,1.2]

thread_num_l = ['400M']
qps_l=[36362]
lat_l=[32]
thread_num_x = ['400M']
qps_x=[349114]
lat_x=[1.72]

thread_num = ['10M', '100M', '400M']


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
index1 = range(len(thread_num_s))  # Using the length of any size for indexing
index2 = range(len(thread_num_l))  # Using the length of any size for indexing
index = range(len(thread_num))

# Plotting the bar chart with custom colors
plt.figure(figsize=(12, 7))
plt.bar([i/2 for i in index1], qps_s, bar_width, color=color_s, label='RDS MySQL 16c*1')
plt.bar([i/2 + bar_width for i in index1], qps_m, bar_width, color=color_m, label='MonographDB 16c*1')
plt.bar([1 + i for i in index2], qps_l, bar_width, color=color_l, label='RDS MySQL 16c*6')  # Adjust bar positions
plt.bar([1 + i + bar_width for i in index2], qps_x, bar_width, color=color_x, label='MonographDB 16c*6')  # Adjust bar positions

plt.xlabel('Data Row Number:', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Point Select Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i/2 + bar_width/2 for i in index], thread_num)  # Using thread_num_s as x-axis labels
plt.legend()

plt.tight_layout()
plt.savefig('point_select_rds_mono.png')  # Save the updated plot as PNG

