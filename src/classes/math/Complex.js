export default class Complex {
  /**
   * @constructor
   * @param  {number} re - Real part
   * @param  {number} im - Imaginary part
   */
  constructor(re, im) {
    this.re = re || 0;
    this.im = im || 0;
  }

  toJSON() {
    return {
      _type: 'Complex',
      re: this.re,
      im: this.im
    };
  }

  static revive(o) {
    return new Complex(o.re, o.im);
  }

  /**
   * Add a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  plus(z) {
    this.re += z.re;
    this.im += z.im;

    return this;
  }

  /**
   * Soustract a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  minus(z) {
    this.re -= z.re;
    this.im -= z.im;

    return this;
  }

  /**
   * Multiply a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  times(z) {
    let tmp = this.re * z.re - this.im * z.im;
    this.im = this.re * z.im + this.im * z.re;
    this.re = tmp;

    return this;
  }

  /**
   * Divide a complex number to this object.
   *
   * @param  {Complex} z - A complex number
   * @return {Complex} - This object
   */
  div(z) {
    let div = z.re * z.re + z.im * z.im;
    let tmp = (this.re * z.re + this.im * z.im) / div;
    this.im = (this.im * z.re - this.re * z.im) / div;
    this.re = tmp;

    return this;
  }

  /**
   * Conjugate complex of this object.
   *
   * @return {Complex} - This object
   */
  conj() {
    this.im = -this.im;

    return this;
  }

  /**
   * Absolute complex of this object.
   *
   * @return {Complex} - This object
   */
  abs() {
    this.re = Math.abs(this.re);
    this.im = Math.abs(this.im);

    return this;
  }

  /**
   * Return the squared module.
   *
   * @return {number} - Squared module
   */
  getSquare() {
    return this.re * this.re + this.im * this.im;
  }

  /**
   * Return the module.
   *
   * @return {number} - Module
   */
  getModule() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  /**
   * Clone the complex.
   *
   * @return {Complex} - Cloned object
   */
  getCopy() {
    return new Complex(this.re, this.im);
  }

  /**
   * Return the "symetric" complex.
   *
   * @return {Complex} - Symetric object
   */
  getSym() {
    return new Complex(-this.re, -this.im);
  }
}
