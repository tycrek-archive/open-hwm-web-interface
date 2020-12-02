const COLOURS = {
	caution: '#FFC107',
	danger: '#F44336'
}

var loop;
function monitor() {
	loop = setInterval(loopFunction, 2000);
}

function loopFunction() {
	loop = getData()
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
			load: d.Children[0].Children[1].Children[2].Children[0]
		},
		gpu: {
			temp: d.Children[0].Children[3].Children[1].Children[0],
			clocks: d.Children[0].Children[3].Children[0].Children[0],
			load: d.Children[0].Children[3].Children[2].Children[0],
			ram: {
				used: d.Children[0].Children[3].Children[6].Children[1],
				free: d.Children[0].Children[3].Children[6].Children[0],
				total: d.Children[0].Children[3].Children[6].Children[2].Max
			}
		},
		ram: {
			load: d.Children[0].Children[2].Children[0].Children[0],
			used: d.Children[0].Children[2].Children[1].Children[0],
			free: d.Children[0].Children[2].Children[1].Children[1]
		}
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

	let ramDataUsedElem = $('#ram-data-used');
	let ramDataFreeElem = $('#ram-data-free');
	let ramDataPercentElem = $('#ram-data-percent');

	cpuTempValElem.text(data.cpu.temp.Value);
	cpuTempMinElem.text(data.cpu.temp.Min);
	cpuTempMaxElem.text(data.cpu.temp.Max);
	cpuClocksValElem.text((data.cpu.clocks.Children.slice(1).map((core) => parseInt(core.Value.split(' ')[0])).reduce((a, b) => a + b, 0) / data.cpu.clocks.Children.slice(1).length).toFixed(2) + ' MHz');
	cpuClocksMinElem.text((data.cpu.clocks.Children.slice(1).map((core) => parseInt(core.Min.split(' ')[0])).reduce((a, b) => a + b, 0) / data.cpu.clocks.Children.slice(1).length).toFixed(2) + ' MHz');
	cpuClocksMaxElem.text((data.cpu.clocks.Children.slice(1).map((core) => parseInt(core.Max.split(' ')[0])).reduce((a, b) => a + b, 0) / data.cpu.clocks.Children.slice(1).length).toFixed(2) + ' MHz');
	cpuLoadValElem.text(data.cpu.load.Value);
	cpuLoadMinElem.text(data.cpu.load.Min);
	cpuLoadMaxElem.text(data.cpu.load.Max);

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

	ramDataUsedElem.text(data.ram.used.Value);
	ramDataFreeElem.text(data.ram.free.Value);
	ramDataPercentElem.text(((parseInt(data.ram.used.Value.split(' ')[0]) / parseInt(data.ram.free.Max.split(' ')[0])) * 100).toFixed(2) + ' %');

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