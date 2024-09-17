/*
Familiarize yourself with the concepts of vertices, shaders, buffers, and transformations in WebGL/OpenGL.

Understand how vertices define the shape of an object, shaders control the appearance, buffers hold data,
    and transformations position and orient objects.

Create a WebGL/OpenGL Program that produces a Colored Cube. Write the vertex and fragment shaders.
    The vertex shader should handle the vertex positions and transformations,
    while the fragment shader should define the colors.

Set up a render loop that continuously updates and redraws the scene.
    Inside the loop, apply transformations, update uniform values, and issue draw calls.
    Inside the render loop, issue draw calls to render the cube.
    Ensure the shaders are correctly receiving vertex and color data.

Run the program and observe the colored cube on the screen.
    Debug any issues that may arise, such as incorrect transformations or shader errors.

Document the steps you took to create the colored cube.
    Explain the role of shaders, buffers, and transformations in achieving the final result.
    Reflect on what you've learned through this exercise.
    This should be approximately 3 paragraphs in length.
 */

/**
 * <p>The state variable is used to store the following information: </p>
 * <ul>
 *     <li>gl: A reference to the WebGL rendering context. </li>
 *     <li>program: A reference to the WebGL program object that contains the shaders used to render the 3D objects. </li>
 *     <li>ui: An object that contains properties related to the user interface,
 *         such as the dragging state, the last mouse position, and the pressed keys.  </li>
 *     <li>animation: An object that contains properties related to the animation,
 *         such as the tick function for updating and rendering the animation.  </li>
 *     <li>app: An object that contains properties related to the application itself,
 *         such as the current angle of rotation and the position of the camera (eye).  </li>
 * </ul>
 * @type {{app: {eye: {x: number, y: number, z: number},
 *         angle: {x: number, y: number}},
 *         ui: {mouse: {lastY: number, lastX: number},
 *         dragging: boolean, pressedKeys: {}},
 *         gl: null,
 *         program: null,
 *         animation: {}}}
 *
 */
let state = {
    gl: null,
    program: null,
    ui: {
        dragging: false,
        mouse: {lastX: -1, lastY: -1,},
        pressedKeys: {},
    },
    animation: {},
    app: {
        angle: {x: 0, y: 0,},
        eye: {x: 4., y: 4., z: 4.,},
    },
    canvas: null,
};

/**
 * The DEFAULT_VERT array contains the vertex data for a cube with each face having a different color.
 * The vertex data is organized in the following format: <br>
 * Each vertex is represented by 8 consecutive numbers. <br>
 * The first 3 numbers represent the 3D coordinates (x, y, z) of the vertex. <br>
 * The next 3 numbers represent the color (r, g, b) of the vertex.
 * @type {number[]}
 */
const DEFAULT_VERT = [
    1, 1, 1, 1, 1, 1, 1, 1,
    -1, 1, 1, 1, 1, 0, 0, 1,
    -1, -1, 1, 1, 0, 1, 0, 1,
    1, -1, 1, 1, 0, 0, 1, 1,
    1, -1, -1, 1, 0, 1, 1, 1,
    1, 1, -1, 1, 1, 1, 0, 1,
    -1, 1, -1, 1, 1, 0, 1, 1,
    -1, -1, -1, 1, 0, 0, 0, 1,
];

/**
 * <p>The DEFAULT_INDICES array is used to define the indices for a cube. <br>
 * Each face of the cube is defined by a set of three vertices,
 *     and the indices specify the order in which these vertices are connected to form triangles. <br>
 * The indices are defined as an array of Uint8Array type, where each element represents the index of a vertex. <br>
 * The indices are in the order in which the vertices connect to form the triangles. </p>
 *
 * <p>For example, the first six indices (0, 1, 2, 0, 2, 3) define the triangles for the front face of the cube.
 *        The vertices with indices 0, 1, and 2 form the first triangle,
 *        and the vertices with indices 0, 2, and 3 form the second triangle. </p>
 * @type {Uint8Array}
 */
const DEFAULT_INDICES = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // front
    0, 3, 4, 0, 4, 5,    // right
    0, 5, 6, 0, 6, 1,    // up
    1, 6, 7, 1, 7, 2,    // left
    7, 4, 3, 7, 3, 2,    // down
    4, 7, 6, 4, 6, 5     // back
]);

/**
 * The <code>glUtils.SL.init</code> function does the following: <br>
 * <ol>
 *     <li>It accepts an optional opts parameter, which is an object containing various configuration options. </li>
 *     <li>It sets up callback functions, element names, data source attributes, data type attributes,
 *         and data version attributes based on the provided options or default values. </li>
 *     <li>It retrieves all the HTML elements with the specified element name (default is "shader")
 *         and stores them in the shaderElems array. </li>
 *     <li>It creates a new Signal object called loadedSignal and adds the provided callback function to it.
 *         This signal will be dispatched when all the shaders have been loaded. </li>
 *     <li>It initializes an empty Shaders object to store the shader source code. </li>
 *     <li>It sets the slShaderCount property to the number of shader elements found. </li>
 *     <li>It iterates through each shader element and retrieves the shader source code using the sendRequest method.
 *         It passes the processShader function as the callback to process the received shader source code. </li>
 *     <li>It calls the checkForComplete method to check if all the shaders have been loaded. </li>
 * </ol>
 */
glUtils.SL.init({
    callback: function () {
        main();
    }
});

/**
 * The main function initializes the WebGL application, sets up the rendering context,
 * and starts the animation loop.
 *
 * <p>The function performs the following steps:</p>
 * <ol>
 *     <li>Retrieves the canvas element from the HTML document using its ID.</li>
 *     <li>Adjusts the canvas size based on its width and height to ensure a square aspect ratio.</li>
 *     <li>Sets the canvas element as the rendering context for WebGL.</li>
 *     <li>Checks if WebGL is supported and enabled on the canvas.</li>
 *     <li>Initializes various callback functions for handling user input events.</li>
 *     <li>Loads and compiles the shaders for rendering the 3D objects.</li>
 *     <li>Sets up the WebGL context and rendering state.</li>
 *     <li>Starts the animation loop to continuously update and render the 3D scene.</li>
 * </ol>
 */
function main() {
    const canvas = document.getElementById('glCanvas');
    if (canvas.height >= canvas.width) {
        canvas.height = canvas.width;
    } else {
        canvas.width = canvas.height;
    }
    state.canvas = document.getElementById("glCanvas");
    state.gl = glUtils.checkWebGL(state.canvas);
    initCallbacks();
    initShaders();
    initGL();
    animate();

}

/**
 * Initializes various callback functions for handling user input events in the WebGL application.
 */
function initCallbacks() {
    document.onkeydown = keydown;
    document.onkeyup = keyup;
    state.canvas.onmousedown = mousedown;
    state.canvas.onmouseup = mouseup;
    state.canvas.onmousemove = mousemove;
}

/**
 * Initializes the shaders for rendering the 3D objects.
 */
function initShaders() {
    const vertexShader = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    state.program = glUtils.createProgram(state.gl, vertexShader, fragmentShader);
}

/**
 * Initializes the WebGL context and sets up the rendering state.
 */
function initGL() {
    state.gl.clearColor(0, 0, 0, 1);
    state.gl.enable(state.gl.DEPTH_TEST);
}

/**
 * The updateState() function acts as a render loop
 * that continuously updates and redraws the scene in the WebGL application.
 */
function animate() {
    state.animation.tick = function () {
        updateState();
        draw();
        requestAnimationFrame(state.animation.tick);
    };
    state.animation.lastUpdateTime = Date.now() / 1000;
    state.animation.tick();
}

/**
 * This function causes the cube to rotate continuously if mouse is not down and keys are not pressed.
 * It also handles keyboard events to control the movement of the "eye" (camera) in the 3D scene.
 */
function updateState() {
    let rotationSpeed = 0.4; // Adjust this value to control the rotation speed an arrow key response speed.
    const currentTime = Date.now() / 1000;
    const timeDifference = currentTime - state.animation.lastUpdateTime;

    // Update the angles based on the time difference
    state.app.angle.x += rotationSpeed * timeDifference;
    state.app.angle.y += rotationSpeed * timeDifference;

    // Update the last update time
    state.animation.lastUpdateTime = currentTime;

    let keyPressSpeed = rotationSpeed / 1.2; // Adjust this value to control arrow key response speed.
    // Handle keyboard events to control the movement of the "eye" (camera) in the 3D scene
    if (state.ui.pressedKeys[37]) {
        // left arrow
        state.app.eye.x += keyPressSpeed;
    } else if (state.ui.pressedKeys[39]) {
        // right arrow
        state.app.eye.x -= keyPressSpeed;
    } else if (state.ui.pressedKeys[40]) {
        // down arrow
        state.app.eye.y += keyPressSpeed;
    } else if (state.ui.pressedKeys[38]) {
        // up arrow
        state.app.eye.y -= keyPressSpeed;
    }
}

/**
 * This function renders the 3D scene on the canvas based on the current state of the WebGL application,
 * such as the vertex positions, indices, angles of rotation, and the position of the "eye" (camera).
 * It is called repeatedly within the animate() function
 * to create a continuous animation loop that updates and redraws the scene.
 * @param args
 */
function draw(args) {
    const v = (args && args.v) ? args.v : DEFAULT_VERT;
    const vi = (args && args.vi) ? args.vi : DEFAULT_INDICES;
    const uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    const n = initVertexBuffers(v, vi).indices.length;
    const mvm = mat4.create();
    const pm = mat4.create();
    const mvp = mat4.create();
    let far = window.innerWidth / 5;

    mat4.perspective(pm,
        20, 1, 1, far
    );
    mat4.lookAt(mvm,
        vec3.fromValues(state.app.eye.x, state.app.eye.y, state.app.eye.z),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0)
    );
    mat4.copy(mvp, pm);
    mat4.multiply(mvp, mvp, mvm);
    mat4.rotateX(mvp, mvp, state.app.angle.x);
    mat4.rotateY(mvp, mvp, state.app.angle.y);

    state.gl.useProgram(state.program);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
    state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
}

/**
 * This function initializes the vertex buffers and attributes for rendering the 3D objects in the scene.
 * @param v
 * @param i
 * @returns {Float32Array}
 */
function initVertexBuffers(v, i) {
    const vertices = new Float32Array(v);
    vertices.stride = 8;
    vertices.attributes = [
        {name: 'aPosition', size: 3, offset: 0},
        {name: 'aColor', size: 3, offset: 4},
    ];
    vertices.n = vertices.length / vertices.stride;
    vertices.indices = i;
    state.program.renderBuffers(vertices, i);
    return vertices;
}

/**
 * This function handles keyboard events to control the movement of the "eye" (camera).
 * @param event
 */
function keydown(event) {
    state.ui.pressedKeys[event.keyCode] = true;
}

/**
 * This function handles keyboard events to control the movement of the "eye" (camera).
 * @param event
 */
function keyup(event) {
    state.ui.pressedKeys[event.keyCode] = false;
}

/**
 * This function handles mouse click events to control the manual rotation of the cube.
 * @param event
 */
function mousedown(event) {
    const x = event.clientX;
    const y = event.clientY;
    const rect = event.target.getBoundingClientRect();
    // If we're within the rectangle, mouse is down within canvas.
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        state.ui.mouse.lastX = x;
        state.ui.mouse.lastY = y;
        state.ui.dragging = true;
    }
}

/**
 * This function handles mouse up events to control the manual rotation of the cube.
 * @param event
 */
function mouseup(event) {
    state.ui.dragging = false;
}


/**
 * This function handles drags events to control the manual rotation of the cube.
 * @param event
 */
function mousemove(event) {
    const x = event.clientX;
    const y = event.clientY;
    if (state.ui.dragging) {
        // The rotation speed factor
        // dx and dy here are how for in the x or y direction the mouse moved
        const factor = 10 / state.canvas.width;
        const dx = factor * (x - state.ui.mouse.lastX);
        const dy = factor * (y - state.ui.mouse.lastY);

        // update the latest angle
        state.app.angle.x = state.app.angle.x + dy;
        state.app.angle.y = state.app.angle.y + dx;
    }
    // update the last mouse position
    state.ui.mouse.lastX = x;
    state.ui.mouse.lastY = y;
}

