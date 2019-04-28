let context1 = document.getElementById("use").getContext("2d");
context1.canvas.width = 1000;
context1.canvas.height = 400;
let context2 = document.getElementById("temperature").getContext("2d");
context2.canvas.width = 1000;
context2.canvas.height = 400;

let motherBoard = document.getElementById("motherBoard");
let nmManufacturer = document.getElementById("nmManufacturer");
let nmModel = document.getElementById("nmModel");
let nmOS = document.getElementById("nmOS");

let labelTemp = 0;
let labelUse = 0;

/* Information Machine
    Mother Board
    nmManufacturer
    nmModel
    nmOS
*/

/* Metricas
    useRam (255, 0, 0)
    tempGPU (255, 148, 0)
    useGPU (3, 254, 0)
    useDisc (131, 254, 166)
    useCPU (131, 254, 252)
    tempCPU (131, 67, 252)
*/
let configurationUse = {
    type: 'line',
    data: {
        datasets: [{
            label: "Use Ram",
            type: 'line',
            backgroundColor: ['rgb(255, 0, 0)'],
            fill: false,
            showLine: true,
            borderColor: ['rgb(255, 0, 0)'],
            borderWidth: 2
        },{
            label: "Use GPU",
            type: 'line',
            backgroundColor: ['rgb(3, 254, 0)'],
            fill: false,
            borderColor: ['rgb(3, 254, 0)'],
            borderWidth: 2
        },{
            label: "use Disc",
            type: 'line',
            backgroundColor: ['rgb(131, 254, 166)'],
            fill: false,
            borderColor: ['rgb(131, 254, 166)'],
            borderWidth: 2
        },{
            label: "use CPU",
            type: 'line',
            backgroundColor: ['rgb(131, 254, 252)'],
            fill: false,
            borderColor: ['rgb(131, 254, 252)'],
            borderWidth: 2
        }],
    },
    options: {
        elements: {
            line: {
                tension : 0
            }
        },
        scales: {
            xAxes: [{
                distribution: 'series',
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Machine Metrics'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
            duration: 0
        }
    }
};

let configurationTemp = {
    type: 'line',
    data: {
        datasets: [{
            label: "Temperature GPU",
            type: 'line',
            backgroundColor: ['rgb(255, 148, 0)'],
            fill: false,
            borderColor: ['rgb(255, 148, 0)'],
            borderWidth: 2
        },{
            label: "Temperature CPU",
            type: 'line',
            backgroundColor: ['rgb(131, 67, 252)'],
            borderColor: ['rgb(131, 67, 252)'],
            borderWidth: 2,
            fill: false
        }],
    },
    options: {
        elements: {
            line: {
                tension : 0
            }
        },
        scales: {
            xAxes: [{
                distribution: 'series',
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Machine Metrics'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
            duration: 0
        }
    }
};

let use = new Chart(context1, configurationUse);
let temperature = new Chart(context2, configurationTemp);

let idUser = document.location.pathname.split('/')[3];
let idChampionship = document.location.pathname.split('/')[5];

fetch(`/data/machine/${idUser}/graphics/${idChampionship}/latest`)
    .then(res => res.json())
    .then(data => {

        motherBoard.innerText = "Mother Board: " + data.motherBoard;
        nmManufacturer.innerText = "Name Manufacturer: " + data.nmManufacturer;
        nmModel.innerText = "Name Model: " + data.nmModel;
        nmOS.innerText = "Name OS: " + data.nmOS;

        setupDataGraphicTemp();
        setupDataGraphicUse();
        addDataGraphicTemp(data);
        addDataGraphicUse(data);

        update();
    })

function update() {
    setInterval(() => {
        fetch(`/data/machine/${idUser}/graphics/${idChampionship}/last`)
            .then(res => res.json())
            .then(data => {
                addDataGraphicTemp(data);
                addDataGraphicUse(data);
            });
    }, 1000)
}

function addDataGraphicTemp(datas) {
    temperature.data.labels.push(labelTemp);
    temperature.data.datasets[0].data.push(datas.tempGPU);
    temperature.data.datasets[1].data.push(datas.tempCPU);
    labelTemp++;
    temperature.update();
}

function addDataGraphicUse(datas) {
    use.data.labels.push(labelUse);
    use.data.datasets[0].data.push(datas.useRam);
    use.data.datasets[1].data.push(datas.useGPU);
    use.data.datasets[2].data.push(datas.useDisc);
    use.data.datasets[3].data.push(datas.useCPU);
    labelUse++;
    use.update();
}

function setupDataGraphicTemp() {
    temperature.data.datasets[0].data = [];
    temperature.data.datasets[1].data = [];
    temperature.update();
}

function setupDataGraphicUse() {
    use.data.datasets[0].data = [];
    use.data.datasets[1].data = [];
    use.data.datasets[2].data = [];
    use.data.datasets[3].data = [];
    use.update();
}
