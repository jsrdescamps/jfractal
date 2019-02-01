export default class StandardDisplay {
  /**
   * Standard display.
   *
   * @constructor
   * @memberof jFractal
   * @param  {Picture} picture
   * @param  {Coloring} coloring
   */
  constructor(picture, coloring) {
    this.picture  = picture;
    this.coloring = coloring;
  }

  /**
   * Refresh display method.
   *
   * @return {StandardDisplay} [description]
   */
  refresh() {
    this.picture.initImageData(this.picture.height);
    this.picture.invertTransform();

    for (let y = 0; y < this.picture.height; y++) {
      for (let x = 0; x < this.picture.width; x++) {
        this.picture.setPixel(
          x,
          y,
          this.coloring.getColor(this.picture.getComplex(x, y))
        );
      }
    }
    this.picture.draw(0);

    return this;
  }
}
