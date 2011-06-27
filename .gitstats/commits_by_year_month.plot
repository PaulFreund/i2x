set terminal png transparent
set size 1.0,0.5

set output 'commits_by_year_month.png'
unset key
set xdata time
set timefmt "%Y-%m"
set format x "%Y-%m"
set xtics rotate by 90 15768000
set bmargin 5
set grid y
set ylabel "Commits"
plot 'commits_by_year_month.dat' using 1:2:(0.5) w boxes fs solid
