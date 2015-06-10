/**
 * Small library to generate 2D fractals
 *
 * @version 0.3.0
 * @author Julien Descamps
 * @todo Documentation
 * @todo Add default parameters
 * @todo Add progressive display
 * @todo Add field lines
 * @todo Add interactive parameters into demo (setters/getters)
 * @todo Manage exceptions
 * @todo Use Web Workers
 */
var Fractal2D = (function() {

  /************************
   * Complex number class *
   ************************/

  var Complex = function(a, b) {
    this.a = a || 0;
    this.b = b || 0;
  };

  Complex.prototype.mod2 = function() {
    return this.a * this.a + this.b * this.b;
  };

  Complex.prototype.mod = function() {
    return Math.sqrt(this.a * this.a + this.b * this.b);
  };

  /*********************
   * 2D position class *
   *********************/

  var Position = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  /**
   * @todo use callback ?
   */
  Position.prototype.zoom = function(position, factor) {
    this.x = position.x * (1 - factor) + this.x * factor;
    this.y = position.y * (1 - factor) + this.y * factor;
  };

  /**
   * @todo use callback ?
   */
  Position.prototype.translate = function(origin, position) {
    this.x -= (position.x - origin.x);
    this.y -= (position.y - origin.y);
  };

  /**
   * @todo use callback ?
   */
  Position.prototype.toComplex = function(factor, position) {
    return new Complex(
      factor.x * (this.x - position.x),
      factor.y * (this.y - position.y)
    );
  };

  /**************************
   * Image management class *
   **************************/

  /**
   * @todo Do it with Position class ?
   */
  ImageData.prototype.setPixel = function(x, y, color) {
    var index = (x + y * this.width) * 4;
    this.data[index + 0] = color.r;
    this.data[index + 1] = color.g;
    this.data[index + 2] = color.b;
    this.data[index + 3] = color.a;
  };

  var Image = function(canvasId) {
    this.canvas    = document.getElementById(canvasId);
    this.ctx       = this.canvas.getContext("2d");
    this.width     = this.canvas.width;
    this.height    = this.canvas.height;
    this.imageData = this.ctx.createImageData(this.width, this.height);
  };

  Image.prototype.setPixel = function(x, y, color) {
    this.imageData.setPixel(x, y, color);
  };

  Image.prototype.draw = function() {
    this.ctx.putImageData(this.imageData, 0, 0);
  };

  Image.prototype.getCursorPosition = function(e) {
    var position = new Position();

    if (e.pageX !== undefined && e.pageY !== undefined) {
      position.x = e.pageX;
      position.y = e.pageY;
    } else {
      position.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      position.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    position.x -= this.canvas.offsetLeft;
    position.y -= this.canvas.offsetTop;

    return position;
  };

  /********************************
   * Fractal algorithm interfaces *
   ********************************/

  var JuliaAlgo = function(maxIter, smoothing, c) {
    this.maxIter      = maxIter;
    this.smoothing    = smoothing;
    this.isMandelbrot = c === undefined;
    this.c            = c;
  };

  JuliaAlgo.prototype.iterate = function(z) {
    var iter = 0, tmp = 0, frac = 0, bailout = 4;

    if (this.isMandelbrot) {
      this.c = new Complex(z.a, z.b);
    }
    if (this.smoothing) {
      bailout = 1 << 16;
    }
    while (z.mod2() <= bailout && iter < this.maxIter) {
      tmp = z.a * z.a - z.b * z.b + this.c.a;
      z.b = 2 * z.a * z.b + this.c.b;
      z.a = tmp;
      iter++;
    }
    if (this.smoothing) {
      frac = 1 - Math.log(Math.log(z.mod())/Math.log(2))/Math.log(2);
    }
    return {
      floorValue  : iter,
      smoothValue : iter + frac
    };
  };

  /*********************************
   * Main Fractal generation class *
   *********************************/
  /**
   * @todo Manage defaults
   */
  var Fractal = function(image, mainColor, colorMap, algorithm) {
    this.image       = image;
    this.mainColor   = mainColor;
    this.colorMap    = colorMap;
    this.algorithm   = algorithm;
    this.origin      = new Position(this.image.width / 2, this.image.height / 2);
    this.position    = new Position(this.origin.x, this.origin.y);
    this.zoomFactor  = 2;
    this.range       = { a: 3, b: 3};
    this.scaleFactor = {
      x: this.range.a / this.image.width,
      y: this.range.b / this.image.height
    };
  };

  Fractal.prototype.setZoomFactor = function(zoomFactor) {
    this.zoomFactor = zoomFactor;

    return this;
  };

  Fractal.prototype.setRange = function(range) {
    this.range = range;

    return this;
  };

  Fractal.prototype.getZoom = function() {
    return this.range.a / (this.image.width * this.scaleFactor.x);
  };

  Fractal.prototype.getPosition = function() {
    return this.position;
  };

  Fractal.prototype.getComplex = function() {
    return this.position.toComplex(this.scaleFactor, this.origin);
  };

  /**
   *
   */
  Fractal.prototype.draw = function() {
    var x, y;

    for (y = 0; y < this.image.height; y++) {
      for (x = 0; x < this.image.width; x++) {
        bailIter = this.algorithm.iterate(
          new Position(x, y).toComplex(this.scaleFactor, this.position)
        );
        if (bailIter.floorValue == this.algorithm.maxIter) {
          this.image.setPixel(x, y, this.mainColor);
        } else {
          color = this.colorMap.getColor(bailIter.smoothValue / this.algorithm.maxIter);
          this.image.setPixel(x, y, color);
        }
      }
    }
    this.image.draw();
  };

  Fractal.prototype.zoom = function(position) {
    this.scaleFactor.x /= this.zoomFactor;
    this.scaleFactor.y /= this.zoomFactor;
    this.position.zoom(this.origin, this.zoomFactor);

    return this;
  };

  Fractal.prototype.translate = function(position) {
    this.position.translate(this.origin, position);

    return this;
  };

  return {
    Fractal   : Fractal,
    Position  : Position,
    Complex   : Complex,
    Image     : Image,
    JuliaAlgo : JuliaAlgo,
  };
}());
