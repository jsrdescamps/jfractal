# jFractal

A small javascript library to generate 2D fractals using HTML5 canvas.

var display = new F.ProgressiveDisplay(
    new F.Picture(canvas, new F.Complex(-0.7, 0), {re:3, im:3}, true),
    new F.BailoutColoring(
      new F.BailoutAlgo(new F.MandelbrotEquation(), 40,  4),
      black,
      night
    )
).refresh();

[Demo](http://jsfiddle.net/jsrdescamps/qo5dsa7e/)
