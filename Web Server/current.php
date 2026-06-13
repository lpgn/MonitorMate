<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-capable" content="yes">
	
    <!-- Modern Favicon/Theme Colors -->
	<link rel="icon" href="./images/favicon16.png" type="image/png">
    <meta name="theme-color" content="#0a0b10">
	
    <!-- CSS -->
    <link rel="stylesheet" href="monitormate-modern.css?v=20260613b" type="text/css">
	
    <!-- Scripts -->
	<script src="./js/vendor/jquery-3.1.1.min.js?v=20260613b"></script>
	<script src="./js/vendor/highcharts.js?v=20260613b"></script>
	<script src="./js/vendor/highcharts-more.js?v=20260613b"></script>
	<script src="./config/config.php"></script>
	<script src="./js/monitormate.js?v=20260613b"></script>
	<script src="./js/charts.js?v=20260613b"></script>
	<script src="./js/gauges.js?v=20260613b"></script>
    <script src="./js/monitormate-theme.js?v=20260613b"></script>
    
	<title>MonitorMate — System Status</title>
</head>
<body>

	<div id="navbar">
        <div style="display:flex; flex-direction:column;">
    		<h1>MonitorMate <span class="version">v2.0</span></h1>
            <div id="button-cluster">
    			Last update: <span id="update_time">syncing&hellip;</span>
    		</div>
        </div>
        
		<ol id="toc">
			<li class="current"><a href="current.php">Status</a></li>
			<li><a href="historical.html">History</a></li>
			<li><a href="details.html">Details</a></li>
            <?php
            ob_start();
            require_once './config/config.php';
            ob_end_clean();
            if (defined('DEBUG') && DEBUG) {
                print("<li><a href='debug.html'>Debug</a></li>");
            }
            ?>
		</ol>
	</div>

    <main class="dashboard-grid">
    <?php
        include_once('fix_mysql.inc.php');
        ob_start(); 		
        require_once './database.php';
        ob_end_clean();
        
        $prefs = new Prefs;
        $prefs->load();
        
        foreach ($prefs->dashboard_rows as $row) {
            $item = explode(";", $row);
            // $item[0] is gauge ID, $item[1] is chart ID
            print("
                <article class='monitor-card'>
                    <div class='card-content'>
                        <div class='card-gauge' id='{$item[0]}'></div>
                        <div class='card-chart' id='{$item[1]}'></div>
                    </div>
                </article>\n
            ");
        }
    ?>
    </main>

	<script>


		$(document).ready(function() {
            


            // Force reflow on resize
            $(window).resize(function() {
                $('.monitor-card .card-chart, .monitor-card .card-gauge').each(function() {
                     var chart = $(this).highcharts();
                     if (chart) chart.reflow();
                });
            });

			get_dataStream(false, 4);

			if (full_day_data !== null) {
				
                // DRAW CHARTS
                if (typeof apply_highchart_theme === 'function') {
				    apply_highchart_theme(Highcharts.chartTheme);
                }
				
				draw_chart('fndc_soc', false);
				draw_chart('battery_voltage', false);
				draw_chart('fndc_shunts', false);
				draw_chart('inverter_power', false);
				draw_chart('cc_charge_power', false);
				draw_chart('fndc_shuntA', false);
				draw_chart('fndc_shuntB', false);
				draw_chart('fndc_shuntC', false);
				
                // DRAW GAUGES
                if (typeof apply_highchart_theme === 'function') {
				    apply_highchart_theme(Highcharts.gaugeTheme);
                }
	
				refresh_data(false);
				setInterval("refresh_data()", 2*1000);
			} else {
				$("#navbar").after("<p style='text-align:center; padding:2rem; color:var(--text-muted);'>SYSTEM OFFLINE: No data received for today.</p>");
				$("#update_time").text('OFFLINE');
			}
		});

		function refresh_data(update) {
			var update = (update != false)? true : false;
			get_current_status();
			draw_chart("fndc_soc_gauge", update);
			draw_chart("batt_volts_gauge", update);
			draw_chart("cc_output_gauge", update);
			draw_chart("inverter_power_gauge", update);
			draw_chart("fndc_shuntA_gauge", update);
			draw_chart("fndc_shuntB_gauge", update);
			draw_chart("fndc_shuntC_gauge", update);
			draw_chart("fndc_shuntNet_gauge", update);
		}
	</script>
	
</body>
</html>
