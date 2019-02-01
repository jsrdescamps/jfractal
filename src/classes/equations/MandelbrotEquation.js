export default class MandelbrotEquation {
  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  calculate(z, c) {
    return z.times(z).plus(c);
  }

  toJSON() {
    return {
      _type: 'MandelbrotEquation'
    };
  }
}
