// Theme toggle for all pages
$(document).ready(function() {
    // Add theme toggle button if it doesn't exist
    if ($('#theme-toggle').length === 0 && $('#button-cluster').length > 0) {
        $('#button-cluster').append('<button id="theme-toggle">🌙 Dark</button>');
    }
    
    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        $('body').addClass('dark-mode');
        $('#theme-toggle').text('☀️ Light');
    }
    
    // Toggle functionality
    $(document).on('click', '#theme-toggle', function() {
        if ($('body').hasClass('dark-mode')) {
            $('body').removeClass('dark-mode');
            $(this).text('🌙 Dark');
            localStorage.setItem('theme', 'light');
        } else {
            $('body').addClass('dark-mode');
            $(this).text('☀️ Light');
            localStorage.setItem('theme', 'dark');
        }
        
        // Update charts if Highcharts exists
        if (typeof Highcharts !== 'undefined' && Highcharts.charts) {
            var isDark = $('body').hasClass('dark-mode');
            Highcharts.charts.forEach(function(chart) {
                if (chart) {
                    chart.update({
                        chart: { backgroundColor: isDark ? '#242424' : '#ffffff' },
                        title: { style: { color: isDark ? '#e8e6e3' : '#2b2b2b' } },
                        legend: { itemStyle: { color: isDark ? '#c8c6c3' : '#333' } },
                        xAxis: { 
                            labels: { style: { color: isDark ? '#888' : '#666' } },
                            lineColor: isDark ? '#444' : '#ccd6eb',
                            tickColor: isDark ? '#444' : '#ccd6eb'
                        },
                        yAxis: { 
                            labels: { style: { color: isDark ? '#888' : '#666' } },
                            gridLineColor: isDark ? '#333' : '#e6e6e6'
                        }
                    });
                }
            });
        }
    });
});
