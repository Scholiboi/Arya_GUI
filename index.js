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

a = 0;

const chart1 = createChart(document.getElementById('graph1').getContext('2d'), 'Graph 1');
const chart2 = createChart(document.getElementById('graph2').getContext('2d'), 'Graph 2');
const chart3 = createChart(document.getElementById('graph3').getContext('2d'), 'Graph 3');
const chart4 = createChart(document.getElementById('graph4').getContext('2d'), 'Graph 4');
const chart5 = createChart(document.getElementById('graph5').getContext('2d'), 'Graph 5');
const chart6 = createChart(document.getElementById('graph6').getContext('2d'), 'Graph 6');


function updateChart(chart, newData) {
chart.data.labels.push(newData.x);
chart.data.datasets[0].data.push(newData.y);
chart.update();
}


setInterval(() => {
a++;
updateChart(chart1, { x: a, y: Math.random() * 100 });
updateChart(chart2, { x: a, y: Math.random() * 100 });
updateChart(chart3, { x: a, y: Math.random() * 100 });
updateChart(chart4, { x: a, y: Math.random() * 100 });
updateChart(chart5, { x: a, y: Math.random() * 100 });
updateChart(chart6, { x: a, y: Math.random() * 100 });
}, 1000);