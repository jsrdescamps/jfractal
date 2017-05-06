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
   * Transform constructor.
   *
   * @param  {array} m Parameters
   */
  var Transform = function(m) {
    if (m) {
        this.m = m;
    } else {
        this.reset();
    }
  };

  /**
   * Return a copy.
   *
   * @return {Transform} [description]
   */
  Transform.prototype.getCopy = function() {
    return new Transform(this.m.slice(0));
  };

  /**
   * Reset parameters.
   *
   * @return {Transform}
   */
  Transform.prototype.reset = function() {
    this.m = [1,0,0,1,0,0];

    return this;
  };

  /**
   * Multiply transforms.
   *
   * @param  {Transform} matrix
   * @return {Transform}
   */
  Transform.prototype.multiply = function(matrix) {
    var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
    var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

    var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
    var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

    var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
    var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    this.m[4] = dx;
    this.m[5] = dy;

    return this;
  };

  /**
   * Invert current transform.
   *
   * @return {Transform}
   */
  Transform.prototype.invert = function() {
    var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
    var m0 = this.m[3] * d;
    var m1 = -this.m[1] * d;
    var m2 = -this.m[2] * d;
    var m3 = this.m[0] * d;
    var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
    var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = m0;
    this.m[1] = m1;
    this.m[2] = m2;
    this.m[3] = m3;
    this.m[4] = m4;
    this.m[5] = m5;

    return this;
  };

  /**
   * Rotation transform.
   *
   * @param  {number} rad
   * @return {Transform}
   */
  Transform.prototype.rotate = function(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var m11 = this.m[0] * c + this.m[2] * s;
    var m12 = this.m[1] * c + this.m[3] * s;
    var m21 = this.m[0] * -s + this.m[2] * c;
    var m22 = this.m[1] * -s + this.m[3] * c;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;

    return this;
  };

  /**
   * Translation transform.
   *
   * @param  {number} x
   * @param  {number} y
   * @return {Transform}
   */
  Transform.prototype.translate = function(x, y) {
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[1] * x + this.m[3] * y;

    return this;
  };

  /**
   * Scalign transform.
   *
   * @param  {number} sx
   * @param  {number} sy
   * @return {Transform}
   */
  Transform.prototype.scale = function(sx, sy) {
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;

    return this;
  };

  /**
   * Transform point with current transform.
   *
   * @param  {number} px
   * @param  {number} py
   * @return {array}
   */
  Transform.prototype.transformPoint = function(px, py) {
    var x = px;
    var y = py;
    px = x * this.m[0] + y * this.m[2] + this.m[4];
    py = x * this.m[1] + y * this.m[3] + this.m[5];

    return [px, py];
  };

  /**
   * Picture management class using HTML5 canvas.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Canvas} canvas
   * @param  {Object} parameters
   */
  var Picture = function(canvas, params) {
   this.ctx       = canvas.getContext('2d');
   this.width     = canvas.width;
   this.height    = canvas.height;
   this.imageData = this.ctx.createImageData(canvas.width, canvas.height);
   this.transform = this.getTransform(
       params.left, params.right, params.bottom, params.top, params.keepRatio
   );
  };

  /**
   * Define a pixel color.
   *
   * @param  {Point} point
   * @param  {Color} color
   * @return {Picture}
   */
  Picture.prototype.setPixel = function(px, py, color) {
   var index = (px + py * this.width) * 4;
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
   * Window to viewport affine transform.
   *
   * @param  {number} left
   * @param  {number} right
   * @param  {number} bottom
   * @param  {number} top
   * @param  {boolean} keepRatio
   * @return {Transform}
   */
  Picture.prototype.getTransform = function(left, right, bottom, top, keepRatio) {
    var displayAspect, windowAspect, excess;
    var transform = new Transform();

    if (keepRatio) {
      displayAspect = Math.abs(this.height / this.width);
      windowAspect = Math.abs((top - bottom) / (right - left));

      if (displayAspect > windowAspect) {
        // Expand the viewport vertically.
        excess = (top - bottom) * (displayAspect / windowAspect - 1);
        top += excess / 2;
        bottom -= excess / 2;
      } else if (displayAspect < windowAspect) {
        // Expand the viewport vertically.
        excess = (right - left) * (windowAspect / displayAspect - 1);
        right += excess / 2;
        left -= excess / 2;
      }
    }
    transform.scale(this.width / (right - left), this.height / (bottom - top));
    transform.translate(-left, -top);

    return transform;
  };

 /**
  * Invert the current affine transform.
  *
  * @returns {Picture}
  */
  Picture.prototype.invertTransform = function() {
    this.invTransform = this.transform.getCopy().invert();

    return this;
  };

 /**
  * Convert viewport point to complex number.
  *
  * @param {number} x coordinate
  * @param {number} y coordinate
  * @returns {Complex}
  */
  Picture.prototype.getComplex = function(px, py) {
    var z;

    if (this.invTransform) {
      z = this.invTransform.transformPoint(px, py);

      return new Complex(z[0], z[1]);
    }
    throw 'Inverted transform not defined';
  };

 /**
  * Window to viewport parameters
  *
  * @param {Object} Parameters: left, right, bottom, top
  * @returns {Picture}
  */
  Picture.prototype.setParams = function(params) {
    this.transform = this.getTransform(
      params.left, params.right, params.bottom, params.top, params.keepRatio
    );
    return this;
  };

 /**
  * Zooming method.
  * @param  {number} canvas x point
  * @param  {number} canvas y point y
  * @param  {number} factor
  * @return {Picture}
  */
  Picture.prototype.zoom = function(px, py, factor) {
    var zc = this.getComplex(px, py);
    var zo = this.getComplex(parseInt(this.width/2), parseInt(this.height/2));

    this.transform.translate(zo.re, zo.im);
    this.transform.scale(factor, factor);
    this.transform.translate(-zc.re, -zc.im);

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
    var x, y;
    this.picture.invertTransform();

    for (y = 0; y < this.picture.height; y++) {
      for (x = 0; x < this.picture.width; x++) {
        this.picture.setPixel(
          x, y, this.coloring.getColor(this.picture.getComplex(x, y))
        );
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
    this.picture.invertTransform();
    var pixelSize = {x:8, y:8},
    cache     = ProgressiveDisplay.initCache(this.picture.height, this.picture.width),
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
  ProgressiveDisplay.prototype.getColor = function(x, y, pixelSize, cache) {
    var color;

    if (y % pixelSize.y === 0) {
      if (x % pixelSize.x === 0) {
        if (!cache[y][x].computed) {
          color = this.coloring.getColor(this.picture.getComplex(x, y));
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
    var x, y;

    for (y = 0; y < this.picture.height; y++) {
      for (x = 0; x < this.picture.width; x++) {
        this.picture.setPixel(
          x, y,
          this.getColor(x, y, pixelSize, cache)
        );
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
