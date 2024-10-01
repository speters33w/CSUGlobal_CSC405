"use strict";

let canvas;
let gl;

let numVertices  = 36;

let points = [];
let colors = [];

let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = xAxis;
let distance = 0.7;

let flag = true;
let rotating = false;
let ShowHiddenSurfaces = true;

let theta = [ 45.0, 45.0, 45.0 ];

let thetaLoc;

window.onload = function ()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube(distance);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0,0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //
    //  Load shaders and initialize attribute buffers
    //
    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("distanceSlider").onchange = function(event) {
        colorCube(event.target.value);
    };
    // document.getElementById("colorSlider").onchange = function(event) {
    //     shade = event.target.value;
    // };
    document.getElementById("thetaXSlider").onchange = function(event) {
        theta[xAxis] = parseFloat(event.target.value) * Math.PI / 180.0;
    };
    document.getElementById("XAxisButton").onclick = function(){axis = xAxis;};

    document.getElementById("thetaYSlider").onchange = function(event) {
        theta[yAxis] = parseFloat(event.target.value) * Math.PI / 180.0;
    };
    document.getElementById("YAxisButton").onclick = function(){axis = yAxis;};

    document.getElementById("thetaZSlider").onchange = function(event) {
        theta[zAxis] = parseFloat(event.target.value) * Math.PI / 180.0;
    };
    document.getElementById("ZAxisButton").onclick = function(){axis = zAxis;};

    document.getElementById("rotationSlider").onchange = function(event) {
        if (!rotating) {
            theta[axis] += event.target.value;
        }
    };
    document.getElementById("ToggleRotateButton").onclick = function(){rotating = !rotating;};
    document.getElementById("ButtonH").onclick = function(){
        if(ShowHiddenSurfaces) gl.enable(gl.DEPTH_TEST);
        else gl.disable(gl.DEPTH_TEST);
        //if(ShowHiddenSurfaces) gl.enable(gl.CULL_FACE);
        //else gl.disable(gl.CULL_FACE);
        ShowHiddenSurfaces = !ShowHiddenSurfaces;
    };

    render();
}

function colorCube(size)
{
    quad( 1, 0, 3, 2, size);
    quad( 2, 3, 7, 6, size);
    quad( 3, 0, 4, 7, size);
    quad( 6, 5, 1, 2, size);
    quad( 4, 5, 6, 7, size);
    quad( 5, 4, 0, 1, size);
}

function quad(a, b, c, d, n)
{
    let vertices = [
        vec3( -n, -n,  n),  // smaller cube
        vec3( -n,  n,  n),
        vec3(  n,  n,  n ),
        vec3(  n, -n,  n ),
        vec3( -n, -n, -n ),
        vec3( -n,  n, -n ),
        vec3(  n,  n, -n ),
        vec3(  n, -n, -n )
    ];

    // Scale the vertices by the size parameter
    vertices = vertices.map(vertex => vec3(vertex[0]*n, vertex[1]*n, vertex[2]*n));

    let vertexColors = [
        [ 0.0, 0.0, 0.0, 0.5 ],  // black
        [ 1.0, 0.0, 0.0, 0.5 ],  // red
        [ 1.0, 1.0, 0.0, 0.5 ],  // yellow
        [ 0.0, 1.0, 0.0, 0.5 ],  // green
        [ 0.0, 0.0, 1.0, 0.5 ],  // blue
        [ 1.0, 0.0, 1.0, 0.5 ],  // magenta
        [ 0.0, 1.0, 1.0, 0.5 ],   // cyan
        [ 1.0, 1.0, 1.0, 0.5 ]  // white
    ];

    // We need to partition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad.
    let indices = [ a, b, c, a, c, d ];

    for ( let i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[a] );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(rotating) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame( render );
}
