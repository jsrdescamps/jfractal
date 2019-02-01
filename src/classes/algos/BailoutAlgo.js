import Complex  from '../math/Complex.js';
import Equation from '../equations/Equation.js';

export default class BailoutAlgo {
  /**
   * Bailout fractal algorithm.
   *
   * @constructor
   * @param  {Equation} equation
   * @param  {number} maxIter
   * @param  {number} radius
   * @param  {Complex} c
   */
  constructor(equation, maxIter, radius, c) {
    this.equation = equation;
    this.radius   = radius;
    this.maxIter  = maxIter;
    this.c        = c || null;
  }

  toJSON() {
    return {
      _type   : 'BailoutAlgo',
      equation: this.equation.toJSON(),
      maxIter : this.maxIter,
      radius  : this.radius,
      c       : this.c ? this.c.toJSON(): null
    };
  }

  static revive(o) {
    return new BailoutAlgo(
      Equation.revive(o.equation),
      o.maxIter,
      o.radius,
      o.c ? Complex.revive(o.c) : null
    );
  }

  /**
   * Iteration method.
   *
   * @param  {Complex} z
   * @return {Object}
   */
  iterate(z) {
    var iter = 0,
      c = this.c || new Complex(z.re, z.im);
    if (!this.c) {
      z.re = 0;
      z.im = 0;
    }

    while (z.getSquare() <= this.radius && iter < this.maxIter) {
      this.equation.calculate(z, c);
      iter++;
    }
    return {
      iter   : iter,
      complex: z
    }; // TODO to object with constructor ?
  }
}
