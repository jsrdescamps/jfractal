import Algo     from '../algos/Algo.js';
import {Color}  from 'jPalette';

export default class SimpleColoring {

  /**
   * Simple bicolor coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {Color} bailoutColor
   */
  constructor(algorithm, mainColor, bailoutColor) {
    this.algorithm    = algorithm;
    this.mainColor    = mainColor;
    this.bailoutColor = bailoutColor;
  }

  /**
   * Return a color for a given complex.
   *
   * @param  {Complex} z
   * @return {Color}
   */
  getColor(z) {
    let bailout = this.algorithm.iterate(z);

    if (bailout.iter == this.algorithm.maxIter) {
      return this.mainColor;
    }
    return this.bailoutColor;
  }

  toJSON() {
    return {
      _type        : 'SimpleColoring',
      algorithm    : this.algorithm.toJSON(),
      mainColor    : this.mainColor.toJSON(),
      bailoutColor : this.bailoutColor.toJSON()
    };
  }

  static revive(o) {
    return new SimpleColoring(
      Algo .revive(o.algorithm),
      Color.revive(o.mainColor),
      Color.revive(o.bailoutColor)
    );
  }
}
