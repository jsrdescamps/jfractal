# jFractal

A small javascript library to generate 2D fractals using HTML5 canvas and a lot of dependency injection.

[Full demo application](http://jsrdescamps.github.io/jfractal/)

## Dependencies

It depends on the [jPalette](https://github.com/jsrdescamps/jpalette) library.

## How to use

### Include

```html
<script src="jpalette.js"></script>
<script src="jfractal.js"></script>
```

### Basic example

```html
<canvas id="fractal" width="400" height="300"></canvas>
```

```javascript
var display = new jFractal.StandardDisplay(
    new jFractal.Picture(
      document.getElementById('fractal'),
      new jFractal.Complex(-0.7, 0),
      {re:3, im:3},
      true
    ),
    new jFractal.SmoothBailoutColoring(
      new jFractal.BailoutAlgo(new jFractal.MandelbrotEquation(), 40,  1 << 16),
      jPalette.Color.get('black')(255),
      jPalette.ColorMap.get('night')(2000)
    )
).refresh();
```

[Demo](http://jsfiddle.net/jsrdescamps/qo5dsa7e/)

## Basic parameters available

### Display

* SimpleDisplay
* ProgressiveDisplay

### Algorithm

* BailoutAlgo
* NewtonAlgo

### Equations

* MandelbrotEquation
* TricornEquation
* BurningShipEquation
* NewtonEquation

### Coloring

* SimpleColoring
* BailoutColoring
* SmoothBailoutColoring
* AngleColoring
* BinaryColoring
