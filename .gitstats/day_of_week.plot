set terminal png transparent
set size 1.0,0.5

set output 'day_of_week.png'
unset key
set xrange [0.5:7.5]
set xtics 1
set grid y
set ylabel "Commits"
plot 'day_of_week.dat' using 1:3:(0.5):xtic(2) w boxes fs solid
