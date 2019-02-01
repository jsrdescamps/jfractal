import NewtonEquation        from './NewtonEquation.js';
import MandelbrotEquation    from './MandelbrotEquation.js';
import MandelCubicEquation   from './MandelCubicEquation.js';
import MandelQuarticEquation from './MandelQuarticEquation.js';
import BurningShipEquation   from './BurningShipEquation.js';
import TricornEquation       from './TricornEquation.js';

export default class Equation {
  static revive(o) {
    if (o._type == 'NewtonEquation') {
      return new NewtonEquation();
    } else if (o._type == 'MandelbrotEquation') {
      return new MandelbrotEquation();
    } else if (o._type == 'MandelCubicEquation') {
      return new MandelCubicEquation();
    } else if (o._type == 'MandelQuarticEquation') {
      return new MandelQuarticEquation();
    } else if (o._type == 'TricornEquation') {
      return new TricornEquation();
    } else if (o._type == 'BurningShipEquation') {
      return new BurningShipEquation();
    }
    throw 'Equation revive not implemented !';
  }
}
