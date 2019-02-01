import Worker from 'worker-loader!./worker.js';

export default class ThreadedDisplay {
  /**
   * Threaded display.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Picture} picture
   * @param  {Coloring} coloring
   */
  constructor(picture, coloring, numWorkers) {
    this.picture    = picture;
    this.coloring   = coloring;
    this.numWorkers = numWorkers;
  }

  /**
   * Refresh display method.
   *
   * @return {ThreadedDisplay} [description]
   */
  refresh() {
    let that = this, linesDone = 0;

    let sendData = function(worker) {
      worker.postMessage({
        row      : linesDone,
        width    : that.picture.width,
        m        : that.picture.invTransform.m,
        coloring : that.coloring.toJSON()
      });
      linesDone++;
    };

    let onMessage = function(e) {
      for (let x = 0; x < e.data.colors.length; x++) {
        that.picture.setPixel(x, 0, e.data.colors[x]);
      }
      that.picture.draw(e.data.row);

      if (linesDone < that.picture.height) {
        sendData(this);
      }
    };
    this.picture.initImageData(1);
    this.picture.invertTransform(); // TODO Improve

    for (let i = 0; i < this.numWorkers; i++) {
      let worker = new Worker();
      worker.onmessage = onMessage;
      sendData(worker);
    }
    return this;
  }
}
