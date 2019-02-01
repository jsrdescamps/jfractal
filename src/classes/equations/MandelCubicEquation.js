export default class MandelCubicEquation {
  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  calculate(z, c) {
    let zo = z.getCopy();
    return z
      .times(z)
      .times(zo)
      .plus(c);
  }

  toJSON() {
    return {
      _type: 'MandelCubicEquation'
    };
  }
}
