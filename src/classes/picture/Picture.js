import Complex   from '../math/Complex.js';
import Transform from '../math/Transform.js';

export default class Picture {
  /**
   * Picture management class using HTML5 canvas.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Canvas} canvas
   * @param  {Object} parameters
   */
  constructor(canvas, params) {
    this.ctx       = canvas.getContext('2d');
    this.width     = canvas.width;
    this.height    = canvas.height;
    this.imageData = null;
    this.transform = this.getTransform(
      params.left,
      params.right,
      params.bottom,
      params.top,
      params.keepRatio
    );
  }

  /**
   * Image data initialization.
   *
   * @param  {Number} height
   * @return {Picture}
   */
  initImageData(height) {
    this.imageData = this.ctx.createImageData(this.width, height);

    return this;
  }

  /**
   * Define a pixel color.
   *
   * @param  {Point} point
   * @param  {Color} color
   * @return {Picture}
   */
  setPixel(px, py, color) {
    let index = (px + py * this.width) * 4;
    this.imageData.data[index + 0] = color.r;
    this.imageData.data[index + 1] = color.g;
    this.imageData.data[index + 2] = color.b;
    this.imageData.data[index + 3] = color.a;

    return this;
  }

  /**
   * Draw the picture.
   *
   * @param {Number} rowNum
   * @return {Picture}
   */
  draw(rowNum) {
    this.ctx.putImageData(this.imageData, 0, rowNum);

    return this;
  }

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
  getTransform(left, right, bottom, top, keepRatio) {
    let displayAspect, windowAspect, excess;
    let transform = new Transform();

    if (keepRatio) {
      displayAspect = Math.abs(this.height / this.width);
      windowAspect = Math.abs((top - bottom) / (right - left));

      if (displayAspect > windowAspect) {
        // Expand the viewport vertically.
        excess  = (top - bottom) * (displayAspect / windowAspect - 1);
        top    += excess / 2;
        bottom -= excess / 2;
      } else if (displayAspect < windowAspect) {
        // Expand the viewport vertically.
        excess = (right - left) * (windowAspect / displayAspect - 1);
        right += excess / 2;
        left  -= excess / 2;
      }
    }
    transform.scale(this.width / (right - left), this.height / (bottom - top));
    transform.translate(-left, -top);

    return transform;
  }

  /**
   * Invert the current affine transform.
   *
   * @returns {Picture}
   */
  invertTransform() {
    this.invTransform = this.transform.getCopy().invert();

    return this;
  }

  /**
   * Convert viewport point to complex number.
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @returns {Complex}
   */
  getComplex(px, py) {
    let z = this.invTransform.transformPoint(px, py);

    return new Complex(z[0], z[1]);
  }

  /**
   * Window to viewport parameters
   *
   * @param {Object} Parameters: left, right, bottom, top
   * @returns {Picture}
   */
  setParams(params) {
    this.transform = this.getTransform(
      params.left,
      params.right,
      params.bottom,
      params.top,
      params.keepRatio
    );
    return this;
  }

  /**
   * Zooming method.
   *
   * @param  {number} canvas x point
   * @param  {number} canvas y point y
   * @param  {number} factor
   * @return {Picture}
   */
  zoom(px, py, factor) {
    let zc = this.getComplex(px, py);
    let zo = this.getComplex(
      parseInt(this.width / 2),
      parseInt(this.height / 2)
    );

    this.transform.translate(zo.re, zo.im);
    this.transform.scale(factor, factor);
    this.transform.translate(-zc.re, -zc.im);

    return this;
  }
}
