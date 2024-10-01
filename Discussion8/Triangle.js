// Let's assume we have a Point type with an x and y property
interface Point {
  x: number;
  y: number;
}

// Returns double the signed area but that's fine
const edgeFunction = (a: Point, b: Point, c: Point) => {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
};

const ABC = edgeFunction(A, B, C);

// Create our colours
const colourA = new Colour(255, 0, 0); // Red
const colourB = new Colour(0, 255, 0); // Green
const colourC = new Colour(0, 0, 255); // Blue

function drawTriangle(A: Point, B: Point, C: Point) {
  // Calculate the edge function for the whole triangle (ABC)
  const ABC = edgeFunction(A, B, C);

  // Our nifty trick: Don't bother drawing the triangle if it's back facing
  if (ABC < 0) {
    return;
  }

  // Initialise our point
  const P = new Point(0, 0);

  // Get the bounding box of the triangle
  const minX = Math.min(A.x, B.x, C.x);
  const minY = Math.min(A.y, B.y, C.y);
  const maxX = Math.max(A.x, B.x, C.x);
  const maxY = Math.max(A.y, B.y, C.y);

  // Loop through all the pixels of the bounding box
  for (P.y = minY; P.y < maxY; P.y++) {
    for (P.x = minX; P.x < maxX; P.x++) {
      // Calculate our edge functions
      const ABP = edgeFunction(A, B, P);
      const BCP = edgeFunction(B, C, P);
      const CAP = edgeFunction(C, A, P);

      // Normalise the edge functions by dividing by the total area to get the barycentric coordinates
      const weightA = BCP / ABC;
      const weightB = CAP / ABC;
      const weightC = ABP / ABC;

      // If all the edge functions are positive, the point is inside the triangle
      if (ABP >= 0 && BCP >= 0 && CAP >= 0) {
        // Interpolate the colours at point P
        const r = colourA.r * weightA + colourB.r * weightB + colourC.r * weightC;
        const g = colourA.g * weightA + colourB.g * weightB + colourC.g * weightC;
        const b = colourA.b * weightA + colourB.b * weightB + colourC.b * weightC;
        const colourP = new Colour(r, g, b);

        // Draw the pixel
        setPixel(P.x, P.y, "red");
      }
    }
  }
}
