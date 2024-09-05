document.addEventListener('DOMContentLoaded', function () {
    const homeButton = document.getElementById('Home');

    const csvToggle = document.getElementById('csvRoot');
    const graphToggle = document.getElementById('main-graphs');
    const mapsToggle = document.getElementById('interactive-map');
    const homeToggle = document.getElementById('home-content');
    const paramToggle = document.getElementById('parameters-box')
    
    homeButton.addEventListener('click', function () {
        homeToggle.style.visibility = 'visible';
        csvToggle.style.visibility = 'hidden';
        graphToggle.style.visibility = 'hidden';
        mapsToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'visible';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const csvButton = document.getElementById('CSV');
    
    const csvToggle = document.getElementById('csvRoot');
    const graphToggle = document.getElementById('main-graphs');
    const mapsToggle = document.getElementById('interactive-map');
    const homeToggle = document.getElementById('home-content');
    const paramToggle = document.getElementById('parameters-box')

    csvButton.addEventListener('click', function () {
        csvToggle.style.visibility = 'visible';
        graphToggle.style.visibility = 'hidden';
        mapsToggle.style.visibility = 'hidden';
        homeToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'hidden';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const graphButton = document.getElementById('graphs');
    
    const csvToggle = document.getElementById('csvRoot');
    const graphToggle = document.getElementById('main-graphs');
    const mapsToggle = document.getElementById('interactive-map');
    const homeToggle = document.getElementById('home-content');
    const paramToggle = document.getElementById('parameters-box')
    
    graphButton.addEventListener('click', function () {
        graphToggle.style.visibility = 'visible';
        csvToggle.style.visibility = 'hidden';
        mapsToggle.style.visibility = 'hidden';
        homeToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'visible';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const mapsButton = document.getElementById('maps');
    
    const csvToggle = document.getElementById('csvRoot');
    const graphToggle = document.getElementById('main-graphs');
    const mapsToggle = document.getElementById('interactive-map');
    const homeToggle = document.getElementById('home-content');
    const paramToggle = document.getElementById('parameters-box')
    
    mapsButton.addEventListener('click', function () {
        mapsToggle.style.visibility = 'visible';
        csvToggle.style.visibility = 'hidden';
        graphToggle.style.visibility = 'hidden';
        homeToggle.style.visibility = 'hidden';
        paramToggle.style.visibility = 'visible';
    });
});
