import BailoutAlgo from './BailoutAlgo.js';
import NewtonAlgo  from './NewtonAlgo.js';

export default class Algo {
  static revive(o) {
    if (o._type == 'BailoutAlgo') {
      return BailoutAlgo.revive(o);
    } else if (o._type == 'NewtonAlgo') {
      return NewtonAlgo.revive(o);
    }
    throw 'Algo revive not implemented !';
  }
}
