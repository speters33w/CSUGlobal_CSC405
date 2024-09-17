import java.awt.Color;

import static edu.princeton.cs.algs4.StdDraw.setPenColor;
import static edu.princeton.cs.algs4.StdDraw.setPenRadius;
import static edu.princeton.cs.algs4.StdDraw.line;

public class SierpinskiTriangle {

    /**
     * Draws a Sierpinski Triangle
     *
     * @param x    coordinate of the triangle's base. This should always be set to 0 for the initial triangle.
     * @param y    coordinate of the triangle's base. This should always be set to 0 for the initial triangle.
     * @param size size of the triangle. This should always be set to 1 for the initial triangle.
     * @param n    number of recursions
     */
    public static void triangle(double x, double y, double size, int n) {

        if (n <= 0) {
            return;
        }


        setPenColor(Color.black);
        setPenRadius(.001);

        double theodorusConstant = Math.sqrt(3);

        line(x, y, x + size, y);
        line(x, y, (2 * x + size) / 2.0, y + theodorusConstant * size / 2);
        line(x + size, y, (2 * x + size) / 2.0, y + theodorusConstant * size / 2);


        triangle(x, y, size / 2.0, n - 1);
        triangle((2 * x + size) / 2.0, (y + y) / 2.0, size / 2.0, n - 1);
        triangle((x + (2 * x + size) / 2.0) / 2.0,
                (y + y + (theodorusConstant * size / 2)) / 2.0,
                size / 2.0, n - 1);


    }

    public static void main(String[] args) {

        triangle(0, 0, 1, 7);
    }
}