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