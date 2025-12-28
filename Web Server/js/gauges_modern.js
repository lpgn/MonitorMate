/*
    Modern Overrides for MonitorMate Gauges
    Matches "Refined Industrial" Aesthetic
*/

var ThemeColors = {
    red: '#ef4444',
    amber: '#f59e0b',
    green: '#10b981',
    cyan: '#06b6d4',
    
    // Transparent versions for bands
    green_25: 'rgba(16, 185, 129, 0.25)',
    green_50: 'rgba(16, 185, 129, 0.50)',
    green_100: 'rgba(16, 185, 129, 1.0)',
    
    amber_25: 'rgba(245, 158, 11, 0.25)',
    amber_50: 'rgba(245, 158, 11, 0.50)',
    amber_100: 'rgba(245, 158, 11, 1.0)',
    
    red_25: 'rgba(239, 68, 68, 0.25)',
    red_50: 'rgba(239, 68, 68, 0.50)',
    red_100: 'rgba(239, 68, 68, 1.0)'
};

function get_fndc_soc_gauge(chart) {
	/*global full_day_data, json_status */
	var chart = chart || false;
	
    // Legacy logic to find SOC
	for (var i = 0; i < json_status['devices'].length; i++) {
		if (json_status['devices'][i]['device_id'] == ID.fndc) {
			var device = json_status['devices'][i];
			var current_soc = device.soc;
			break; 
		}
	}

	if (chart) {
		return [current_soc];
	} else {
		chart_options = {
			title: { text: 'State of Charge' },
			plotOptions: {
				gauge: {
					dataLabels: { format: '{point.y:,.0f}%' }
				}
			},
			yAxis: {
				min: 0,
				max: 100,
				tickInterval: 10,			
				minorTickInterval: 5,
				plotBands: [{
					from: 0,
					to: 20,
					thickness: 40,
					color: ThemeColors.red
				}, {
					from: 20,
					to: 50,
					thickness: 40,
					color: ThemeColors.amber
				}, {
					from: 50,
					to: 100,
					thickness: 40,
					color: ThemeColors.green
				}]
			},
			series: [{ data: [current_soc] }]
		};
		return chart_options;
	}
}

function get_batt_volts_gauge(chart) {
	/*global json_status */
	var chart = chart || false;
	var current_batt = null;

	for (var i = 0; i < json_status['devices'].length; i++) {
		if (json_status['devices'][i]['device_id'] == ID.fndc) {
			var device = json_status['devices'][i];
			current_batt = device.battery_voltage;
			break; 
		} else if (json_status['devices'][i]['device_id'] == ID.fndc) {
			var device = json_status['devices'][i];
			current_batt = device.battery_voltage;
		}
	}

	if (chart) {
		return [current_batt];
	} else {
		var chartMin = CONFIG.sysVoltage - (CONFIG.sysVoltage/12);
		var chartMax = CONFIG.sysVoltage + (CONFIG.sysVoltage*(3/8));
		chart_options = {
			title: { text: 'Battery Voltage' },
			plotOptions: {
				gauge: {
					dataLabels: { format: '{point.y:,.1f} V' }
				}
			},
			yAxis: {
				min: chartMin,
				max: chartMax,
				tickInterval: 2,
				minorTickInterval: 0.5,
				plotBands: [{
					from: chartMin,
					to: CONFIG.sysVoltage - (CONFIG.sysVoltage/24),
					thickness: 40,
					color: ThemeColors.red
				}, {
					from: CONFIG.sysVoltage - (CONFIG.sysVoltage/24),
					to: CONFIG.sysVoltage,
					thickness: 40,
					color: ThemeColors.amber
				}, {
					from: CONFIG.sysVoltage,
					to: CONFIG.sysAbsorbVoltage * 0.97,
					thickness: 40,
					color: ThemeColors.green_50
				}, {
					from: CONFIG.sysAbsorbVoltage * 0.97,
					to: CONFIG.sysAbsorbVoltage * 1.03,
					thickness: 40,
					color: ThemeColors.green
				}, {
					from: CONFIG.sysAbsorbVoltage * 1.03,
					to: chartMax - (CONFIG.sysVoltage/24),
					thickness: 40,
					color: ThemeColors.amber
				}, {
					from: chartMax - (CONFIG.sysVoltage/24),
					to: chartMax,
					thickness: 40,
					color: ThemeColors.red
				}]
			},
			series: [{ data: [current_batt] }]
		};
		return chart_options;
	}
}

function get_cc_output_gauge(chart) {
	/*global json_status */
	var chart = chart || false;
	var total_watts = 0;
	
	for (var i = 0; i < json_status['devices'].length; i++) {	
		if (json_status['devices'][i]['device_id'] == ID.cc) {
			var device = json_status['devices'][i];
			var charging_watts = device.charge_current * device.battery_voltage;
			total_watts = total_watts + charging_watts;
		}
	}

	if (chart) {
		return [total_watts];
	} else {
		chart_options = {
			title: { text: 'PV Input' },
			legend: { enabled: false },
			plotOptions: {
				gauge: {
					dataLabels: { format: '{point.y:,.0f} W' }
				}
			},
			yAxis: {
				min: 0,
				max: CONFIG.pvWattage,
				plotBands: [{
					from: 0,
					to: (CONFIG.pvWattage*0.20),
					thickness: 40,
					color: ThemeColors.green_25
				}, {
					from: (CONFIG.pvWattage*0.20),
					to: (CONFIG.pvWattage*0.80),
					thickness: 40,
					color: ThemeColors.green_50
				}, {
					from: (CONFIG.pvWattage*0.80),
					to: CONFIG.pvWattage,
					thickness: 40,
					color: ThemeColors.green
				}]
			},
			series: [{ data: [total_watts] }]
		};
		return chart_options;
	}
}

function get_inverter_power_gauge(chart) {
	/*global json_status */
	var chart = chart || false;
	var total_watts = 0;
	var chart_mode = null;
	var chart_max = null; 
	
	for (var i = 0; i < json_status['devices'].length; i++) {	
		if (json_status['devices'][i]['device_id'] == ID.fx || json_status['devices'][i]['device_id'] == ID.fxr) {
			var device = json_status['devices'][i];
			if (device.operational_mode == "Charge") {
				chart_mode = "Charging";
				chart_max = CONFIG.chargerMax;
				var charging_watts = device.charge_current * device.ac_input_voltage;
				total_watts = total_watts + charging_watts;
			} else {
				chart_mode = "Inverting";
				chart_max = CONFIG.inverterMax;
				var inverting_watts = device.inverter_current * device.ac_output_voltage;
				total_watts = total_watts + inverting_watts;
			}
		}
	}
	total_watts = Math.round(total_watts / 10) * 10;

	if (chart) {
		return [total_watts];
	} else {
		chart_options = {
			title: { text: chart_mode },
			plotOptions: {
				gauge: {
					dataLabels: { format: '{point.y:,.0f} W' }
				}
			},
			yAxis: {
				min: 0,
				max: chart_max,
				labels: { step: 2 },
				plotBands: [{
					from: 0,
					to: (chart_max*0.8),
					thickness: 40,
					color: ThemeColors.green
				}, {
					from: (chart_max*0.8),
					to: (chart_max*0.90),
					thickness: 40,
					color: ThemeColors.amber
				}, {
					from: (chart_max*0.90),
					to: chart_max,
					thickness: 40,
					color: ThemeColors.red
				}]
			},
			series: [{ data: [total_watts] }]
		};
		return chart_options;
	}
}

function get_fndc_shunt_gauge(shunt, chart) {
	/*global json_status */
	var chart_color = null;
	var shunt_amps = null;
	var shunt_watts = null;
	var shunt_label = null;
    var chart_max = null;
	var chart_mode = null;

    // Colors
	var chart_chgColor = [ThemeColors.green_25, ThemeColors.green_50, ThemeColors.green_100];
	var chart_disColor = [ThemeColors.amber_25, ThemeColors.amber_50, ThemeColors.amber_100];
	
	for (var i = 0; i < json_status['devices'].length; i++) {	
		if (json_status['devices'][i]['device_id'] == ID.fndc) {
			var device = json_status['devices'][i];
			switch (shunt) {
				case "A":
					shunt_label = shuntLabels[0];
					shunt_amps = device.shunt_a_current;
					break;
				case "B":
					shunt_label = shuntLabels[1];
					shunt_amps = device.shunt_b_current;
					break;
				case "C":
					shunt_label = shuntLabels[2];
					shunt_amps = device.shunt_c_current;
					break;
			}

			if (shunt_amps >= 0) {
				chart_color = chart_chgColor;
				chart_mode = (shunt_amps == 0) ? "" : " ↑";
				switch (shunt) {
					case "A": chart_max = CONFIG.shuntRanges.A.max; break;
					case "B": chart_max = CONFIG.shuntRanges.B.max; break;
					case "C": chart_max = CONFIG.shuntRanges.C.max; break;
				}
			} else {
				chart_color = chart_disColor;
				chart_mode = " ↓";
				switch (shunt) {
					case "A": chart_max = CONFIG.shuntRanges.A.min; break;
					case "B": chart_max = CONFIG.shuntRanges.B.min; break;
					case "C": chart_max = CONFIG.shuntRanges.C.min; break;
				}
			}

			if (chart_max == 0) {
                // If max is 0, default to showing positive logic but calculate watts
				chart_color = chart_chgColor;
				chart_mode = "";
				switch (shunt) {
					case "A": chart_max = CONFIG.shuntRanges.A.max; break;
					case "B": chart_max = CONFIG.shuntRanges.C.max; break;
					case "C": chart_max = CONFIG.shuntRanges.C.max; break;
				}
				shunt_watts = shunt_amps * device.battery_voltage;
			} else {
				shunt_watts = Math.abs(shunt_amps * device.battery_voltage);
			}
			break; 
		}
	}

	if (chart) {
		return [shunt_watts];
	} else {
		chart_options = {
			title: { text: shunt_label + chart_mode },
			yAxis: {
				min: 0,
				max: chart_max,
				plotBands: [{
					from: 0,
					to: (chart_max*0.20),
					thickness: 40,
					color: chart_color[0]
				}, {
					from: (chart_max*0.20),
					to: (chart_max*0.80),
					thickness: 40,
					color: chart_color[1]
				}, {
					from: (chart_max*0.80),
					to: chart_max,
					thickness: 40,
					color: chart_color[2]
				}],
			},
			plotOptions: {
				gauge: { dataLabels: { format: '{point.y:,.0f} W' } }
			},
			series: [{ data: [shunt_watts] }]
		};
		return chart_options;
	}
}

function get_fndc_shuntNet_gauge(chart) {
	/*global json_status */
	var chart = chart || false;
	var net_amps = null;
	var net_watts = null;
	var net_max = null;
    var chart_mode = '';
	
	var chart_chgColor = [ThemeColors.green_25, ThemeColors.green_50, ThemeColors.green_100];
	var chart_disColor = [ThemeColors.amber_25, ThemeColors.amber_50, ThemeColors.amber_100];

	var charge_max = CONFIG.shuntRanges.A.max + CONFIG.shuntRanges.B.max + CONFIG.shuntRanges.C.max;
	var discharge_max = CONFIG.shuntRanges.A.min + CONFIG.shuntRanges.B.min + CONFIG.shuntRanges.C.min;
   	net_max = Math.max(charge_max, discharge_max);	
	
	for (var i = 0; i < json_status['devices'].length; i++) {	
		if (json_status['devices'][i]['device_id'] == ID.fndc) {
			var device = json_status['devices'][i];
			net_amps = device.shunt_a_current + device.shunt_b_current + device.shunt_c_current;
			chart_mode = (net_amps >= 0) ? "Net Charging" : "Net Discharging";
			net_watts = net_amps * device.battery_voltage;
			break; 
		}
	}

	if (chart) {
		return [net_watts];
	} else {
		chart_options = {
			title: { text: chart_mode },
			yAxis: {
				min: -net_max,
				max: net_max,
				plotBands: [{
					from: 0,
					to: (net_max*0.20),
					thickness: 40,
					color: chart_chgColor[0]
				}, {
					from: (net_max*0.20),
					to: (net_max*0.80),
					thickness: 40,
					color: chart_chgColor[1]
				}, {
					from: (net_max*0.80),
					to: net_max,
					thickness: 40,
					color: chart_chgColor[2]
				}, {
					from: 0,
					to: -(net_max*0.20),
					thickness: 40,
					color: chart_disColor[0]
				}, {
					from: -(net_max*0.20),
					to: -(net_max*0.80),
					thickness: 40,
					color: chart_disColor[1]
				}, {
					from: -(net_max*0.80),
					to: -net_max,
					thickness: 40,
					color: chart_disColor[2]
				}],
			},
			plotOptions: {
				gauge: { dataLabels: { format: '{point.y:,.0f} W' } }
			},
			series: [{ data: [net_watts] }]
		};
		return chart_options;
	}
}
