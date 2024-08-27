let charts = [];
let intervalId;
let a = 0;

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

