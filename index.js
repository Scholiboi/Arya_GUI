let charts = [];
let intervalId;
let a = 0;
localStorage.setItem('powerStatus', 'off');
document.querySelector('.power').addEventListener('click', function() {
    localStorage.setItem('powerStatus', 'on');
});
document.querySelector('.power').addEventListener('click', function() {
    this.classList.toggle('clicked');
    if (this.classList.contains('clicked')) {
        // Recreate charts if they don't exist
        if (charts.length === 0) {
            const ctx1 = document.getElementById('graph1').getContext('2d');
            const ctx2 = document.getElementById('graph2').getContext('2d');
            const ctx3 = document.getElementById('graph3').getContext('2d');
            const ctx4 = document.getElementById('graph4').getContext('2d');
            const ctx5 = document.getElementById('graph5').getContext('2d');
            const ctx6 = document.getElementById('graph6').getContext('2d');
            charts.push(createChart(ctx1, 'graph 1'));
            charts.push(createChart(ctx2, 'graph 2'));
            charts.push(createChart(ctx3, 'graph 3'));
            charts.push(createChart(ctx4, 'graph 4'));
            charts.push(createChart(ctx5, 'graph 5'));
            charts.push(createChart(ctx6, 'graph 6'));
        }
        // Start updating charts
        intervalId = setInterval(() => {
            a++;
            updateChart(charts[0], { x: a, y: Math.random() * 100 });
            updateChart(charts[1], { x: a, y: Math.random() * 100 });
            updateChart(charts[2], { x: a, y: Math.random() * 100 });
            updateChart(charts[3], { x: a, y: Math.random() * 100 });
            updateChart(charts[4], { x: a, y: Math.random() * 100 });
            updateChart(charts[5], { x: a, y: Math.random() * 100 });
        }, 1000);
    } else {
        // Stop updating charts
        clearInterval(intervalId);
        // Clear data inside charts
        charts.forEach(chart => {
            chart.data.labels = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            chart.update();
        });
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

function updateChart(chart, newData) {
    chart.data.labels.push(newData.x);
    chart.data.datasets[0].data.push(newData.y);
    chart.update();
}

document.querySelector('.flight').addEventListener('click', function() {
    this.classList.toggle('clicked');
});

document.querySelector('.sim').addEventListener('click', function() {
    this.classList.toggle('clicked');
});


// Initialize the data arrays
var x = [];
var y = [];
var z = [];

// Initial plot data and layout
var data = [{
    x: x,
    y: y,
    z: z,
    mode: 'lines',
    type: 'scatter3d'
}];

var layout = {
    title: '3D Line Plot',
    autosize: true,
    scene: {
        xaxis: { title: 'X Axis' },
        yaxis: { title: 'Y Axis' },
        zaxis: { title: 'Z Axis' }
    }
};

// Create the initial plot
Plotly.newPlot('graph-image', data, layout);

// Function to update the data
function updateData() {
    // Generate new random data
    var newX = Math.random() * 10;
    var newY = Math.random() * 10;
    var newZ = Math.random() * 10;

    // Append new data to the arrays
    x.push(newX);
    y.push(newY);
    z.push(newZ);

    // Keep the array length fixed
    if (x.length > 50) {
        x.shift();
        y.shift();
        z.shift();
    }

    // Update the plot
    Plotly.update('graph-image', {
        x: [x],
        y: [y],
        z: [z]
    }, [0]); 
}

// Update the graph every second
setInterval(updateData, 1000);



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
            });
            setInterval(display_ct, 1000);
            setInterval(display_pc, 1000);
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


function fetchData() {
    fetch('test.csv')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').innerText = `Temperature: ${data.temperature} °C`;
            document.getElementById('pressure').innerText = `Pressure: ${data.pressure} hPa`;
            document.getElementById('voltage').innerText = `Voltage: ${data.voltage} V`;
        })
        .catch(error => console.error('Error fetching data:', error));
}