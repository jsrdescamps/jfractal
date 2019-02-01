import Complex  from '../math/Complex.js';
import Equation from '../equations/Equation.js';

export default class NewtonAlgo {
  /**
   * Newton fractal algorithm.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Equation} equation
   * @param  {number} maxIter
   * @param  {number} epsilon
   */
  constructor(equation, maxIter, epsilon) {
    this.equation = equation;
    this.maxIter  = maxIter;
    this.epsilon  = epsilon;
  }

  toJSON() {
    return {
      _type   : 'NewtonAlgo',
      equation: this.equation.toJSON(),
      maxIter : this.maxIter,
      epsilon : this.epsilon
    };
  }

  static revive(o) {
    return new NewtonAlgo(Equation.revive(o.equation), o.maxIter, o.epsilon);
  }

  /**
   * Derivative method.
   *
   * @param  {Complex} z
   * @param  {Complex} dz
   * @param  {function} routine
   * @return {Complex}
   */
  derivative(z, dz, routine) {
    var zo = z.getCopy(); // [f(z + dz) - f(z)] / dz
    return routine(z.plus(dz))
      .minus(routine(zo))
      .div(dz);
  }

  /**
   * Iteration method.
   *
   * @param  {Complex} z
   * @return {Object}
   */
  iterate(z) {
    var iter = 0,
      dz = new Complex(1e-6, 1e-6),
      zo;

    do {
      zo = z.getCopy().minus(
        z.minus(
          // z - [f(z) / f'(z)]
          this.equation
            .calculate(z.getCopy())
            .div(this.derivative(z.getCopy(), dz, this.equation.calculate))
        )
      );
      iter++;
    } while (zo.getSquare() > this.epsilon && iter < this.maxIter);

    return {
      iter: iter,
      complex: zo
    };
  }
}
