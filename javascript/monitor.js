var RUNNING = false;
var loop;

const COLOURS = {
	caution: '#FFC107',
	danger: '#F44336'
}

function monitor() {
	if (!RUNNING) {
		loop = setInterval(loopFunction, 2000);
		$('button#monitor-button').text('Stop')
	} else {
		clearInterval(loop);
		$('button#monitor-button').text('Start')
	}
	RUNNING = !RUNNING;
}

function loopFunction() {
	getData()
		.then(updateTable)
		.catch(console.error);
}

function getData() {
	let address = $('#address').val();
	let port = $('#port').val();

	return new Promise((resolve, reject) =>
		fetch(`/data/${address}/${port}`)
			.then((res) => res.json())
			.then(resolve)
			.catch(reject));
}

function updateTable(d) {
	let data = {
		cpu: {
			temp: d.Children[0].Children[1].Children[1].Children[0],
			clocks: d.Children[0].Children[1].Children[0],
			load: d.Children[0].Children[1].Children[2].Children[0],
			volt: d.Children[0].Children[0].Children[0].Children[0].Children[0],
			power: d.Children[0].Children[1].Children[3].Children[0]
		},
		gpu: {
			temp: d.Children[0].Children[3].Children[1].Children[0],
			clocks: d.Children[0].Children[3].Children[0].Children[0],
			load: d.Children[0].Children[3].Children[2].Children[0],
			ram: {
				used: d.Children[0].Children[3].Children[6].Children[1],
				free: d.Children[0].Children[3].Children[6].Children[0],
				total: d.Children[0].Children[3].Children[6].Children[2].Max
			},
			fan: d.Children[0].Children[3].Children[3].Children[0],
			power: d.Children[0].Children[3].Children[5].Children[0]
		},
		ram: {
			load: d.Children[0].Children[2].Children[0].Children[0],
			used: d.Children[0].Children[2].Children[1].Children[0],
			free: d.Children[0].Children[2].Children[1].Children[1]
		},
		fan: [
			d.Children[0].Children[0].Children[0].Children[2].Children[0],
			d.Children[0].Children[0].Children[0].Children[2].Children[1],
			d.Children[0].Children[0].Children[0].Children[2].Children[2],
			d.Children[0].Children[0].Children[0].Children[2].Children[3],
			d.Children[0].Children[0].Children[0].Children[2].Children[4],
			d.Children[0].Children[0].Children[0].Children[2].Children[5]
		]
	};

	let cpuTempValElem = $('#cpu-temp-val');
	let cpuTempMinElem = $('#cpu-temp-min');
	let cpuTempMaxElem = $('#cpu-temp-max');
	let cpuClocksValElem = $('#cpu-clocks-val');
	let cpuClocksMinElem = $('#cpu-clocks-min');
	let cpuClocksMaxElem = $('#cpu-clocks-max');
	let cpuLoadValElem = $('#cpu-load-val');
	let cpuLoadMinElem = $('#cpu-load-min');
	let cpuLoadMaxElem = $('#cpu-load-max');
	let cpuVoltValElem = $('#cpu-volt-val');
	let cpuVoltMinElem = $('#cpu-volt-min');
	let cpuVoltMaxElem = $('#cpu-volt-max');
	let cpuPowerValElem = $('#cpu-power-val');
	let cpuPowerMinElem = $('#cpu-power-min');
	let cpuPowerMaxElem = $('#cpu-power-max');

	let gpuTempValElem = $('#gpu-temp-val');
	let gpuTempMinElem = $('#gpu-temp-min');
	let gpuTempMaxElem = $('#gpu-temp-max');
	let gpuClocksValElem = $('#gpu-clocks-val');
	let gpuClocksMinElem = $('#gpu-clocks-min');
	let gpuClocksMaxElem = $('#gpu-clocks-max');
	let gpuLoadValElem = $('#gpu-load-val');
	let gpuLoadMinElem = $('#gpu-load-min');
	let gpuLoadMaxElem = $('#gpu-load-max');
	let gpuRamUsedElem = $('#gpu-ram-used');
	let gpuRamFreeElem = $('#gpu-ram-free');
	let gpuRamPercentElem = $('#gpu-ram-percent');
	let gpuFanSpeedElem = $('#fan-gpu-speed');
	let gpuFanMinElem = $('#fan-gpu-min');
	let gpuFanMaxElem = $('#fan-gpu-max');
	let gpuPowerValElem = $('#gpu-power-val');
	let gpuPowerMinElem = $('#gpu-power-min');
	let gpuPowerMaxElem = $('#gpu-power-max');

	let ramDataUsedElem = $('#ram-data-used');
	let ramDataFreeElem = $('#ram-data-free');
	let ramDataPercentElem = $('#ram-data-percent');

	let fan_1_labelElem = $('#fan-1-label');
	let fan_1_SpeedElem = $('#fan-1-speed');
	let fan_1_MinElem = $('#fan-1-min');
	let fan_1_MaxElem = $('#fan-1-max');
	let fan_2_labelElem = $('#fan-2-label');
	let fan_2_SpeedElem = $('#fan-2-speed');
	let fan_2_MinElem = $('#fan-2-min');
	let fan_2_MaxElem = $('#fan-2-max');
	let fan_3_labelElem = $('#fan-3-label');
	let fan_3_SpeedElem = $('#fan-3-speed');
	let fan_3_MinElem = $('#fan-3-min');
	let fan_3_MaxElem = $('#fan-3-max');
	let fan_4_labelElem = $('#fan-4-label');
	let fan_4_SpeedElem = $('#fan-4-speed');
	let fan_4_MinElem = $('#fan-4-min');
	let fan_4_MaxElem = $('#fan-4-max');
	let fan_5_labelElem = $('#fan-5-label');
	let fan_5_SpeedElem = $('#fan-5-speed');
	let fan_5_MinElem = $('#fan-5-min');
	let fan_5_MaxElem = $('#fan-5-max');
	let fan_6_labelElem = $('#fan-6-label');
	let fan_6_SpeedElem = $('#fan-6-speed');
	let fan_6_MinElem = $('#fan-6-min');
	let fan_6_MaxElem = $('#fan-6-max');

	cpuTempValElem.text(data.cpu.temp.Value);
	cpuTempMinElem.text(data.cpu.temp.Min);
	cpuTempMaxElem.text(data.cpu.temp.Max);
	cpuClocksValElem.text((data.cpu.clocks.Children.slice(1).map((core) => parseInt(core.Value.split(' ')[0])).reduce((a, b) => a + b, 0) / data.cpu.clocks.Children.slice(1).length).toFixed(2) + ' MHz');
	cpuClocksMinElem.text((data.cpu.clocks.Children.slice(1).map((core) => parseInt(core.Min.split(' ')[0])).reduce((a, b) => a + b, 0) / data.cpu.clocks.Children.slice(1).length).toFixed(2) + ' MHz');
	cpuClocksMaxElem.text((data.cpu.clocks.Children.slice(1).map((core) => parseInt(core.Max.split(' ')[0])).reduce((a, b) => a + b, 0) / data.cpu.clocks.Children.slice(1).length).toFixed(2) + ' MHz');
	cpuLoadValElem.text(data.cpu.load.Value);
	cpuLoadMinElem.text(data.cpu.load.Min);
	cpuLoadMaxElem.text(data.cpu.load.Max);
	cpuVoltValElem.text(data.cpu.volt.Value);
	cpuVoltMinElem.text(data.cpu.volt.Min);
	cpuVoltMaxElem.text(data.cpu.volt.Max);
	cpuPowerValElem.text(data.cpu.power.Value);
	cpuPowerMinElem.text(data.cpu.power.Min);
	cpuPowerMaxElem.text(data.cpu.power.Max);

	gpuTempValElem.text(data.gpu.temp.Value);
	gpuTempMinElem.text(data.gpu.temp.Min);
	gpuTempMaxElem.text(data.gpu.temp.Max);
	gpuClocksValElem.text(data.gpu.clocks.Value);
	gpuClocksMinElem.text(data.gpu.clocks.Min);
	gpuClocksMaxElem.text(data.gpu.clocks.Max);
	gpuLoadValElem.text(data.gpu.load.Value);
	gpuLoadMinElem.text(data.gpu.load.Min);
	gpuLoadMaxElem.text(data.gpu.load.Max);
	gpuRamUsedElem.text(data.gpu.ram.used.Value);
	gpuRamFreeElem.text(data.gpu.ram.free.Value);
	gpuRamPercentElem.text(((parseInt(data.gpu.ram.used.Value.split(' ')[0]) / parseInt(data.gpu.ram.total.split(' ')[0])) * 100).toFixed(2) + ' %');
	gpuFanSpeedElem.text(data.gpu.fan.Value);
	gpuFanMinElem.text(data.gpu.fan.Min);
	gpuFanMaxElem.text(data.gpu.fan.Max);
	gpuPowerValElem.text(data.gpu.power.Value)
	gpuPowerMinElem.text(data.gpu.power.Min)
	gpuPowerMaxElem.text(data.gpu.power.Max)

	ramDataUsedElem.text(data.ram.used.Value);
	ramDataFreeElem.text(data.ram.free.Value);
	ramDataPercentElem.text(((parseInt(data.ram.used.Value.split(' ')[0]) / parseInt(data.ram.free.Max.split(' ')[0])) * 100).toFixed(2) + ' %');

	let fanElems = [fan_1_labelElem, fan_1_SpeedElem, fan_1_MinElem, fan_1_MaxElem, fan_2_labelElem, fan_2_SpeedElem, fan_2_MinElem, fan_2_MaxElem, fan_3_labelElem, fan_3_SpeedElem, fan_3_MinElem, fan_3_MaxElem, fan_4_labelElem, fan_4_SpeedElem, fan_4_MinElem, fan_4_MaxElem, fan_5_labelElem, fan_5_SpeedElem, fan_5_MinElem, fan_5_MaxElem, fan_6_labelElem, fan_6_SpeedElem, fan_6_MinElem, fan_6_MaxElem];
	for (let i = 0; i < data.fan.length; i++) {
		try {
			fanElems[i * 4].text(data.fan[i].Text);
			fanElems[i * 4 + 1].text(data.fan[i].Value);
			fanElems[i * 4 + 2].text(data.fan[i].Min);
			fanElems[i * 4 + 3].text(data.fan[i].Max);
		} catch (err) { };
	}

	doTheFunkyColours(cpuTempValElem, data.cpu.temp.Value, 60, 75);
	doTheFunkyColours(cpuLoadValElem, data.cpu.load.Value, 60, 75);
	doTheFunkyColours(gpuTempValElem, data.gpu.temp.Value, 60, 75);
	doTheFunkyColours(gpuLoadValElem, data.gpu.load.Value, 60, 75);
	doTheFunkyColours(gpuRamPercentElem, ((parseInt(data.gpu.ram.used.Value.split(' ')[0]) / parseInt(data.gpu.ram.total.split(' ')[0])) * 100).toFixed(2), 60, 75);
	doTheFunkyColours(ramDataPercentElem, ((parseInt(data.ram.used.Value.split(' ')[0]) / parseInt(data.ram.free.Max.split(' ')[0])) * 100).toFixed(2), 60, 75);
}

function doTheFunkyColours(element, value, cautionThreshold, dangerThreshold) {
	if (dangerCheck(value, dangerThreshold)) element.css('color', COLOURS.danger);
	else if (cautionCheck(value, cautionThreshold)) element.css('color', COLOURS.caution);
	else element.css('color', '');
}

function cautionCheck(value, threshold) {
	return parseInt(value.split(' ')[0]) > threshold;
}

function dangerCheck(value, threshold) {
	return parseInt(value.split(' ')[0]) > threshold;
}