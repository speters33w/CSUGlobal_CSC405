/* Gandal, G. (2024, July 25). How to handle mouse and keyboard input in WebGL? GeeksforGeeks. https://www.geeksforgeeks.org/how-to-handle-mouse-and-keyboard-input-in-webgl/ */

const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('2d');
const info = document.getElementById('info');
let drawCircles = true;
gl.fillStyle = 'black';
gl.fillRect(0, 0, canvas.width, canvas.height);
function drawCircle(x, y, radius, color) {
    gl.beginPath();
    gl.arc(x, y, radius, 0, 2 * Math.PI, false);
    gl.fillStyle = color;
    gl.fill();
}
function clearCanvas() {
    gl.clearRect(0, 0, canvas.width, canvas.height);
    gl.fillStyle = 'black';
    gl.fillRect(0, 0, canvas.width, canvas.height);
}
function updateInfo(x, y) {
    info.textContent = `Mouse Position: X: ${x}, Y: ${y}`;
}
canvas.addEventListener('mousedown', (event) => {
    if (drawCircles) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        drawCircle(x, y, 20, 'red');
        updateInfo(x, y);
        console.log(`Mouse down at (${x}, ${y})`);
    }
});
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    updateInfo(x, y);
    console.log(`Mouse move at (${x}, ${y})`);
    if (drawCircles) {
        clearCanvas();
        drawCircle(x, y, 20, 'red');
    }
});
document.getElementById('clear')
    .addEventListener('click', () => {
        clearCanvas();
        updateInfo(0, 0);
    });