import * as jPalette from 'jpalette';
import * as jFractal from 'jfractal';

let canvas = document.getElementById('fractal');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let
  view       = document.getElementById('view'),
  threads    = document.getElementById('threads'),
  equation   = document.getElementById('equation'),
  coloring   = document.getElementById('coloring'),
  palette    = document.getElementById('palette'),
  julia      = document.getElementById('julia'),
  iterations = document.getElementById('iterations'),
  // Namespaces shortcuts
  f = jFractal,
  p = jPalette,
  // Colors
  black = p.Color.get('black')(255),
  white = p.Color.get('white')(255),
  // Palettes
  night       = p.ColorMap.get('night')(2000),
  rainbow     = p.ColorMap.get('rainbow')(2000),
  fire        = p.ColorMap.get('fire')(2000),
  sky         = p.ColorMap.get('sky')(2000),
  blacknwhite = p.ColorMap.get('blacknwhite')(2000),
  // Equations
  mandelbrotEquation    = new f.MandelbrotEquation(),
  mandelCubicEquation   = new f.MandelCubicEquation(),
  mandelQuarticEquation = new f.MandelQuarticEquation(),
  tricornEquation       = new f.TricornEquation(),
  burningEquation       = new f.BurningShipEquation(),
  newtonEquation        = new f.NewtonEquation(),
  // Algorithms
  bailoutAlgo = new f.BailoutAlgo(mandelbrotEquation, 50, 4),
  newtonAlgo  = new f.NewtonAlgo (newtonEquation,     50, 0.001),
  // Colorings
  simpleColoring        = new f.SimpleColoring       (bailoutAlgo, black, white),
  bailoutColoring       = new f.BailoutColoring      (bailoutAlgo, black, night),
  smoothBailoutColoring = new f.SmoothBailoutColoring(bailoutAlgo, black, night),
  angleColoring         = new f.AngleColoring        (bailoutAlgo, black, night),
  binaryColoring        = new f.BinaryColoring       (bailoutAlgo, black, white, black),
  // Some fractal window ranges
  zeroParams = {
    left     : -1.5,
    right    : 1.5,
    bottom   : -1.5,
    top      : 1.5,
    keepRatio: true
  },
  mandelParams = {
    left     : -2.5,
    right    : 0.5,
    bottom   : -1.5,
    top      : 1.5,
    keepRatio: true
  },
  burningParams = {
    left     : -1,
    right    : 2,
    bottom   : -1,
    top      : 2,
    keepRatio: true
  },
  // Picture
  picture  = new f.Picture(canvas, mandelParams),
  // Display
  threadedDisplay    = new f.ThreadedDisplay   (picture, bailoutColoring, 1),
  progressiveDisplay = new f.ProgressiveDisplay(picture, bailoutColoring),
  standardDisplay    = new f.StandardDisplay   (picture, bailoutColoring),
  // By default
  display = standardDisplay,
  // Julia sets
  c1 = new f.Complex(0.285,     0.01),
  c2 = new f.Complex(-0.11,     0.6557),
  c3 = new f.Complex(-0.8,      0.156),
  c4 = new f.Complex(-0.835,   -0.2321),
  c5 = new f.Complex(-0.70176, -0.3842),
  c6 = new f.Complex(0,         1);
  
/********** Functions **********/

let getCursorPosition = function (e) {
  let _x, _y;

  if (e.pageX !== undefined && e.pageY !== undefined) {
    _x = e.pageX;
    _y = e.pageY;
  } else {
    _x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    _y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  _x -= canvas.offsetLeft;
  _y -= canvas.offsetTop;

  return [_x, _y];
};

let setZoom = function (e) {
  p = getCursorPosition(e);
  display.picture.zoom(p[0], p[1], 2);
  display.refresh();
};

let setEquation = function (e) {
  let _algorithm, _equation, _params;
  let _juliaP = 'p-julia';
  let _smbOption  = {
    index: 1,
    value: 'smoothbailout',
    text: 'Smooth Bailout'
  };

  switch (e.target.value) {
    default     : 
    case 'mandelbrot': 
      _algorithm = bailoutAlgo;
      _equation  = mandelbrotEquation;
      _params    = mandelParams;
      enableBlock(_juliaP);
      enableOption(coloring, _smbOption);
      break;
    case 'mandelcubic': 
      _algorithm = bailoutAlgo;
      _equation  = mandelCubicEquation;
      _params    = zeroParams;
      disableBlock(_juliaP);
      enableOption(coloring, _smbOption);
      break;
    case 'mandelquartic': 
      _algorithm = bailoutAlgo;
      _equation  = mandelQuarticEquation;
      _params    = zeroParams;
      disableBlock(_juliaP);
      enableOption(coloring, _smbOption);
      break;
    case 'tricorn': 
      _algorithm = bailoutAlgo;
      _equation  = tricornEquation;
      _params    = zeroParams;
      disableBlock(_juliaP);
      enableOption(coloring, _smbOption);
      break;
    case 'burning': 
      _algorithm = bailoutAlgo;
      _equation  = burningEquation;
      _params    = burningParams;
      disableBlock(_juliaP);
      enableOption(coloring, _smbOption);
      break;
    case 'newton': 
      _algorithm = newtonAlgo;
      _equation  = newtonEquation;
      _params    = zeroParams;
      disableBlock(_juliaP);
      disableOption(coloring, _smbOption);
      break;
  }
  display.coloring.algorithm          = _algorithm;
  display.coloring.algorithm.equation = _equation;
  display.coloring.algorithm.c        = undefined;
  display.coloring.algorithm.maxIter  = 50;
  iterations.selectedIndex = 0;
  // TODO init values on top
  display.picture.setParams(_params);
  display.refresh();
};

let setView = function (e) {
  let _threadsP = 'p-threads',
      _coloring = display.coloring; // Backup old param

  switch (e.target.value) {
    default: 
    case 'standard':
      display = standardDisplay;
      disableBlock(_threadsP);
      break;
    case 'progressive':
      display = progressiveDisplay;
      disableBlock(_threadsP);
      break;
    case 'threaded':
      display = threadedDisplay;
      enableBlock(_threadsP);
      break;
  }
  display.coloring = _coloring;
  display.refresh();
};

let setThreads = function (e) {
  display.numWorkers = threads.value;
  display.refresh();
};

let setColoring = function (e) {
  let _radius, _coloring;
  let _paletteP = 'p-palette';
  let _newtonOption = {
    index: 3,
    value: 'newton',
    text: 'Newton'
  };
  switch (e.target.value) {
    default:
    case 'bailout':
      // TODO init values on top
      _radius = 4;
      _coloring = bailoutColoring;
      enableOption(equation, _newtonOption);
      enableBlock(_paletteP);
      break;
    case 'smoothbailout':
      _radius = 1 << 16;
      _coloring = smoothBailoutColoring;
      disableOption(equation, _newtonOption);
      enableBlock(_paletteP);
      break;
    case 'binary':
      _radius = 1 << 16;
      _coloring = binaryColoring;
      enableOption(equation, _newtonOption);
      disableBlock(_paletteP);
      break;
    case 'angle':
      _radius = 4;
      _coloring = angleColoring;
      enableOption(equation, _newtonOption);
      enableBlock(_paletteP);
      break;
    case 'simple':
      _radius = 4;
      _coloring = simpleColoring;
      enableOption(equation, _newtonOption);
      disableBlock(_paletteP);
      break;
  }
  // Saving old coloring params in new coloring
  _coloring.algorithm = display.coloring.algorithm;
  _coloring.palette   = display.coloring.palette;
  // Affecting new coloring
  display.coloring = _coloring;
  display.coloring.algorithm.radius = _radius;
  display.refresh();
};

let setPalette = function (e) {
  let _palette;
  switch (e.target.value) {
    default:
    case 'night':
      _palette = night;
      break;
    case 'rainbow':
      _palette = rainbow;
      break;
    case 'fire':
      _palette = fire;
      break;
    case 'sky':
      _palette = sky;
      break;
    case 'blacknwhite':
      _palette = blacknwhite;
      break;
  }
  display.coloring.palette = _palette;
  display.refresh();
};

let setJulia = function (e) {
  let _c;
  switch (e.target.value) {
    default:
    case '':
      _c = undefined;
      break;
    case 'set1':
      _c = c1;
      break;
    case 'set2':
      _c = c2;
      break;
    case 'set3':
      _c = c3;
      break;
    case 'set4':
      _c = c4;
      break;
    case 'set5':
      _c = c5;
      break;
    case 'set6':
      _c = c6;
      break;
  }
  display.coloring.algorithm.c = _c;
  display.picture.setParams(zeroParams)
  display.refresh();
};

let setIterations = function (e) {
  display.coloring.algorithm.maxIter = iterations.value;
  display.refresh();
};

/****** Listener functions *******/

let disableBlock = function (element) {
  document.getElementById(element).style.display = 'none';
};

let enableBlock = function (element) {
  document.getElementById(element).style.display = 'block';
};

let disableOption = function (element, params) {
  if (element.options[params.index] &&
    element.options[params.index].value == params.value) {
    element.options.remove(params.index);
  }
};

let enableOption = function (element, params) {
  let _option;
  if ((!element.options[params.index]) ||
    element.options[params.index].value != params.value) {
    _option       = document.createElement("option");
    _option.text  = params.text;
    _option.value = params.value;
    element.options.add(_option, params.index);
  }
};

/********* Main code *********/

disableBlock('p-threads');
display.refresh();

canvas    .addEventListener('click',  setZoom,       false);
view      .addEventListener('change', setView,       false);
threads   .addEventListener('change', setThreads,    false);
equation  .addEventListener('change', setEquation,   false);
coloring  .addEventListener('change', setColoring,   false);
palette   .addEventListener('change', setPalette,    false);
julia     .addEventListener('change', setJulia,      false);
iterations.addEventListener('change', setIterations, false);