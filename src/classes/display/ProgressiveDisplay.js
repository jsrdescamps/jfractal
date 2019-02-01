export default class ProgressiveDisplay {
  /**
   * Progressive display (adam7).
   *
   * @constructor
   * @param  {Picture} picture
   * @param  {Coloring} coloring
   */
  constructor(picture, coloring) {
    this.picture  = picture;
    this.coloring = coloring;
  }

  /**
   * Refresh display method.
   *
   * @return {ProgressiveDisplay} [description]
   */
  refresh() {
    this.picture.invertTransform();
    this.picture.initImageData(this.picture.height);

    let pixelSize = {
        x: 8,
        y: 8
      },
      cache = ProgressiveDisplay.initCache(
        this.picture.height,
        this.picture.width
      ),
      pass = 7,
      that = this,
      animate = function() {
        if ((pass = that.draw(pixelSize, cache, pass)) > 0) {
          requestAnimationFrame(animate);
        }
      };
    requestAnimationFrame(animate);

    return this;
  }

  /**
   * Cache initialization.
   *
   * @private
   * @param  {number} rows
   * @param  {number} columns
   * @return {array}
   */
  static initCache(rows, columns) {
    let a, i, j, matrix = [];

    for (i = 0; i < rows; i++) {
      a = [];
      for (j = 0; j < columns; j++) {
        a[j] = {
          computed: false,
          color   : null
        };
      }
      matrix[i] = a;
    }
    return matrix;
  }

  /**
   * Return a color for a given point.
   *
   * @param  {Point} point
   * @param  {number} pixelSize
   * @param  {array} cache
   * @return {Color}
   */
  getColor(x, y, pixelSize, cache) {
    let color;

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
  }

  /**
   * Drawing method.
   *
   * @param  {number} pixelSize
   * @param  {array} cache
   * @param  {number} pass
   * @return {number}
   */
  draw(pixelSize, cache, pass) {
    for (let y = 0; y < this.picture.height; y++) {
      for (let x = 0; x < this.picture.width; x++) {
        this.picture.setPixel(x, y, this.getColor(x, y, pixelSize, cache));
      }
    }
    this.picture.draw(0);

    if (pass % 2 !== 0) {
      pixelSize.x /= 2;
    }
    if (pass % 2 === 0) {
      pixelSize.y /= 2;
    }
    pass -= 1;

    return pass;
  }
}
