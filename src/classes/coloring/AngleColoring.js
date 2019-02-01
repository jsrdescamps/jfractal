import Algo       from '../algos/Algo.js';
import {Color}    from 'jPalette';
import {ColorMap} from 'jPalette';

export default class AngleColoring {
  
  /**
   * Complex angle coloring.
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
    return this.palette.getColor(
      // TODO check range for atan2, make a function
      (Math.atan2(bailout.complex.im, bailout.complex.re) + Math.PI) /
        (2 * Math.PI)
    );
  }

  toJSON() {
    return {
      _type: 'AngleColoring',
      algorithm: this.algorithm.toJSON(),
      mainColor: this.mainColor.toJSON(),
      palette: this.palette.toJSON()
    };
  }

  static revive(o) {
    return new AngleColoring(
      Algo.revive(o.algorithm),
      Color.revive(o.mainColor),
      ColorMap.revive(o.palette)
    );
  }
}
