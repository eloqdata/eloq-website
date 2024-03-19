import matplotlib.pyplot as plt

# Benchmark results 16c rds 
thread_num_s = ['100M', '200M','300M','400M']
qps_s = [983846,886054,55520,36782]
# Benchmark results for 16c mono
thread_num_m = ['100M', '200M','300M','400M']
qps_m = [554745,545863,537236,525724]



# Custom colors for bars
#color_s = '#ff9999'  # Red
#color_m = '#66b3ff'  # Blue
#color_l = '#66ff66'  # Green
#color_x = '#b366ff'
color_s = '#003f5c'  # Red
color_m = '#ffa600'
#color_m = '#7a5195'  # Blue
#color_l = '#ef5675'  # Green
#color_x = '#ffa600'

# Bar width for better visualization
bar_width = 0.2 # Reduce bar width for clearer visualization of multiple bars
index = range(len(thread_num_s))

# Plotting the bar chart with custom colors
plt.figure(figsize=(12, 7))
plt.bar([i/2 for i in index], qps_s, bar_width, color=color_s, label='RDS MySQL 16c*1')
plt.bar([i/2 + bar_width for i in index], qps_m, bar_width, color=color_m, label='EloqSQL 16c*1')

plt.xlabel('Data Row Number', fontsize=12, fontweight='bold')
plt.ylabel('QPS', fontsize=12, fontweight='bold')
plt.title('Point Select Performance', fontsize=14, fontweight='bold')  # Change the title
plt.xticks([i/2 + bar_width/2 for i in index], thread_num_s)  # Using thread_num_s as x-axis labels
plt.legend()

plt.tight_layout()
plt.savefig('point_select_rds_mono.png')  # Save the updated plot as PNG

