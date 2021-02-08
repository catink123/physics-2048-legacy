export default class Tile {
  constructor(value, display, posX, posY ) {
    if (posX && posY) this.position = [posX, posY];
    else this.position = [0, 0];
    this.prevPosition = [0, 0];
    this.isNewTile = false;
    this.value = value;
    this.display = display;
  }
}
