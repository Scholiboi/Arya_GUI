// localStorage.setItem('powerStatus', 'off');
// document.querySelector('.power').addEventListener('click', function() {
//     localStorage.setItem('powerStatus', 'on');
// });

let charts = [];
let intervalId = null;
let fetchIntervalId = null;
let a = 0;
let currentRow = 0;

const fetchData = () => {
    fetch(`test.csv?timestamp=${Date.now()}`)
        .then(response => response.text())
        .then(text => {
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                complete: ({ data }) => {
                    if (data.length) {
                        console.log('CSV data:', data);
                        const rowData = data[currentRow];
                        console.log('Displaying row:', currentRow, rowData);

                        document.getElementById('temperature').innerText = rowData.TEMPERATURE;
                        document.getElementById('pressure').innerText = rowData.PRESSURE;
                        document.getElementById('voltage').innerText = rowData.VOLTAGE;
                        document.getElementById('altitude').innerText = rowData.ALTITUDE;
                        document.getElementById('tilt').innerText = `x: ${rowData.TILT_X}, y: ${rowData.TILT_Y}`;
                        document.getElementById('latlong').innerText = `${rowData.GPS_LATITUDE}, ${rowData.GPS_LONGITUDE}`;
                        currentRow = (currentRow + 1) % data.length;
                    } else {
                        console.error('No data found in the CSV.');
                    }
                },
                error: error => console.error('Error parsing CSV:', error)
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
};

const updateGraphs = () => {
    fetch(`test.csv?timestamp=${Date.now()}`)
        .then(response => response.text())
        .then(text => {
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                complete: ({ data }) => {
                    if (data.length) {
                        console.log('CSV data:', data);
                        const rowData = data[currentRow];
                        console.log('Displaying row:', currentRow, rowData);
                        currentRow = (currentRow + 1) % data.length;
                        a++;
                        updateChart(charts[0], { x: a, y: rowData.TEMPERATURE});
                        updateChart(charts[1], { x: a, y: rowData.PRESSURE });
                        updateChart(charts[2], { x: a, y: rowData.VOLTAGE });
                        updateChart(charts[3], { x: a, y: rowData.ALTITUDE });
                        updateChart(charts[4], { x: a, y: Math.random() * 100 });
                        updateChart(charts[5], { x: a, y: Math.random() * 100 });
                    } else {
                        console.error('No data found in the CSV.');
                    }
                },
                error: error => console.error('Error parsing CSV:', error)
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
    };

document.querySelector('.power').addEventListener('click', function() {
    if (this.classList.contains('clicked')) {
        // Stop updating charts
        clearInterval(intervalId);
        clearInterval(fetchIntervalId);
        console.log('Cleared fetch interval with ID:', fetchIntervalId);
        fetchIntervalId = null;
        currentRow = 0; // Reset currentRow to 0

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
        // Start updating charts
        intervalId = setInterval(updateGraphs, 1000);

        // Start fetching data
        fetchIntervalId = setInterval(fetchData, 1000);
        console.log('Started fetch interval with ID:', fetchIntervalId);
        
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

document.querySelector('.flight').addEventListener('click', function() {
    this.classList.toggle('clicked');
});

document.querySelector('.sim').addEventListener('click', function() {
    this.classList.toggle('clicked');
});


window.onload = function() {
    (function (){
        fetch('test.csv')
        .then(response => response.text())
        .then(text => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
        //   current_time.length = 0;
          complete: (results) => {
            results.data.forEach(row => {
                if (row['MISSION_TIME']) {
                    current_time.push(row['MISSION_TIME']);
                    console.log("mission-time done")
                }
                if (row['PACKET_COUNT']) {
                    packet_count.push(row['PACKET_COUNT']);
                    console.log("packet_count done")
                } 
                if(row['STATE']) {
                    state.push(row['STATE']);
                    console.log("state done")
                }
            });
            setInterval(display_ct, 1000);
            setInterval(display_pc, 1000);
            setInterval(display_fss, 1000);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      })
    .catch(error => console.error('Error fetching CSV:', error));
    })();    
};


const current_time = []; 
let index1 = 0;
let timer; // Timer variable
let isPaused = false; // Flag to track pause state

function display_ct() {
    if (index1 < current_time.length && !isPaused) {
        console.log(current_time[index1]);
        document.getElementById('mission-time').innerHTML = current_time[index1];
        index1++;
    }
}

const packet_count = []; 
let index2 = 0;

function display_pc() {
    if (index2 < packet_count.length && !isPaused) {
        console.log(packet_count[index2]);
        document.getElementById('packet-count').innerHTML = packet_count[index2];
        index2++;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const restartButton = document.getElementById('restartButton');
    const playpauseButton = document.getElementById('playpauseButton');

    function handleImageClick(button) {
        button.classList.toggle('active');
        button.style.opacity = button.classList.contains('active') ? '0.5' : '1'; 
    }

    restartButton.addEventListener('click', function () {
        handleImageClick(restartButton);
        // Reset indices and update display
        index1 = 0;
        index2 = 0;
        isPaused = false; // Ensure timer is not paused
        display_ct();
        display_pc();
    });

    playpauseButton.addEventListener('click', function () {
        handleImageClick(playpauseButton);
        isPaused = !isPaused; // Toggle pause state
        if (isPaused) {
            console.log("Timer and packet count paused.");
            clearInterval(timer); // Pause the timer
        } else {
            console.log("Timer and packet count resumed.");
            startDisplay(); // Resume the timer
        }
    });

    // Example of starting the timer and packet count display
    function startDisplay() {
        timer = setInterval(function() {
            display_ct();
            display_pc();
        }, 1000); // Update every second
    }

    startDisplay(); // Start the display

    // Attach click event listener for "Export to CSV" functionality
    document.addEventListener('click', function(event) {
        if (event.target.matches('a[href="Table.html"]') || event.target.closest('a[href="Table.html"]')) {
            window.open('Table.html', '_blank');
        }
    });
});

const state = [];
let index3=0;
function display_fss() {
    if (index3 < state.length && !isPaused) {
        console.log(state[index3]);
        if (state[index3]==1) {
            document.getElementById('f1').style.backgroundColor= '#79EBDE';
            document.getElementById('f2').style.backgroundColor= '#39A79A';
            document.getElementById('f3').style.backgroundColor= '#39A79A';
            document.getElementById('f4').style.backgroundColor= '#39A79A';
            document.getElementById('f5').style.backgroundColor= '#39A79A';
            document.getElementById('f6').style.backgroundColor= '#39A79A';
            document.getElementById('f7').style.backgroundColor= '#39A79A';
        }
        else if (state[index3]==2) {
            document.getElementById('f1').style.backgroundColor= '#39A79A';
            document.getElementById('f2').style.backgroundColor= '#79EBDE';
            document.getElementById('f3').style.backgroundColor= '#39A79A';
            document.getElementById('f4').style.backgroundColor= '#39A79A';
            document.getElementById('f5').style.backgroundColor= '#39A79A';
            document.getElementById('f6').style.backgroundColor= '#39A79A';
            document.getElementById('f7').style.backgroundColor= '#39A79A';
        }
        else if (state[index3]==3) {
            document.getElementById('f1').style.backgroundColor= '#39A79A';
            document.getElementById('f2').style.backgroundColor= '#39A79A';
            document.getElementById('f3').style.backgroundColor= '#79EBDE';
            document.getElementById('f4').style.backgroundColor= '#39A79A';
            document.getElementById('f5').style.backgroundColor= '#39A79A';
            document.getElementById('f6').style.backgroundColor= '#39A79A';
            document.getElementById('f7').style.backgroundColor= '#39A79A';
        }
        else if (state[index3]==4) {
            document.getElementById('f1').style.backgroundColor= '#39A79A';
            document.getElementById('f2').style.backgroundColor= '#39A79A';
            document.getElementById('f3').style.backgroundColor= '#39A79A';
            document.getElementById('f4').style.backgroundColor= '#79EBDE';
            document.getElementById('f5').style.backgroundColor= '#39A79A';
            document.getElementById('f6').style.backgroundColor= '#39A79A';
            document.getElementById('f7').style.backgroundColor= '#39A79A';
        }
        else if (state[index3]==5) {
            document.getElementById('f1').style.backgroundColor= '#39A79A';
            document.getElementById('f2').style.backgroundColor= '#39A79A';
            document.getElementById('f3').style.backgroundColor= '#39A79A';
            document.getElementById('f4').style.backgroundColor= '#39A79A';
            document.getElementById('f5').style.backgroundColor= '#79EBDE';
            document.getElementById('f6').style.backgroundColor= '#39A79A';
            document.getElementById('f7').style.backgroundColor= '#39A79A';
        }
        else if (state[index3]==6) {
            document.getElementById('f1').style.backgroundColor= '#39A79A';
            document.getElementById('f2').style.backgroundColor= '#39A79A';
            document.getElementById('f3').style.backgroundColor= '#39A79A';
            document.getElementById('f4').style.backgroundColor= '#39A79A';
            document.getElementById('f5').style.backgroundColor= '#39A79A';
            document.getElementById('f6').style.backgroundColor= '#79EBDE';
            document.getElementById('f7').style.backgroundColor= '#39A79A';
        }
        else if (state[index3]==7) {
            document.getElementById('f1').style.backgroundColor= '#39A79A';
            document.getElementById('f2').style.backgroundColor= '#39A79A';
            document.getElementById('f3').style.backgroundColor= '#39A79A';
            document.getElementById('f4').style.backgroundColor= '#39A79A';
            document.getElementById('f5').style.backgroundColor= '#39A79A';
            document.getElementById('f6').style.backgroundColor= '#39A79A';
            document.getElementById('f7').style.backgroundColor= '#79EBDE';
        }
        else {
            document.getElementById('f1').style.backgroundColor= '#39A79A';
        }
        // document.getElementById('state').innerHTML = state[index3];
        index3++;
    }
}


// const powerButton = document.getElementById('power_button');
// const missionTime = document.getElementById('mission-time');
// powerButton.addEventListener('click', () => {
//     if (missionTime.style.display === 'none') {
//       missionTime.style.display = 'block';
//     } else {
//       missionTime.style.display = 'none';
//     }
//   });

document.getElementById('commandInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        var inputText = this.value.toLowerCase();
        var outputBox = document.getElementById('outputBox');

        // Handle 'power on' command
        if (inputText === 'power on') {
            localStorage.setItem('powerStatus', 'on');
            outputBox.textContent = 'Power is now ON.';
            document.querySelector('.power').dispatchEvent(new Event('click'));
        }
        // Handle 'power off' command
        else if (inputText === 'power off') {
            localStorage.setItem('powerStatus', 'off');
            outputBox.textContent = 'Power is now OFF.';
        }
        // Check current power status
        else if (inputText === 'check power') {
            var powerStatus = localStorage.getItem('powerStatus') || 'off';
            outputBox.textContent = 'Power is currently ' + powerStatus.toUpperCase() + '.';
        }
        else if (inputText === 'cmd echo') {
            var prevCommand = localStorage.getItem('prevCommand') || 'no previous command found';
            outputBox.textContent = prevCommand;
        }
        // Handle unrecognized commands
        else {
            outputBox.textContent = 'Unrecognized command.';
        }
        // Save the command
        localStorage.setItem('prevCommand', inputText);
    }
});

