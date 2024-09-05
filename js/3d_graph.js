var x = [];
var y = [];
var z = [];
var csvData = [];  // To hold the parsed CSV data
var currentIndex = 0;  // Track the current row in the CSV
var intervalId_3d_graph = null;  // To hold the interval reference
var isUpdating = false;  // Flag to track whether graph is updating

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
function updateGraph_3d_Graph(newData) {
    x.push(newData.x);
    y.push(newData.y);
    z.push(newData.z);

    // Update the plot with the new data
    Plotly.update('graph-image', {
        x: [x],
        y: [y],
        z: [z]
    });
}

// Function to iterate through each row in the CSV and update the graph
function processNextRow() {
    if (currentIndex < csvData.length) {
        const row = csvData[currentIndex];
        updateGraph_3d_Graph({
            x: row.GPS_LATITUDE,
            y: row.GPS_LONGITUDE,
            z: row.GPS_ALTITUDE
        });
        currentIndex++;
    } else {
        clearInterval(intervalId);  // Stop when all rows are processed
    }
}

// Function to fetch and parse the CSV file
function fetchData_3d_Graph() {
    Papa.parse('../test.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            csvData = results.data;  // Store the parsed CSV data
            currentIndex = 0;  // Reset the index
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });
}

// Function to start or stop the graph updates
function toggleGraph() {
    if (isUpdating) {
        // Stop updating and clear the graph
        clearInterval(intervalId_3d_graph);
        x = [];
        y = [];
        z = [];
        Plotly.update('graph-image', {x: [x], y: [y], z: [z]});  // Clear the graph
        isUpdating = false;
    } else {
        // Fetch the CSV data and start updating
        fetchData_3d_Graph();
        intervalId_3d_graph = setInterval(processNextRow, 1000);  // Start updating every second
        isUpdating = true;
    }
}

// Add event listener to the button
document.getElementById("power_button").addEventListener("click", toggleGraph);
