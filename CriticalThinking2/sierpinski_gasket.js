"use strict";

let canvas;
let ctx;

const positions = [];
const colors = [];

const maxTimesToSubdivide = 5;

/**
 * Prepares the canvas and the GLSL context.
 * Renders the Sierpinski Gasket on the canvas.
 * This function is called in the init function.
 */
window.onload = function init()
{

    /* Configure Canvas and WebGL */

    // Get canvas element and get WebGL context
    // document.getElementById("gl-canvas") gets the canvas element from the DOM.
    // ctx.getContext('webgl2') gets the WebGL context.
    canvas = document.getElementById("gl-canvas");
    ctx = canvas.getContext('webgl2');
    if (!ctx) alert("WbGL unavailable. See https://get.webgl.org/");

    // Set up the canvas size based on the screen size.
    const horizontalScreenCanvasSide = window.innerHeight
    const verticalScreenCanvasSide = window.innerWidth

    // Create a square canvas with a transparent background.
    // This does not retain the aspect ratio of the canvas as desired todo,
    // but it does create sharper clearer images when the window is resized.
    if (window.innerWidth > window.innerHeight) {
        ctx.canvas.width = horizontalScreenCanvasSide;
        ctx.canvas.height = horizontalScreenCanvasSide;
    } else {
        ctx.canvas.width = verticalScreenCanvasSide;
        ctx.canvas.height = verticalScreenCanvasSide;
    }

    // Set up the viewport to cover the entire canvas
    ctx.viewport(0, 0, canvas.width, canvas.height);
    // Clears the canvas. With alpha set to 0, it leaves a transparent background.
    ctx.clearColor(0, 0, 0, 0);  // This is the background color.

    // Remove hidden surfaces
    // Since the vertices of the main gasket are randomly generated,
    // sometimes the entire gasket may be hidden. todo
    ctx.enable(ctx.DEPTH_TEST);

    /* Initialize Sierpinski Gasket */

    // Initialize the vertices of the 3D gasket, the initial tetrahedron with random length sides
    // using (Math.random() * 2) - 1 to generate points in the range [-1,1]
    const vertices = [
        vec3(0.0000, 0.0000, -1.0000),
        vec3(0.0000, (Math.random() * 2) - 1, (Math.random() * 2) - 1),
        vec3((Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1),
        vec3((Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1)
    ];

    // Calls the divideTetra function to create the Sierpinski Gasket
    // maxTimesToSubdivide is currently 5, used to generate higher numbers are more complex.
    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3],
        Math.floor(Math.random() * maxTimesToSubdivide) + 1);

    //  Initializes the GLSL vertex and fragment shaders from the DOM and binds them to the GLSL program
    const program = initShaders(ctx, "vertex-shader", "fragment-shader");
    ctx.useProgram(program);

    // Create buffers for the vertex and color attributes
    const cBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, cBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, flatten(colors), ctx.STATIC_DRAW);

    const colorLoc = ctx.getAttribLocation(program, "aColor");
    ctx.vertexAttribPointer(colorLoc, 3, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(colorLoc);

    const vBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, flatten(positions), ctx.STATIC_DRAW);

    const positionLoc = ctx.getAttribLocation(program, "aPosition");
    ctx.vertexAttribPointer(positionLoc, 3, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(positionLoc);


    // Render the Sierpinski Gasket.
    render();

    // todo this didn't work as expected. It redraws the same gasket over and over again.
    // setTimeout(() => {
    //     ctx.globalCompositeOperation = 'destination-out';
    //     ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     ctx.globalCompositeOperation = 'source-over';
    // }, 4000);
};

/**
 * Creates each triangle surface of a tetrahedron to produce a 3D Sierpinski Gasket.
 * Called by the tetra function.
 * @param a
 * @param b
 * @param c
 * @param color
 */
function triangle( a, b, c, color )
{

    // Adds colors and vertices for each tetrahedron.
    // The colors are randomly generated, and change as each tetrahedron is drawn.
    const baseColors = [
        vec3(Math.random(), Math.random(), Math.random()),
        vec3(Math.random(), Math.random(), Math.random()),
        vec3(Math.random(), Math.random(), Math.random()),
        vec3(Math.random(), Math.random(), Math.random())
    ];

    colors.push(baseColors[color]);
    positions.push(a);
    colors.push(baseColors[color]);
    positions.push(b);
    colors.push(baseColors[color]);
    positions.push(c);
}

/**
 * Creates a tetrahedron with each side using a different color
 * Called by the divideTetra function.
 *
 * @param a a vertex that is a corner of the tetrahedron
 * @param b a vertex that is a corner of the tetrahedron
 * @param c a vertex that is a corner of the tetrahedron
 * @param d a vertex that is a corner of the tetrahedron
 */
function tetra( a, b, c, d )
{
    triangle(a, c, b, 0);
    triangle(a, c, d, 1);
    triangle(a, b, d, 2);
    triangle(b, c, d, 3);
}


/**
 * Divides a tetrahedron into four smaller tetrahedra by finding the midpoints of its sides.
 * @param a a vertex that is a corner of the tetrahedron.
 * @param b a vertex that is a corner of the tetrahedron.
 * @param c a vertex that is a corner of the tetrahedron.
 * @param d a vertex that is a corner of the tetrahedron.
 * @param count the number of times to divide the tetrahedron.
 */
function divideTetra(a, b, c, d, count)
{
    // Stops recursion when the maximum number of subdivisions is reached.
    if (count === 0) {
        tetra(a, b, c, d);
    }

    // find the midpoints of sides
    // divide four smaller tetrahedra
    else {
        const ab = mix(a, b, 0.5);
        const ac = mix(a, c, 0.5);
        const ad = mix(a, d, 0.5);
        const bc = mix(b, c, 0.5);
        const bd = mix(b, d, 0.5);
        const cd = mix(c, d, 0.5);

        --count;

        divideTetra(a, ab, ac, ad, count);
        divideTetra(ab,  b, bc, bd, count);
        divideTetra(ac, bc,  c, cd, count);
        divideTetra(ad, bd, cd,  d, count);
    }
}

/**
 * Renders the Sierpinski Gasket and clears the buffers.
 */
function render()
{
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    ctx.drawArrays(ctx.TRIANGLES, 0, positions.length);
}
