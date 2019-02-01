export default class Transform {
  /**
   * Transform constructor.
   *
   * @param  {array} m Parameters
   */
  constructor(m) {
    if (m) {
      this.m = m.slice(0);
    } else {
      this.reset();
    }
  }

  /**
   * Return a copy.
   *
   * @return {Transform} [description]
   */
  getCopy() {
    return new Transform(this.m);
  }

  /**
   * Reset parameters.
   *
   * @return {Transform}
   */
  reset() {
    this.m = [1, 0, 0, 1, 0, 0];

    return this;
  }

  /**
   * Multiply transforms.
   *
   * @param  {Transform} matrix
   * @return {Transform}
   */
  multiply(matrix) {
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
  }

  /**
   * Invert current transform.
   *
   * @return {Transform}
   */
  invert() {
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
  }

  /**
   * Rotation transform.
   *
   * @param  {number} rad
   * @return {Transform}
   */
  rotate(rad) {
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
  }

  /**
   * Translation transform.
   *
   * @param  {number} x
   * @param  {number} y
   * @return {Transform}
   */
  translate(x, y) {
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[1] * x + this.m[3] * y;

    return this;
  }

  /**
   * Scalign transform.
   *
   * @param  {number} sx
   * @param  {number} sy
   * @return {Transform}
   */
  scale(sx, sy) {
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;

    return this;
  }

  /**
   * Transform point with current transform.
   *
   * @param  {number} px
   * @param  {number} py
   * @return {array}
   */
  transformPoint(px, py) {
    var x = px;
    var y = py;
    px = x * this.m[0] + y * this.m[2] + this.m[4];
    py = x * this.m[1] + y * this.m[3] + this.m[5];

    return [px, py];
  }
}
