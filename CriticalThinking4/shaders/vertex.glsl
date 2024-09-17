// Declare an attribute variable to hold the position of each vertex
// This variable is passed from the application program to the vertex shader
attribute vec4 aPosition;

// Declare an attribute variable to hold the color of each vertex
// This variable is passed from the application program to the vertex shader
attribute vec4 aColor;

// Declare a uniform variable to hold the Model-View-Projection matrix
// This matrix is used to transform the vertex positions from model space to normalized device coordinates
uniform mat4 uMVPMatrix;

// Declare a varying variable to hold the color passed to the fragment shader
// This variable will be interpolated across the fragments produced by rasterization
varying vec4 vColor;

// The main function of the vertex shader
void main() {
  // Set the output position of the vertex in normalized device coordinates
  // The position is transformed using the Model-View-Projection matrix
  gl_Position = uMVPMatrix * aPosition;

  // Pass the color of the vertex to the fragment shader
  // The color will be interpolated across the fragments produced by rasterization
  vColor = aColor;
}
