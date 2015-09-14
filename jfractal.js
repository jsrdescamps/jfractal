/**
 * Small library to generate 2D fractals.
 *
 * @version 0.5.0
 * @author Julien Descamps
 * @namespace jFractal
 * @todo Documentation
 * @todo Loading percentage
 * @todo Field lines
 * @todo Exceptions
 * @todo Anti Aliasing
 * @todo Web Workers
 */
 ;(function(namespace, undefined) {
   'use strict';

  /**
   * Complex number class.
   *
   * @constructor
   * @memberof jFractal
   * @param  {number} re - Real part
   * @param  {number} im - Imaginary part
   */
  var Complex = function(re, im) {
    this.re = re || 0;
    this.im = im || 0;
  };

  /**
   * Add a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  Complex.prototype.plus = function(z) {
    this.re += z.re;
    this.im += z.im;

    return this;
  };

  /**
   * Soustract a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  Complex.prototype.minus = function(z) {
    this.re -= z.re;
    this.im -= z.im;

    return this;
  };

  /**
   * Multiply a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  Complex.prototype.times = function(z) {
    var tmp = this.re * z.re - this.im * z.im;
    this.im = this.re * z.im + this.im * z.re;
    this.re = tmp;

    return this;
  };

  /**
   * Divide a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  Complex.prototype.div = function(z) {
    var div = z.re * z.re + z.im * z.im,
        tmp = (this.re * z.re + this.im * z.im) / div;
    this.im = (this.im * z.re - this.re * z.im) / div;
    this.re = tmp;

    return this;
  };

  /**
   * Conjugate complex of this object.
   *
   * @return {Complex} - This object
   */
  Complex.prototype.conj = function() {
    this.im = -this.im;

    return this;
  };

  /**
   * Absolute complex of this object.
   *
   * @return {Complex} - This object
   */
  Complex.prototype.abs = function() {
    this.re = Math.abs(this.re);
    this.im = Math.abs(this.im);

    return this;
  };

  /**
   * Return the squared module.
   *
   * @return {number} - Squared module
   */
  Complex.prototype.getSquare = function() {
    return this.re * this.re + this.im * this.im;
  };

  /**
   * Return the module.
   *
   * @return {number} - Module
   */
  Complex.prototype.getModule = function() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  };

  /**
   * Clone the complex.
   *
   * @return {Complex} - Cloned object
   */
  Complex.prototype.getCopy = function() {
    return new Complex(this.re, this.im);
  };

  /**
   * Return the "symetric" complex.
   *
   * @return {Complex} - Symetric object
   */
  Complex.prototype.getSym = function() {
    return new Complex(-this.re, -this.im);
  };

  /**
   * Convert the complex into a Point.
   *
   * @param  {Object} factor - {x: val, y: val}
   * @param  {Object} origin - {x: val, y: val}
   * @return {Point}
   */
  Complex.prototype.getPoint = function(factor, origin) {
    return new Point(
      (factor.x * origin.x + this.re) / factor.x,
      (factor.y * origin.y - this.im) / factor.y
    );
  };

  /**
   * 2D point class.
   *
   * @constructor
   * @memberof jFractal
   * @param  {number} x - X coordinate
   * @param  {number} y - Y coordinate
   */
  var Point = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  /**
   * Convert to complex.
   *
   * @param  {Object} factor - {x: val, y: val}
   * @param  {Object} point  - {x: val, y: val}
   * @return {Complex}
   */
  Point.prototype.toComplex = function(factor, point) {
    return new Complex(
      factor.x * (this.x - point.x),
      factor.y * (point.y - this.y)
    );
  };

  /**
   * Bailout fractal algorithm.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Equation} equation
   * @param  {number} maxIter
   * @param  {number} radius
   * @param  {Complex} c
   */
  var BailoutAlgo = function(equation, maxIter, radius, c) {
   this.equation = equation;
   this.radius   = radius;
   this.maxIter  = maxIter;
   this.c        = c;
  };

  /**
   * Iteration method.
   *
   * @param  {Complex} z
   * @return {Object}
   */
  BailoutAlgo.prototype.iterate = function(z) {
   var iter = 0, c = this.c || new Complex(z.re, z.im);
   if (!this.c) { z.re = 0; z.im = 0; }

   while (z.getSquare() <= this.radius && iter < this.maxIter) {
     this.equation.calculate(z, c);
     iter ++;
   }
   return {iter: iter, complex: z}; // TODO to object with constructor ?
  };

  /**
   * Newton fractal algorithm.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Equation} equation
   * @param  {number} maxIter
   * @param  {number} epsilon
   */
  var NewtonAlgo = function(equation, maxIter, epsilon) {
   this.equation = equation;
   this.epsilon  = epsilon;
   this.maxIter  = maxIter;
  };

  /**
   * Derivative method.
   *
   * @param  {Complex} z
   * @param  {Complex} dz
   * @param  {function} routine
   * @return {Complex}
   */
  NewtonAlgo.prototype.derivative = function(z, dz, routine) {
    var zo = z.getCopy(); // [f(z + dz) - f(z)] / dz
    return routine(z.plus(dz)).minus(routine(zo)).div(dz);
  };

  /**
   * Iteration method.
   *
   * @param  {Complex} z
   * @return {Object}
   */
  NewtonAlgo.prototype.iterate = function(z) {
   var iter = 0, dz = new Complex(1e-6, 1e-6), zo;

   do {
      zo = z.getCopy().minus(
        z.minus( // z - [f(z) / f'(z)]
          this.equation.calculate(z.getCopy())
          .div(this.derivative(z.getCopy(), dz, this.equation.calculate))));
      iter ++;
   }
   while (zo.getSquare() > this.epsilon && iter < this.maxIter);

   return {iter: iter, complex: zo};
  };

  /**
   * Newton fractal equation.
   *
   * @constructor
   * @memberof jFractal
   */
   var NewtonEquation = function() {};

   /**
    * Equation definition method.
    *
    * @param  {Complex} z
    * @return {Complex}
    */
   NewtonEquation.prototype.calculate = function(z) { // TODO Respect API ?!
     var zo = z.getCopy();
     z.times(z).times(zo).re -= 1;

     return z;
   };

 /**
  * Mandelbrot fractal equation.
  *
  * @constructor
  * @memberof jFractal
  */
  var MandelbrotEquation = function() {};

  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  MandelbrotEquation.prototype.calculate = function(z, c) {
    return z.times(z).plus(c);
  };

  /**
   * Mandelbrot cubic fractal equation.
   *
   * @constructor
   * @memberof jFractal
   */
  var MandelCubicEquation = function() {};

  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  MandelCubicEquation.prototype.calculate = function(z, c) {
    var zo = z.getCopy();
    return z.times(z).times(zo).plus(c);
  };

  /**
   * Mandelbrot quartic fractal equation.
   *
   * @constructor
   * @memberof jFractal
   */
  var MandelQuarticEquation = function() {};

  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  MandelQuarticEquation.prototype.calculate = function(z, c) {
    return z.times(z).times(z).plus(c);
  };

  /**
   * Tricorn fractal equation.
   *
   * @constructor
   * @memberof jFractal
   */
  var TricornEquation = function() {};

  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  TricornEquation.prototype.calculate = function(z, c) {
    return z.conj().times(z).plus(c);
  };

  /**
   * Burning Ship fractal equation.
   *
   * @constructor
   * @memberof jFractal
   */
  var BurningShipEquation = function() {};

  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  BurningShipEquation.prototype.calculate = function(z, c) {
    return z.abs().times(z).minus(c);
  };

  /**
   * Simple bicolor coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {Color} bailoutColor
   */
  var SimpleColoring = function(algorithm, mainColor, bailoutColor) {
   this.algorithm    = algorithm;
   this.mainColor    = mainColor;
   this.bailoutColor = bailoutColor;
  };

  /**
   * Return a color for a given complex.
   *
   * @param  {Complex} z
   * @return {Color}
   */
  SimpleColoring.prototype.getColor = function(z) {
   var bailout = this.algorithm.iterate(z);

   if (bailout.iter == this.algorithm.maxIter) {
     return this.mainColor;
   }
   return this.bailoutColor;
  };

  /**
   * Simple bailout coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {ColorMap} palette
   */
  var BailoutColoring = function(algorithm, mainColor, palette) {
   this.algorithm = algorithm;
   this.mainColor = mainColor;
   this.palette   = palette;
  };

  /**
   * Return a color for a given complex.
   *
   * @param  {Complex} z
   * @return {Color}
   */
  BailoutColoring.prototype.getColor = function(z) {
   var bailout = this.algorithm.iterate(z);

   if (bailout.iter == this.algorithm.maxIter) {
     return this.mainColor;
   }
   return this.palette.getColor(bailout.iter / this.algorithm.maxIter);
  };

  /**
   * Smoothed bailout coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {ColorMap} palette
   */
  var SmoothBailoutColoring = function(algorithm, mainColor, palette) {
   this.algorithm = algorithm;
   this.mainColor = mainColor;
   this.palette   = palette;
  };

  /**
   * Return a color for a given complex.
   *
   * @param  {Complex} z
   * @return {Color}
   */
  SmoothBailoutColoring.prototype.getColor = function(z) {
   var bailout = this.algorithm.iterate(z);

   if (bailout.iter == this.algorithm.maxIter) {
     return this.mainColor;
   }
   return this.palette.getColor( // TODO check range for log ! make a function !
     (bailout.iter + 1 -
      Math.log(
        Math.log(bailout.complex.getModule()) / Math.log(2)
      ) / Math.log(2)
     ) / this.algorithm.maxIter
   );
  };

  /**
   * Binary coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {Color} positiveColor
   * @param  {Color} negativeColor
   */
  var BinaryColoring = function(algorithm, mainColor, positiveColor, negativeColor) {
   this.algorithm     = algorithm;
   this.mainColor     = mainColor;
   this.positiveColor = positiveColor;
   this.negativeColor = negativeColor;
  };

  /**
   * Return a color for a given complex.
   *
   * @param  {Complex} z
   * @return {Color}
   */
  BinaryColoring.prototype.getColor = function(z) {
   var bailout = this.algorithm.iterate(z);

   if (bailout.iter == this.algorithm.maxIter) {
     return this.mainColor;
   }
   if (bailout.complex.im > 0) {
     return this.positiveColor;
   }
   return this.negativeColor;
  };

  /**
   * Complex angle coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {ColorMap} palette
   */
  var AngleColoring = function(algorithm, mainColor, palette) {
   this.algorithm = algorithm;
   this.mainColor = mainColor;
   this.palette   = palette;
  };

  /**
   * Return a color for a given complex.
   *
   * @param  {Complex} z
   * @return {Color}
   */
  AngleColoring.prototype.getColor = function(z) {
   var bailout = this.algorithm.iterate(z);

   if (bailout.iter == this.algorithm.maxIter) {
     return this.mainColor;
   }
   return this.palette.getColor( // TODO check range for atan2, make a function
      (Math.atan2(
       bailout.complex.im, bailout.complex.re) + Math.PI
      ) / (2 * Math.PI)
   );
  };

  /**
   * Picture management class using HTML5 canvas.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Canvas} canvas
   * @param  {Point} center
   * @param  {Object} range
   * @param  {boolean} keepRatio
   */
  var Picture = function(canvas, center, range, keepRatio) {
   this.canvas    = canvas;
   this.ctx       = this.canvas.getContext('2d');
   this.imageData = this.ctx.createImageData(canvas.width, canvas.height);
   this.origin    = new Point(canvas.width  / 2, canvas.height / 2);
   this.range     = range;
   this.keepRatio = keepRatio; // TODO Refactor
   if (keepRatio) { this.autoRange(); }
   this.scale     = this.computeScale();
   this.center    = center.getSym().getPoint(this.scale, this.origin);
  };

  /**
   * Define a pixel color.
   *
   * @param  {Point} point
   * @param  {Color} color
   * @return {Picture}
   */
  Picture.prototype.setPixel = function(point, color) {
   var index = (point.x + point.y * this.canvas.width) * 4;
   this.imageData.data[index + 0] = color.r;
   this.imageData.data[index + 1] = color.g;
   this.imageData.data[index + 2] = color.b;
   this.imageData.data[index + 3] = color.a;

   return this;
  };

  /**
   * Draw the picture.
   *
   * @return {Picture}
   */
  Picture.prototype.draw = function() {
   this.ctx.putImageData(this.imageData, 0, 0);

   return this;
  };

  /**
   * Compute the picture scaling factor.
   *
   * @return {Object}
   */
  Picture.prototype.computeScale = function() {
    return {
      x: (this.range.re / this.canvas.width),
      y: (this.range.im / this.canvas.height)
    };
  };

  /**
   * Refresh the picture scaling factor.
   *
   * @return {Picture}
   */
  Picture.prototype.rescale = function() {
    this.scale = this.computeScale();

    return this;
  };

  /**
   * Automatic range computation.
   *
   * @return {Picture}
   */
  Picture.prototype.autoRange = function() {
    var that = this,
        algo = function(arg1, arg2) {
      if (arg1 > arg2) {
        that.range.re *= arg1 / arg2;
      } else if (arg1 < arg2) {
        that.range.im *= arg2 / arg1;
      }
    };
    algo(this.range.im, this.range.re);
    algo(this.canvas.width, this.canvas.height);

    return this;
  };

  /**
   * Convert Point to Complex.
   *
   * @param  {Point} point
   * @return {Complex}
   */
  Picture.prototype.toComplex = function(point) {
    return point.toComplex(this.scale, this.center);
  };

  /**
   * Return the picture center.
   *
   * @return {Point}
   */
  Picture.prototype.getCenter = function() {
    return this.center.toComplex(this.scale, this.origin).getSym();
  };

  /**
   * Set the picture center.
   *
   * @param  {Point} center
   * @return {Picture}
   */
  Picture.prototype.setCenter = function(center) {
    if (center instanceof Point) {
      center = this.toComplex(center);
    }
    this.center = center.getSym().getPoint(this.scale, this.origin);

    return this;
  };

  /**
   * Set the picture range.
   *
   * @param  {Object} range
   * @return {Picture}
   */
  Picture.prototype.setRange = function(range) {
    this.range = range;
    if (this.keepRatio) { this.autoRange(); }
    this.rescale();

    return this;
  };

  /**
   * Zooming method.
   *
   * @param  {number} factor
   * @return {Picture}
   */
  Picture.prototype.zoom = function(factor) {
    this.range.re /= factor; // TODO Do not modify range !!!
    this.range.im /= factor;
    this.center.x  = this.origin.x * (1 - factor) + this.center.x * factor;
    this.center.y  = this.origin.y * (1 - factor) + this.center.y * factor;
    this.rescale(); // No autoRange() because same factor for re and im

    return this;
  };

  /**
   * Standard display.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Picture} picture
   * @param  {Coloring} coloring
   */
  var StandardDisplay = function(picture, coloring) {
    this.picture  = picture;
    this.coloring = coloring;
  };

  /**
   * Refresh display method.
   *
   * @return {StandardDisplay} [description]
   */
  StandardDisplay.prototype.refresh = function() {
    var x, y, point, canvas = this.picture.canvas;

    for (y = 0; y < canvas.height; y++) {
      for (x = 0; x < canvas.width; x++) {
        this.picture.setPixel(
          point = new Point(x ,y),
          this.coloring.getColor(
            point.toComplex(this.picture.scale, this.picture.center)));
      }
    }
    this.picture.draw();

    return this;
  };

  /**
   * Progressive display (adam7).
   *
   * @constructor
   * @param  {Picture} picture
   * @param  {Coloring} coloring
   */
  var ProgressiveDisplay = function(picture, coloring) {
    this.picture  = picture;
    this.coloring = coloring;
  };

  /**
   * Refresh display method.
   *
   * @return {StandardDisplay} [description]
   */
  ProgressiveDisplay.prototype.refresh = function() {
    var pixelSize = {x:8, y:8},
        canvas    = this.picture.canvas,
        cache     = ProgressiveDisplay.initCache(canvas.height, canvas.width),
        pass      = 7,
        that      = this,
        animate   = function() {
          if ((pass = that.draw(pixelSize, cache, pass)) > 0) {
            requestAnimationFrame(animate);
          }
        };
    requestAnimationFrame(animate);

    return this;
  };

  /**
   * Cache initialization.
   *
   * @private
   * @param  {number} rows
   * @param  {number} columns
   * @return {array}
   */
  ProgressiveDisplay.initCache = function(rows, columns) {
      var a, i, j, matrix = [];

      for (i = 0; i < rows; i++) {
          a = [];
          for (j = 0; j < columns; j++) {
              a[j] = { computed: false, color: null };
          }
          matrix[i] = a;
      }
      return matrix;
  };

  /**
   * Return a color for a given point.
   *
   * @param  {Point} point
   * @param  {number} pixelSize
   * @param  {array} cache
   * @return {Color}
   */
  ProgressiveDisplay.prototype.getColor = function(point, pixelSize, cache) {
    var x = point.x, y = point.y, color;

    if (y % pixelSize.y === 0) {
      if (x % pixelSize.x === 0) {
        if (!cache[y][x].computed) {
          color = this.coloring.getColor(
            point.toComplex(this.picture.scale, this.picture.center));
          cache[y][x].computed = true;
          cache[y][x].color = color;
        } else {
          color = cache[y][x].color;
        }
      } else {
        color = cache[y][x - (x % pixelSize.x)].color;
        cache[y][x].color = color;
      }
    } else {
      color = cache[y - (y % pixelSize.y)][x].color;
    }
    return color;
  };

  /**
   * Drawing method.
   *
   * @param  {number} pixelSize
   * @param  {array} cache
   * @param  {number} pass
   * @return {number}
   */
  ProgressiveDisplay.prototype.draw = function(pixelSize, cache, pass) {
    var x, y, point, canvas = this.picture.canvas;

    for (y = 0; y < canvas.height; y++) {
      for (x = 0; x < canvas.width; x++) {
        this.picture.setPixel(
          point = new Point(x ,y),
          this.getColor(point, pixelSize, cache));
      }
    }
    this.picture.draw();

    if (pass % 2 !== 0) { pixelSize.x /= 2; }
    if (pass % 2 === 0) { pixelSize.y /= 2; }
    pass -= 1;

    return pass;
  };

  // Declare classes into namespace
  namespace.Picture               = Picture;
  namespace.Point                 = Point;
  namespace.Complex               = Complex;
  namespace.BailoutAlgo           = BailoutAlgo;
  namespace.NewtonAlgo            = NewtonAlgo;
  namespace.SimpleColoring        = SimpleColoring;
  namespace.BinaryColoring        = BinaryColoring;
  namespace.BailoutColoring       = BailoutColoring;
  namespace.SmoothBailoutColoring = SmoothBailoutColoring;
  namespace.AngleColoring         = AngleColoring;
  namespace.MandelbrotEquation    = MandelbrotEquation;
  namespace.MandelCubicEquation   = MandelCubicEquation;
  namespace.MandelQuarticEquation = MandelQuarticEquation;
  namespace.TricornEquation       = TricornEquation;
  namespace.BurningShipEquation   = BurningShipEquation;
  namespace.NewtonEquation        = NewtonEquation;
  namespace.StandardDisplay       = StandardDisplay;
  namespace.ProgressiveDisplay    = ProgressiveDisplay;

}(window.jFractal = window.jFractal || {}));
