var rowData = {};
var currentRow = 0;
var x = [];
var y = [];
var z = [];
var a = 0;
var charts = [];
var getCsvIntervalId = null;
var intervalId = null;
var fetchIntervalId = null;
var FSSIntervalId = null;
var timer = null;
var isPaused = false;

let tableCsv;
let tableInitialized = false;

const headings = [
    "TEAM_ID","MISSION_TIME","PACKET_COUNT","MODE","STATE","ALTITUDE","AIR_SPEED",
    "HS_DEPLOYED","PC_DEPLOYED","TEMPERATURE","VOLTAGE","PRESSURE","GPS_TIME",
    "GPS_ALTITUDE","GPS_LATITUDE","GPS_LONGITUDE","GPS_SATS","TILT_X",
    "TILT_Y","ROT_Z","CMD_ECHO"
];

const setCurrentData = async () => {
    await fetch('http://localhost:3000/data')
        .then(response => response.json())
        .then(data => {
            // If first time, create the table with fixed headings
            if (!tableInitialized) {
                const tableRoot = document.querySelector("#csvRoot");
                tableCsv = new TableCsv(tableRoot);
                tableCsv.clear();
                tableCsv.setHeader(headings);
                tableInitialized = true;
            }
            // Append each new row line-by-line
            if (currentRow < data.length) {
                rowData = toObject(data[currentRow]);
                tableCsv.appendRow(data[currentRow]);
                console.log('Current row:', rowData);
                currentRow++;
            } else {
                console.log('No more rows in CSV.');
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
};

function toObject(arr) {
    // Adjust as needed for your CSV header order
    const header = [
        "TEAM_ID","MISSION_TIME","PACKET_COUNT","MODE","STATE","ALTITUDE","AIR_SPEED",
        "HS_DEPLOYED","PC_DEPLOYED","TEMPERATURE","VOLTAGE","PRESSURE","GPS_TIME",
        "GPS_ALTITUDE","GPS_LATITUDE","GPS_LONGITUDE","GPS_SATS","TILT_X","TILT_Y","ROT_Z","CMD_ECHO"
    ];
    let obj = {};
    header.forEach((key,index)=>obj[key] = arr[index]);
    return obj;
}

const fetchData = () => {
    document.getElementById('temperature').innerText = rowData.TEMPERATURE;
    document.getElementById('pressure').innerText = rowData.PRESSURE;
    document.getElementById('voltage').innerText = rowData.VOLTAGE;
    document.getElementById('altitude').innerText = rowData.ALTITUDE;
    document.getElementById('acceleration').innerText = `${(Math.random() * 100).toFixed(2)}`;
    document.getElementById('rotation').innerText = `z:${(Math.random() * 10).toFixed(2)}`;
    document.getElementById('gyro').innerText = `${(Math.random() * 50).toFixed(2)}`;
    document.getElementById('satellite-ct').innerText = `${Math.round(Math.random() * 26)}`;
    document.getElementById('gyrometer').innerText = `${rowData.AIR_SPEED}`;
    document.getElementById('tilt').innerText = `x: ${rowData.TILT_X}, y: ${rowData.TILT_Y}`;
    document.getElementById('latlong').innerText = `${rowData.GPS_LATITUDE}, ${rowData.GPS_LONGITUDE}`;
    document.getElementById('mission-time').innerHTML = rowData.MISSION_TIME;
    document.getElementById('packet-count').innerHTML = rowData.PACKET_COUNT;
};

const updateGraphs = () => {
    a++;
    updateChart(charts[0], { x: a, y: rowData.TEMPERATURE });
    updateChart(charts[1], { x: a, y: rowData.PRESSURE });
    updateChart(charts[2], { x: a, y: rowData.VOLTAGE });
    updateChart(charts[3], { x: a, y: rowData.ALTITUDE });
    updateChart(charts[4], { x: a, y: Math.random() * 100 });
    updateChart(charts[5], { x: a, y: Math.random() * 100 });
};


const restartButton = document.getElementById('restartButton');
const playpauseButton = document.getElementById('playpauseButton');

function handleImageClick(button) {
    button.classList.toggle('active');
    button.style.opacity = button.classList.contains('active') ? '0.5' : '1';
}

restartButton.addEventListener('click', function () {
    // Reset indices and update display
    currentRow = 0;
    x = [];
    y = [];
    z = [];
    Plotly.update('graph-image', { x: [x], y: [y], z: [z] });
    isPaused = false; // Ensure timer is not paused
});

playpauseButton.addEventListener('click', function () {
    handleImageClick(playpauseButton);
    isPaused = !isPaused; // Toggle pause state
    if (isPaused) {
        console.log("Timer and packet count paused.");
        clearInterval(timer); // Pause the timer
        clearInterval(fetchIntervalId); // Pause the fetch interval
        clearInterval(intervalId); // Pause the update interval
        clearInterval(getCsvIntervalId);
        clearInterval(FSSIntervalId);
        clearInterval(intervalId_3d_graph)
    } else {
        console.log("Timer and packet count resumed.");
        getCsvIntervalId = setInterval(setCurrentData, 1000);
        intervalId = setInterval(updateGraphs, 1000);
        fetchIntervalId = setInterval(fetchData, 1000);
        FSSIntervalId = setInterval(display_fss, 1000);
        intervalId_3d_graph = setInterval(updateGraph_3d_Graph, 1000);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const homeButton = document.getElementById('Home');
    const csvButton = document.getElementById('CSV');
    const graphButton = document.getElementById('graphs');
    const mapsButton = document.getElementById('maps');

    const csvToggle = document.getElementById('csvRoot');
    const graphToggle = document.getElementById('main-graphs');
    const mapsToggle = document.getElementById('interactive-map');
    const homeToggle = document.getElementById('home-content');
    const paramToggle = document.getElementById('parameters-box');

    homeButton.addEventListener('click', function () {
        homeToggle.style.visibility = 'visible';
        csvToggle.style.visibility = 'hidden';
        graphToggle.style.visibility = 'hidden';
        mapsToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'visible';
    });

    csvButton.addEventListener('click', function () {
        csvToggle.style.visibility = 'visible';
        graphToggle.style.visibility = 'hidden';
        mapsToggle.style.visibility = 'hidden';
        homeToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'hidden';
    });

    graphButton.addEventListener('click', function () {
        graphToggle.style.visibility = 'visible';
        csvToggle.style.visibility = 'hidden';
        mapsToggle.style.visibility = 'hidden';
        homeToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'visible';
    });

    mapsButton.addEventListener('click', function () {
        mapsToggle.style.visibility = 'visible';
        csvToggle.style.visibility = 'hidden';
        graphToggle.style.visibility = 'hidden';
        homeToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'visible';
    });
});

class TableCsv {
    constructor(root) {
        this.root = root;
    }

    update(data, headerColumns = []) {
        this.clear();
        this.setHeader(headerColumns);
        this.setBody(data);
    }

    clear() {
        this.root.innerHTML = "";
    }

    setHeader(headerColumns) {
        this.root.insertAdjacentHTML(
            "afterbegin",
            `
                <thead>
                    <tr>
                        ${headerColumns.map(text => `<th>${text}</th>`).join("")}
                    </tr>
                </thead>
            `
        );
    }

    setBody(data) {
        const rowsHtml = data.map(row =>
            `<tr>${row.map(text => `<td>${text}</td>`).join("")}</tr>`
        );
        this.root.insertAdjacentHTML("beforeend", `<tbody>${rowsHtml.join("")}</tbody>`);
    }

    appendRow(rowData) {
        // Ensure <tbody> exists
        if (!this.root.querySelector("tbody")) {
            this.root.insertAdjacentHTML("beforeend", "<tbody></tbody>");
        }
        const tbody = this.root.querySelector("tbody");
        const rowHtml = `<tr>${rowData.map(text => `<td>${text}</td>`).join("")}</tr>`;
        tbody.insertAdjacentHTML("beforeend", rowHtml);
    }
}

var intervalId_3d_graph = null;  // To hold the interval reference

var data = [{
    type: 'scatter3d',
    mode: 'lines',
    x: x,
    y: y,
    z: z,
    line: {
        width: 6,
        color: 'blue',
        opacity: 0.8
    }
}];

var layout = {
    autosize: true,
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    padding: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    scene: {
        xaxis: { title: 'Latitude' },
        yaxis: { title: 'Longitude' },
        zaxis: { title: 'Altitude' }
    }
};

Plotly.newPlot('graph-image', data, layout);

function updateGraph_3d_Graph() {
    // Accumulate new data
    x.push(parseFloat(rowData.GPS_LATITUDE));
    y.push(parseFloat(rowData.GPS_LONGITUDE));
    z.push(parseFloat(rowData.GPS_ALTITUDE));

    // Update plot
    Plotly.update('graph-image', {
        x: [x],
        y: [y],
        z: [z]
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const powerButton = document.querySelector('.power');
    const simButton = document.querySelector('.sim');
    const flightButton = document.querySelector('.flight');
    const calibrateButton = document.querySelector('.calibrate');

    powerButton.addEventListener('click', function () {
        this.classList.toggle('clicked');
        handlePowerButtonClick();
    });

    simButton.addEventListener('click', function () {
        this.classList.toggle('clicked');
        handleSimButtonClick();
    });

    flightButton.addEventListener('click', function () {
        this.classList.toggle('clicked');
        handleFlightButtonClick();
    });

    calibrateButton.addEventListener('click', function () {
        this.classList.toggle('clicked');
        handleCalibrateButtonClick();
    });
});

function handlePowerButtonClick() {
    const powerButton = document.querySelector('.power');
    if (powerButton.classList.contains('clicked')) {
        // If charts don't exist yet, create them
        if (charts.length === 0) {
            const ctx1 = document.getElementById('graph1').getContext('2d');
            const ctx2 = document.getElementById('graph2').getContext('2d');
            const ctx3 = document.getElementById('graph3').getContext('2d');
            const ctx4 = document.getElementById('graph4').getContext('2d');
            const ctx5 = document.getElementById('graph5').getContext('2d');
            const ctx6 = document.getElementById('graph6').getContext('2d');
            charts.push(createChart(ctx1, 'Temperature'));
            charts.push(createChart(ctx2, 'Pressure'));
            charts.push(createChart(ctx3, 'Voltage'));
            charts.push(createChart(ctx4, 'Altitude'));
            charts.push(createChart(ctx5, 'graph 5'));
            charts.push(createChart(ctx6, 'graph 6'));
        }
        // Start intervals
        getCsvIntervalId = setInterval(setCurrentData, 1000);
        intervalId = setInterval(updateGraphs, 1000);
        fetchIntervalId = setInterval(fetchData, 1000);
        FSSIntervalId = setInterval(display_fss, 1000);
        intervalId_3d_graph = setInterval(updateGraph_3d_Graph, 1000);
        console.log('Started fetch interval with ID:', fetchIntervalId);
    } else {
        // Clear and reset everything
        clearInterval(getCsvIntervalId);
        clearInterval(intervalId);
        clearInterval(fetchIntervalId);
        clearInterval(FSSIntervalId);
        clearInterval(intervalId_3d_graph);
        x = [];
        y = [];
        z = [];
        Plotly.update('graph-image', { x: [x], y: [y], z: [z] });
        console.log('Cleared fetch interval with ID:', fetchIntervalId);
        fetchIntervalId = null;
        currentRow = 0; 
        setToNull();
        charts.forEach(chart => {
            chart.data.labels = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            chart.update();
        });

        // Clear CSV table and reset
        if (tableCsv) {
            tableCsv.clear();
            tableInitialized = false;
        }
    }
}

function handleSimButtonClick() {
    console.log('Sim Mode toggled');
    // Add your logic for Sim Mode here
}

function handleFlightButtonClick() {
    console.log('Flight Mode toggled');
    // Add your logic for Flight Mode here
}

function handleCalibrateButtonClick() {
    console.log('Calibrate Mode toggled');
    // Add your logic for Calibrate Mode here
}

function createChart(context, label) {
    return new Chart(context, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: label,
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });
}

function updateChart(chart, point) {
    chart.data.labels.push(point.x);
    chart.data.datasets[0].data.push(point.y);
    chart.update();
}

function display_fss() {
    // Add any logic to update flight software states, for now a placeholder.
    console.log('display_fss called');
}

function setToNull() {
    // Reset or clear displayed data
    document.getElementById('temperature').innerText = '-/-';
    document.getElementById('pressure').innerText = '-/-';
    document.getElementById('voltage').innerText = '-/-';
    document.getElementById('altitude').innerText = '-/-';
    document.getElementById('acceleration').innerText = '-/-';
    document.getElementById('rotation').innerText = 'z:-/-';
    document.getElementById('gyro').innerText = '-/-';
    document.getElementById('satellite-ct').innerText = '-/-';
    document.getElementById('gyrometer').innerText = '-/-';
    document.getElementById('tilt').innerText = 'x:-/-, y:-/-';
    document.getElementById('latlong').innerText = '-/-, -/-';
    document.getElementById('mission-time').innerHTML = '';
    document.getElementById('packet-count').innerHTML = '';
}