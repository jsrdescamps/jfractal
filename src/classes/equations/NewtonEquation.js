export default class NewtonEquation {
  /**
   * Equation definition method.
   *
   * @param  {Complex} z
   * @return {Complex}
   */
  calculate(z) {
    // TODO Respect API ?!
    var zo = z.getCopy();
    z.times(z).times(zo).re -= 1;

    return z;
  }

  toJSON() {
    return {
      _type: 'NewtonEquation'
    };
  }
}
