import Algo     from '../algos/Algo.js';
import {Color}  from 'jPalette';

export default class BinaryColoring {
  
  /**
   * Binary coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {Color} positiveColor
   * @param  {Color} negativeColor
   */
  constructor(algorithm, mainColor, positiveColor, negativeColor) {
    this.algorithm = algorithm;
    this.mainColor = mainColor;
    this.positiveColor = positiveColor;
    this.negativeColor = negativeColor;
  }

  /**
   * Return a color for a given complex.
   *
   * @param  {Complex} z
   * @return {Color}
   */
  getColor(z) {
    var bailout = this.algorithm.iterate(z);

    if (bailout.iter == this.algorithm.maxIter) {
      return this.mainColor;
    }
    if (bailout.complex.im > 0) {
      return this.positiveColor;
    }
    return this.negativeColor;
  }

  toJSON() {
    return {
      _type: 'BinaryColoring',
      algorithm: this.algorithm.toJSON(),
      mainColor: this.mainColor.toJSON(),
      positiveColor: this.positiveColor.toJSON(),
      negativeColor: this.negativeColor.toJSON()
    };
  }

  static revive(o) {
    return new BinaryColoring(
      Algo.revive(o.algorithm),
      Color.revive(o.mainColor),
      Color.revive(o.positiveColor),
      Color.revive(o.negativeColor)
    );
  }
}
