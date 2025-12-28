/*
    MonitorMate Modern Theme & Visual Overrides
    "Refined Industrial" Aesthetic
    Auto-applied to all pages
*/

$(function () {

    // --- 1. COLOR OVERRIDES (GRADIENTS) ---

    // Helper to create gradients
    function getGradient(hex) {
        if (typeof Highcharts === 'undefined') return hex;
        return {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, Highcharts.Color(hex).setOpacity(0.7).get('rgba')],
                [1, Highcharts.Color(hex).setOpacity(0.05).get('rgba')]
            ]
        };
    }

    if (typeof COLOR !== 'undefined' && typeof Highcharts !== 'undefined') {
        // Update global colors to be gradients for charts.js
        COLOR.production = getGradient('#10b981'); // Emerald
        COLOR.usage = getGradient('#ef4444'); // Red
        COLOR.grid = getGradient('#f59e0b'); // Amber

        COLOR.chargers = [
            getGradient('#10b981'),
            getGradient('#06b6d4'),
            getGradient('#f59e0b')
        ];
    }

    // --- 2. HIGHCHARTS THEME ---

    if (typeof Highcharts !== 'undefined') {

        var baseColors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        var gradientColors = baseColors.map(getGradient);

        var modernStyle = {
            chart: {
                backgroundColor: 'transparent',
                style: {
                    fontFamily: '"Space Mono", monospace'
                },
                width: null,
                height: null
            },
            colors: gradientColors,
            title: {
                style: { color: '#e0e6ed', textTransform: 'uppercase', fontSize: '14px' }
            },
            xAxis: {
                gridLineColor: '#2d3748',
                labels: { style: { color: '#94a3b8' } },
                lineColor: '#2d3748',
                tickColor: '#2d3748'
            },
            yAxis: {
                gridLineColor: '#2d3748',
                labels: { style: { color: '#94a3b8' } },
                title: { style: { color: '#94a3b8' } }
            },
            tooltip: {
                backgroundColor: 'rgba(20, 22, 31, 0.95)',
                borderColor: '#2d3748',
                style: { color: '#e0e6ed' }
            },
            legend: {
                itemStyle: { color: '#e0e6ed' },
                itemHoverStyle: { color: '#fff' },
                itemHiddenStyle: { color: '#606063' }
            },
            credits: { enabled: false }
        };

        // Merge into Global Options immediately
        Highcharts.setOptions(modernStyle);

        // Merge into CHART Theme (for legacy apply_theme)
        if (typeof Highcharts.chartTheme !== 'undefined') {
            $.extend(true, Highcharts.chartTheme, modernStyle);

            // Fix granularity/dots
            if (Highcharts.chartTheme.plotOptions) {
                Highcharts.chartTheme.plotOptions.spline = Highcharts.chartTheme.plotOptions.spline || {};
                Highcharts.chartTheme.plotOptions.spline.dashStyle = 'Solid';
                Highcharts.chartTheme.plotOptions.spline.lineWidth = 2;
                Highcharts.chartTheme.plotOptions.spline.marker = { enabled: false };

                Highcharts.chartTheme.plotOptions.line = Highcharts.chartTheme.plotOptions.line || {};
                Highcharts.chartTheme.plotOptions.line.marker = { enabled: false };

                Highcharts.chartTheme.plotOptions.area = Highcharts.chartTheme.plotOptions.area || {};
                Highcharts.chartTheme.plotOptions.area.marker = { enabled: false };

                Highcharts.chartTheme.plotOptions.areaspline = Highcharts.chartTheme.plotOptions.areaspline || {};
                Highcharts.chartTheme.plotOptions.areaspline.marker = { enabled: false };
            }
        }

        // Merge into GAUGE Theme
        if (typeof Highcharts.gaugeTheme !== 'undefined') {
            $.extend(true, Highcharts.gaugeTheme, {
                chart: {
                    backgroundColor: 'transparent',
                    width: null,
                    height: null,
                    style: { fontFamily: '"Space Mono", monospace' }
                },
                title: modernStyle.title,
                colors: modernStyle.colors
            });

            if (Highcharts.gaugeTheme.plotOptions && Highcharts.gaugeTheme.plotOptions.gauge) {
                Highcharts.gaugeTheme.plotOptions.gauge.dial = Highcharts.gaugeTheme.plotOptions.gauge.dial || {};
                Highcharts.gaugeTheme.plotOptions.gauge.dial.backgroundColor = '#f59e0b';

                Highcharts.gaugeTheme.plotOptions.gauge.pivot = Highcharts.gaugeTheme.plotOptions.gauge.pivot || {};
                Highcharts.gaugeTheme.plotOptions.gauge.pivot.backgroundColor = '#e0e6ed';
            }
            Highcharts.gaugeTheme.pane = Highcharts.gaugeTheme.pane || {};
            Highcharts.gaugeTheme.pane.background = null;
        }
    }
    // --- 3. CHART FUNCTION OVERRIDES ---

    // OVERRIDE: Fix SOC Graph to match modern style (Smooth Area, Green/Cyan, No dots)
    window.get_fndc_soc = function () {
        /*global full_day_data */
        var day_data_soc = [];
        var chart_options = {};

        if (full_day_data[ID.fndc]) {
            for (var port in full_day_data[ID.fndc]) {
                for (j = 0; j < full_day_data[ID.fndc][port].length; j++) {
                    day_data_soc[j] = [full_day_data[ID.fndc][port][j].timestamp, parseInt(full_day_data[ID.fndc][port][j].soc)];
                }
            }
        }

        chart_options = {
            legend: { enabled: false },
            plotOptions: {
                area: {
                    fillOpacity: 0.2,
                    marker: { enabled: false },
                    lineWidth: 2
                }
            },
            series: [{
                name: 'Charge',
                type: 'area', // Match style of other graphs
                color: '#10b981', // Emerald Green instead of Usage Red
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(16, 185, 129, 0.5)'],
                        [1, 'rgba(16, 185, 129, 0.05)']
                    ]
                },
                data: day_data_soc,
                dashStyle: 'Solid'
            }],
            tooltip: {
                shared: false,
                formatter: function () {
                    var string1 = Highcharts.dateFormat('%l:%M%P', this.x);
                    var string2 = this.y + '%';
                    return '<strong>' + string1 + '</strong><br/>' + string2;
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                labels: { format: '{value}%' },
                gridLineWidth: 1
            }
        };
        return chart_options;
    };

});
