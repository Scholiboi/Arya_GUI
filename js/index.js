// localStorage.setItem('powerStatus', 'off');
// document.querySelector('.power').addEventListener('click', function() {
//     localStorage.setItem('powerStatus', 'on');
// });

let charts = [];
let intervalId = null;
let fetchIntervalId = null;
let a = 0;
let currentRow = 0;
let rowData = {};
const current_time = [];
let timer; // Timer variable
let isPaused = false; // Flag to track pause state
const packet_count = [];
let getCsvIntervalId = null;
let FSSIntervalId = null;
var x = [];
var y = [];
var z = [];
const setCurrentData = async () => {
    await fetch(`test.csv?timestamp=${Date.now()}`)
        .then(response => response.text())
        .then(text => {
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                complete: ({ data }) => {
                    if (data.length) rowData = data[currentRow];
                    else console.error('No data found in the CSV.');
                },
                error: error => console.error('Error parsing CSV:', error)
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
    console.log('Current row:', rowData);
    currentRow++;
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
let emptyData = "-/-"
const setToNull = () => {
    document.getElementById('temperature').innerText = emptyData;
    document.getElementById('pressure').innerText = emptyData;
    document.getElementById('voltage').innerText = emptyData;
    document.getElementById('altitude').innerText = emptyData;
    document.getElementById('acceleration').innerText = `${emptyData}`;
    document.getElementById('rotation').innerText = `z:${emptyData}`;
    document.getElementById('gyro').innerText = `${emptyData}`;
    document.getElementById('satellite-ct').innerText = `${emptyData}`;
    document.getElementById('gyrometer').innerText = `${emptyData}`;
    document.getElementById('tilt').innerText = `x: ${emptyData}, y: ${emptyData}`;
    document.getElementById('latlong').innerText = `${emptyData}, ${emptyData}`;
    document.getElementById('mission-time').innerHTML = emptyData;
    document.getElementById('packet-count').innerHTML = emptyData;
    document.getElementById('f1').style.backgroundColor = '#39A79A';
    document.getElementById('f2').style.backgroundColor = '#39A79A';
    document.getElementById('f3').style.backgroundColor = '#39A79A';
    document.getElementById('f4').style.backgroundColor = '#39A79A';
    document.getElementById('f5').style.backgroundColor = '#39A79A';
    document.getElementById('f6').style.backgroundColor = '#39A79A';
    document.getElementById('f7').style.backgroundColor = '#39A79A';
}
const updateGraphs = () => {
    a++;
    updateChart(charts[0], { x: a, y: rowData.TEMPERATURE });
    updateChart(charts[1], { x: a, y: rowData.PRESSURE });
    updateChart(charts[2], { x: a, y: rowData.VOLTAGE });
    updateChart(charts[3], { x: a, y: rowData.ALTITUDE });
    updateChart(charts[4], { x: a, y: Math.random() * 100 });
    updateChart(charts[5], { x: a, y: Math.random() * 100 });
};

document.querySelector('.power').addEventListener('click', function () {
    if (this.classList.contains('clicked')) {
        // Stop updating charts
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
        currentRow = 0; // Reset currentRow to 0

        setToNull();
        // Clear data inside charts
        charts.forEach(chart => {
            chart.data.labels = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            chart.update();
        });
    } else {
        // Recreate charts if they don't exist
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
        getCsvIntervalId = setInterval(setCurrentData, 1000);
        // Start updating charts
        intervalId = setInterval(updateGraphs, 1000);
        // Start fetching data
        fetchIntervalId = setInterval(fetchData, 1000);
        //start displaying software state
        FSSIntervalId = setInterval(display_fss, 1000);
        console.log('Started fetch interval with ID:', fetchIntervalId);

    }
});

const restartButton = document.getElementById('restartButton');
const playpauseButton = document.getElementById('playpauseButton');

function handleImageClick(button) {
    button.classList.toggle('active');
    button.style.opacity = button.classList.contains('active') ? '0.5' : '1';
}

restartButton.addEventListener('click', function () {
    // handleImageClick(restartButton);
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
        // startDisplay(); // Resume the timer
        getCsvIntervalId = setInterval(setCurrentData, 1000);
        // Start updating charts
        intervalId = setInterval(updateGraphs, 1000);
        // Start fetching data
        fetchIntervalId = setInterval(fetchData, 1000);
        //start displaying software state
        FSSIntervalId = setInterval(display_fss, 1000);
        // fetchIntervalId = setInterval(fetchData, 1000); // Resume the fetch interval
        intervalId_3d_graph = setInterval(updateGraph_3d_Graph, 1000); // Resume the update interval
    }
});
function createChart(ctx, label) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}

// Assuming updateChart function is defined elsewhere
function updateChart(chart, data) {
    chart.data.labels.push(data.x);
    chart.data.datasets.forEach(dataset => {
        dataset.data.push(data.y);
    });
    chart.update();
}

document.querySelector('.flight').addEventListener('click', function () {
    this.classList.toggle('clicked');
});

document.querySelector('.sim').addEventListener('click', function () {
    this.classList.toggle('clicked');
});



const state = [];
let index3 = 0;
function display_fss() {

    if (rowData.STATE == 1) {
        document.getElementById('f1').style.backgroundColor = '#79EBDE';
        document.getElementById('f2').style.backgroundColor = '#39A79A';
        document.getElementById('f3').style.backgroundColor = '#39A79A';
        document.getElementById('f4').style.backgroundColor = '#39A79A';
        document.getElementById('f5').style.backgroundColor = '#39A79A';
        document.getElementById('f6').style.backgroundColor = '#39A79A';
        document.getElementById('f7').style.backgroundColor = '#39A79A';
    }
    else if (rowData.STATE == 2) {
        document.getElementById('f1').style.backgroundColor = '#39A79A';
        document.getElementById('f2').style.backgroundColor = '#79EBDE';
        document.getElementById('f3').style.backgroundColor = '#39A79A';
        document.getElementById('f4').style.backgroundColor = '#39A79A';
        document.getElementById('f5').style.backgroundColor = '#39A79A';
        document.getElementById('f6').style.backgroundColor = '#39A79A';
        document.getElementById('f7').style.backgroundColor = '#39A79A';
    }
    else if (rowData.STATE == 3) {
        document.getElementById('f1').style.backgroundColor = '#39A79A';
        document.getElementById('f2').style.backgroundColor = '#39A79A';
        document.getElementById('f3').style.backgroundColor = '#79EBDE';
        document.getElementById('f4').style.backgroundColor = '#39A79A';
        document.getElementById('f5').style.backgroundColor = '#39A79A';
        document.getElementById('f6').style.backgroundColor = '#39A79A';
        document.getElementById('f7').style.backgroundColor = '#39A79A';
    }
    else if (rowData.STATE == 4) {
        document.getElementById('f1').style.backgroundColor = '#39A79A';
        document.getElementById('f2').style.backgroundColor = '#39A79A';
        document.getElementById('f3').style.backgroundColor = '#39A79A';
        document.getElementById('f4').style.backgroundColor = '#79EBDE';
        document.getElementById('f5').style.backgroundColor = '#39A79A';
        document.getElementById('f6').style.backgroundColor = '#39A79A';
        document.getElementById('f7').style.backgroundColor = '#39A79A';
    }
    else if (rowData.STATE == 5) {
        document.getElementById('f1').style.backgroundColor = '#39A79A';
        document.getElementById('f2').style.backgroundColor = '#39A79A';
        document.getElementById('f3').style.backgroundColor = '#39A79A';
        document.getElementById('f4').style.backgroundColor = '#39A79A';
        document.getElementById('f5').style.backgroundColor = '#79EBDE';
        document.getElementById('f6').style.backgroundColor = '#39A79A';
        document.getElementById('f7').style.backgroundColor = '#39A79A';
    }
    else if (rowData.STATE == 6) {
        document.getElementById('f1').style.backgroundColor = '#39A79A';
        document.getElementById('f2').style.backgroundColor = '#39A79A';
        document.getElementById('f3').style.backgroundColor = '#39A79A';
        document.getElementById('f4').style.backgroundColor = '#39A79A';
        document.getElementById('f5').style.backgroundColor = '#39A79A';
        document.getElementById('f6').style.backgroundColor = '#79EBDE';
        document.getElementById('f7').style.backgroundColor = '#39A79A';
    }
    else if (rowData.STATE == 7) {
        document.getElementById('f1').style.backgroundColor = '#39A79A';
        document.getElementById('f2').style.backgroundColor = '#39A79A';
        document.getElementById('f3').style.backgroundColor = '#39A79A';
        document.getElementById('f4').style.backgroundColor = '#39A79A';
        document.getElementById('f5').style.backgroundColor = '#39A79A';
        document.getElementById('f6').style.backgroundColor = '#39A79A';
        document.getElementById('f7').style.backgroundColor = '#79EBDE';
    }
    else {
        document.getElementById('f1').style.backgroundColor = '#39A79A';
    }
    // document.getElementById('state').innerHTML = state[index3];
}
prevCommand = "No previous command";

document.getElementById('commandInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        var inputText = this.value.toLowerCase();
        var outputBox = document.getElementById('outputBox');

        // Handle 'power on' command
        if (inputText === 'power on') {

            outputBox.textContent = 'Power is now ON.';
            if (!document.querySelector('.power').classList.contains('clicked')) document.querySelector('.power').dispatchEvent(new Event('click'));
        }
        // Handle 'power off' command
        else if (inputText === 'power off') {

            outputBox.textContent = 'Power is now OFF.';
            if (document.querySelector('.power').classList.contains('clicked')) document.querySelector('.power').dispatchEvent(new Event('click'));
        }
        // Check current power status
        else if (inputText === 'check power') {

            outputBox.textContent = 'Power is currently ' + powerStatus.toUpperCase() + '.';
        }
        else if (inputText === 'cmd echo') {
            outputBox.textContent = prevCommand;
        }
        // Handle unrecognized commands
        else {
            outputBox.textContent = 'Unrecognized command.';
        }
        // Save the command
        prevCommand = inputText;

    }
});



var intervalId_3d_graph = null;  // To hold the interval reference

// Define the initial data and layout for the plot
var data = [{
    type: 'scatter3d',
    mode: 'lines',  // Line graph mode
    x: x,
    y: y,
    z: z,
    line: {
        width: 6,  // Line width
        color: 'blue',  // Line color
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
        xaxis: { title: 'Latitude' },  // Adjusted axis title for clarity
        yaxis: { title: 'Longitude' },
        zaxis: { title: 'Altitude' }
    }
};

// Create the initial empty plot
Plotly.newPlot('graph-image', data, layout);

// Function to update the graph with new data from one row
function updateGraph_3d_Graph() {

    // Update the plot with the new data
    Plotly.update('graph-image', {
        x: [rowData.GPS_LATITUDE],
        y: [rowData.GPS_LONGITUDE],
        z: [rowData.GPS_ALTITUDE]
    });
}

// Function to start or stop the graph updates
// function toggleGraph() {
//     if (isUpdating) {
//         // Stop updating and clear the graph
//         clearInterval(intervalId_3d_graph);
//           // Clear the graph
//         isUpdating = false;
//     } else {
//         // Fetch the CSV data and start updating
//         fetchData_3d_Graph();
//         intervalId_3d_graph = setInterval(processNextRow, 1000);  // Start updating every second
//         isUpdating = true;
//     }
// }

// Add event listener to the button
document.getElementById("power_button").addEventListener("click", toggleGraph);
