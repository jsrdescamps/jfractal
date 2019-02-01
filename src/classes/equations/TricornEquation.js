export default class TricornEquation {
  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  calculate(z, c) {
    return z
      .conj()
      .times(z)
      .plus(c);
  }

  toJSON() {
    return {
      _type: 'TricornEquation'
    };
  }
}
