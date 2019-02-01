export default class BurningShipEquation {
  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @param  {Complex} c
   * @return {Complex}
   */
  calculate(z, c) {
    return z
      .abs()
      .times(z)
      .minus(c);
  }

  toJSON() {
    return {
      _type: 'BurningShipEquation'
    };
  }
}
