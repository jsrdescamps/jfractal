import Algo       from '../algos/Algo.js';
import {Color}    from 'jPalette';
import {ColorMap} from 'jPalette';

export default class BailoutColoring {

  /**
   * Simple bailout coloring.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Algorithm} algorithm
   * @param  {Color} mainColor
   * @param  {ColorMap} palette
   */
  constructor(algorithm, mainColor, palette) {
    this.algorithm = algorithm;
    this.mainColor = mainColor;
    this.palette   = palette;
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
    return this.palette.getColor(bailout.iter / this.algorithm.maxIter);
  }

  toJSON() {
    return {
      _type     : 'BailoutColoring',
      algorithm : this.algorithm.toJSON(),
      mainColor : this.mainColor.toJSON(),
      palette   : this.palette.toJSON()
    };
  }

  static revive(o) {
    return new BailoutColoring(
      Algo    .revive(o.algorithm),
      Color   .revive(o.mainColor),
      ColorMap.revive(o.palette)
    );
  }
}
