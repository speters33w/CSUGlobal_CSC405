function getSlider(sliderId) {
    return document.getElementById(sliderId);
}

// Create an array of slider IDs
const sliderIds = ['radiusSlider', 'thetaSlider', 'phiSlider', 'aspectSlider', 'fovSlider'];

// Create an array of slider elements
const sliders = sliderIds.map(getSlider);

// Add a universal event listener to each slider element
sliders.forEach((slider) => {
    const sliderCircle = document.getElementById('sliderCircle');
    const sliderPath = document.getElementById('sliderPath');

    slider.addEventListener('input', (event) => {
        const angle = (event.target.value - slider.min) / (slider.max - slider.min) * 360;
        const radius = 40;
        const x = 50 + radius * Math.cos(angle * Math.PI / 180);
        const y = 50 + radius * Math.sin(angle * Math.PI / 180);
        sliderCircle.setAttribute('cx', x);
        sliderCircle.setAttribute('cy', y);
    });
});
