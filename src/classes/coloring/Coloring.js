import SimpleColoring        from './SimpleColoring.js';
import BailoutColoring       from './BailoutColoring.js';
import SmoothBailoutColoring from './SmoothBailoutColoring.js';
import BinaryColoring        from './BinaryColoring.js';
import AngleColoring         from './AngleColoring.js';

export default class Coloring {
  static revive(o) {
    if (o._type == 'SimpleColoring') {
      return SimpleColoring.revive(o);
    } else if (o._type == 'BailoutColoring') {
      return BailoutColoring.revive(o);
    } else if (o._type == 'SmoothBailoutColoring') {
      return SmoothBailoutColoring.revive(o);
    } else if (o._type == 'BinaryColoring') {
      return BinaryColoring.revive(o);
    } else if (o._type == 'AngleColoring') {
      return AngleColoring.revive(o);
    }
    throw 'Coloring revive not implemented !';
  }
}
