import Coloring  from '../coloring/Coloring.js';
import Transform from '../math/Transform.js';
import Complex   from '../math/Complex.js';

let coloring = null;

self.onmessage = function(e) {
  let result    = { row: e.data.row, colors: [] };
  let transform = new Transform(e.data.m);

  if (!coloring) {
    coloring = Coloring.revive(e.data.coloring);
  }
  for (let col = 0; col < e.data.width; col++) {
    let z = transform.transformPoint(col, e.data.row);
    result.colors[col] = coloring.getColor(new Complex(z[0], z[1]));
  }
  postMessage(result);
};
