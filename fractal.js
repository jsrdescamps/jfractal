/**
 * Small library to generate 2D fractals
 *
 * @version 0.1.0
 * @author Julien Descamps
 * @todo Documentation
 * @todo Add smooth iteration option
 * @todo Add default parameters
 * @todo Add interactive parameters into demo (setters/getters)
 * @todo Add Mandelbrot
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

  Complex.prototype.mod2 = function(complex) {
    return this.a * this.a + this.b * this.b;
  };

  /*********************
   * 2D position class *
   *********************/

  var Position = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  Position.prototype.zoom = function(position, factor) {
    this.x = position.x * (1 - factor) + this.x * factor;
    this.y = position.y * (1 - factor) + this.y * factor;
  };

  Position.prototype.translate = function(origin, position) {
    this.x -= (position.x - origin.x);
    this.y -= (position.y - origin.y);
  };

  /**************************
   * Image management class *
   **************************/

  ImageData.prototype.setPixel = function(x, y, color) {
    var index = (x + y * this.width) * 4;
    this.data[index + 0] = color.r;
    this.data[index + 1] = color.g;
    this.data[index + 2] = color.b;
    this.data[index + 3] = color.a;
  };

  var Image = function(canvasId) {
    this.canvas = document.getElementById(canvasId);

    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
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

  Image.prototype.addClickListener = function(callback) {
    this.canvas.addEventListener("click", callback, false);
  };

  /*********************************
   * Main Fractal generation class *
   *********************************/

  var Fractal = function(seed, maxIter, image, mainColor, colorMap) {
    this.seed = seed;
    this.maxIter = maxIter;
    this.image = image;
    this.mainColor = mainColor;
    this.colorMap = colorMap;

    this.centerPos = new Position(this.image.width / 2, this.image.height / 2);
    this.translatedPos = new Position(this.centerPos.x, this.centerPos.y);

    this.zoomFactor = 1.5;
    this.scaleFactor = 3 / this.image.width;

    var that = this;
    this.image.addClickListener(
      function(e) {
        that.draw(new Position(
          that.image.getCursorPosition(e).x,
          that.image.getCursorPosition(e).y), true);
      }
    );
  };

  Fractal.prototype.draw = function(toCenterPos, zoomEnabled) {
    var z = new Complex();

    if (!toCenterPos) {
      toCenterPos = this.centerPos;
    }
    this.translatedPos.translate(this.centerPos, toCenterPos);

    if (zoomEnabled) {
      this.scaleFactor /= this.zoomFactor;
      this.translatedPos.zoom(this.centerPos, this.zoomFactor);
    }
    for (var y = 0; y < this.image.height; y++) {
      for (var x = 0; x < this.image.width; x++) {
        var iter = 0;

        z.a = this.scaleFactor * (x - this.translatedPos.x);
        z.b = this.scaleFactor * (y - this.translatedPos.y);

        while (z.mod2() <= 4 && iter < this.maxIter) {
          var tmp = z.a * z.a - z.b * z.b + this.seed.a;
          z.b = 2 * z.a * z.b + this.seed.b;
          z.a = tmp;
          iter++;
        }
        if (iter == this.maxIter) {
          this.image.setPixel(x, y, this.mainColor);
        } else {
          color = this.colorMap.getColor(iter / this.maxIter);
          this.image.setPixel(x, y, color);
        }
      }
    }
    this.image.draw();
  };

  return {
    Fractal: Fractal,
    Complex : Complex,
    Image: Image
  };
}());
