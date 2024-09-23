"use strict";

let shadedSphereObjectSpace = function() {

let canvas;
let gl;
let program;

let numTimesToSubdivide = 5;

let index = 0;

let positionsArray = [];
let normalsArray = [];


let near = -10;
let far = 10;
let radius = 1.5;
let theta = 0.0;
let phi = 0.0;
let dr = 5.0 * Math.PI/180.0;

let left = -3.0;
let right = 3.0;
let top = 3.0;
let bottom = -3.0;

let va = vec4(0.0, 0.0, -1.0,1);
let vb = vec4(0.0, 0.942809, 0.333333, 1);
let vc = vec4(-0.816497, -0.471405, 0.333333, 1);
let vd = vec4(0.816497, -0.471405, 0.333333,1);

let lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
let lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
let lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

let materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
let materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
let materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
let materialShininess = 20.0;

let ctm;
let ambientColor, diffuseColor, specularColor;

let modelViewMatrix, projectionMatrix;
let modelViewMatrixLoc, projectionMatrixLoc;
let eyeLoc;

let eye;
let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);

function triangle(a, b, c) {

     // normals are vectors

     normalsArray.push(vec4(a[0],a[1], a[2], 0.0));
     normalsArray.push(vec4(b[0],b[1], b[2], 0.0));
     normalsArray.push(vec4(c[0],c[1], c[2], 0.0));


     positionsArray.push(a);
     positionsArray.push(b);
     positionsArray.push(c);

     index += 3;
}

function divideTriangle(a, b, c, count) {
    if (count > 0) {

        let ab = mix( a, b, 0.5);
        let ac = mix( a, c, 0.5);
        let bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle(a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);


    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    let nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    let normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( normalLoc);

    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    let positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    document.getElementById("redSlider").addEventListener("input", function(event) {
        materialAmbient[0] = event.target.value;
        materialDiffuse[0] = event.target.value;
        materialSpecular[0] = event.target.value;
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialAmbient"), flatten(materialAmbient));
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialDiffuse"), flatten(materialDiffuse));
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialSpecular"), flatten(materialSpecular));
    });
    document.getElementById("greenSlider").addEventListener("input", function(event) {
        materialAmbient[1] = event.target.value;
        materialDiffuse[1] = event.target.value;
        materialSpecular[1] = event.target.value;
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialAmbient"), flatten(materialAmbient));
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialDiffuse"), flatten(materialDiffuse));
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialSpecular"), flatten(materialSpecular));
    });
    // todo solid blue does not shade properly
    document.getElementById("blueSlider").addEventListener("input", function(event) {
        materialAmbient[2] = event.target.value;
        materialDiffuse[2] = event.target.value;
        materialSpecular[2] = event.target.value;
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialAmbient"), flatten(materialAmbient));
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialDiffuse"), flatten(materialDiffuse));
        gl.uniform4fv(gl.getUniformLocation(program, "uMaterialSpecular"), flatten(materialSpecular));
    });

    document.getElementById("init").onclick = function(){init();};

    document.getElementById("thetaSlider").onchange = function(event) {
        theta = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("subdivisionSlider").onchange = function(event) {
        numTimesToSubdivide = event.target.value;
        index = 0;
        positionsArray = [];
        normalsArray = [];
        init();
    };


    gl.uniform4fv(gl.getUniformLocation(program,
       "uAmbientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
       "uDiffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
       "uSpecularProduct"),flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
       "uLightPosition"),flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program,
       "uShininess"),materialShininess);



    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    gl.uniform3fv(gl.getUniformLocation(program,
       "eyePosition"), eye);


    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, top, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    for( let i=0; i<index; i+=3)
        gl.drawArrays(gl.TRIANGLES, i, 3);

    requestAnimationFrame(render);
}

}

shadedSphereObjectSpace();
