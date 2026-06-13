/*
    MonitorMate Modern Theme & Visual Overrides
    Dark dashboard theme, tuned for readability.
    Auto-applied to all pages.
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

        // Dock the tooltip in a fixed corner of the plot area, on the
        // opposite side from the cursor, so it never covers the data
        // you are pointing at.
        function dockedTooltipPositioner(labelWidth, labelHeight, point) {
            var chart = this.chart;
            var x;
            if (point.plotX < chart.plotWidth / 2) {
                x = chart.plotLeft + chart.plotWidth - labelWidth - 6; // cursor left, dock right
            } else {
                x = chart.plotLeft + 6; // cursor right, dock left
            }
            if (x < 0) { x = 0; }
            return { x: x, y: chart.plotTop + 6 };
        }

        var modernStyle = {
            chart: {
                backgroundColor: 'transparent',
                style: {
                    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif'
                },
                width: null,
                height: null
            },
            colors: gradientColors,
            title: {
                style: {
                    color: '#e6edf3',
                    fontSize: '14px',
                    fontWeight: '600'
                }
            },
            xAxis: {
                gridLineColor: '#283142',
                labels: { style: { color: '#aab8c8', fontSize: '11px' } },
                lineColor: '#36415a',
                tickColor: '#36415a'
            },
            yAxis: {
                gridLineColor: '#283142',
                labels: { style: { color: '#aab8c8', fontSize: '11px' } },
                title: { style: { color: '#aab8c8' } }
            },
            tooltip: {
                positioner: dockedTooltipPositioner,
                followPointer: false,
                shadow: false,
                borderRadius: 6,
                borderColor: '#3b4759',
                backgroundColor: 'rgba(13, 17, 23, 0.95)',
                style: { color: '#e6edf3', fontSize: '12px' }
            },
            legend: {
                backgroundColor: 'transparent',
                borderWidth: 0,
                itemStyle: { color: '#cbd5e1', fontSize: '11px', fontWeight: 'normal' },
                itemHoverStyle: { color: '#ffffff' },
                itemHiddenStyle: { color: '#5b6878' }
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
                    style: { fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif' }
                },
                title: modernStyle.title,
                colors: modernStyle.colors,
                yAxis: {
                    tickColor: 'rgba(230, 237, 243, 0.6)',
                    minorTickColor: 'rgba(230, 237, 243, 0.3)',
                    lineColor: 'rgba(230, 237, 243, 0.4)',
                    labels: {
                        style: { color: '#aab8c8', fontSize: '10px' }
                    }
                }
            });

            if (Highcharts.gaugeTheme.plotOptions && Highcharts.gaugeTheme.plotOptions.gauge) {
                Highcharts.gaugeTheme.plotOptions.gauge.dial = Highcharts.gaugeTheme.plotOptions.gauge.dial || {};
                Highcharts.gaugeTheme.plotOptions.gauge.dial.backgroundColor = '#f59e0b';
                Highcharts.gaugeTheme.plotOptions.gauge.dial.borderWidth = 0;

                Highcharts.gaugeTheme.plotOptions.gauge.pivot = Highcharts.gaugeTheme.plotOptions.gauge.pivot || {};
                Highcharts.gaugeTheme.plotOptions.gauge.pivot.backgroundColor = '#e0e6ed';
                Highcharts.gaugeTheme.plotOptions.gauge.pivot.borderWidth = 0;

                // Big readable value under the needle
                Highcharts.gaugeTheme.plotOptions.gauge.dataLabels = $.extend(
                    true,
                    Highcharts.gaugeTheme.plotOptions.gauge.dataLabels || {},
                    {
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        style: {
                            color: '#e6edf3',
                            fontSize: '15px',
                            fontWeight: '600',
                            textOutline: 'none'
                        }
                    }
                );
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
