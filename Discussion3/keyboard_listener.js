/* Gandal, G. (2024, July 25). How to handle mouse and keyboard input in WebGL? GeeksforGeeks. https://www.geeksforgeeks.org/how-to-handle-mouse-and-keyboard-input-in-webgl/ */

const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('2d');
const info = document.getElementById('info');
let squareX = canvas.width / 2;
let squareY = canvas.height / 2;
const squareSize = 100;
const moveAmount = 10;
function drawSquare(x, y) {
    gl.clearRect(0, 0, canvas.width, canvas.height);
    gl.fillStyle = 'blue';
    gl.fillRect(x - squareSize / 2, y - squareSize / 2, squareSize, squareSize);
}
function updateInfo(key) {
    info.textContent = `Current Key: ${key}`;
}
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            squareY -= moveAmount;
            updateInfo('ArrowUp');
            break;
        case 'ArrowDown':
            squareY += moveAmount;
            updateInfo('ArrowDown');
            break;
        case 'ArrowLeft':
            squareX -= moveAmount;
            updateInfo('ArrowLeft');
            break;
        case 'ArrowRight':
            squareX += moveAmount;
            updateInfo('ArrowRight');
            break;
        default:
            updateInfo('None');
            break;
    }
    drawSquare(squareX, squareY);
});
document.getElementById('reset').addEventListener('click', () => {
    squareX = canvas.width / 2;
    squareY = canvas.height / 2;
    drawSquare(squareX, squareY);
    updateInfo('None');
});
drawSquare(squareX, squareY);