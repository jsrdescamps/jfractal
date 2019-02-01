# jFractal

A small javascript library to generate 2D fractals using HTML5 canvas and a lot of dependency injection.

[Full demo application](http://jsrdescamps.github.io/jfractal/)

## Dependencies

It depends on the [jPalette](https://github.com/jsrdescamps/jpalette) library.

## How to install

## Node.js

```bash
npm install --save jpalette jfractal
```

## Download

Just download repositories jPalette and jFractal.

## How to import

### ES6 import

```javascript
import * as jPalette from 'jpalette';
import * as jFractal from 'jfractal';
```

### HTML script tag

```html
<script src="jpalette.min.js"></script>
<script src="jfractal.min.js"></script>
```

## How to use

### Basic example

```html
<canvas id="fractal" width="400" height="300"></canvas>
```

```javascript
let display = new jFractal.StandardDisplay(
    new jFractal.Picture(
      document.getElementById('fractal'),
      {left:-2.5, right:0.5, bottom:-1.5, top:1.5, keepRatio: true}
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
* ThreadedDisplay (worker.min.js must be in the same directory as your index.html)

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

## Examples

![Mandelbrot set](http://i.imgur.com/AZ3o42d.png)

![Burning ship set](http://i.imgur.com/B6zCrIi.png)

![Newton set](http://i.imgur.com/7dMEMpZ.png)

![Julia set](http://i.imgur.com/3dFD0Tk.png)

![Julia set](http://i.imgur.com/j6vNBpf.png)

![Mandelbrot set](http://i.imgur.com/jkMD5QD.png)

![Julia set](http://i.imgur.com/vbKYnlc.png)

![Newton set](http://i.imgur.com/6ROMN4l.png)
