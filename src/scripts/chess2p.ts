// 2 player chess board image

import { ChessVariables } from './types/types';

class Chess2Player {
  private chess2pVars: ChessVariables;
  private center: number;
  private edgeLength: number;
  private outlineThickness: number;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  constructor(canvasId: string, destinationElement: any) {
    this.chess2pVars = {
      backgroundColor: "#E6E6D9",
      blackTileColor: "#024200",
      whiteTileColor: "#E6E6D9",
      hasBackground: true,
      hasRing: false,
      hasInnerCircle: false,
      hasCoordinates: true,
      ringColor: "#024200",
      coordinateColor: "#024200",
      innerCircleColor: "#E6E6D9",
      baseWidth: 23,
      borderWidth: 2,
      ringPosition: 1,
      imageResolution: 5550,
    }

    this.canvas = document.createElement('canvas');
    this.canvas.id = canvasId;
    destinationElement.append(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.buildBoard();
  }

  private buildBoard = () => {
    this.canvas.width = this.chess2pVars.imageResolution;
    this.canvas.height = this.chess2pVars.imageResolution;

    this.center = this.chess2pVars.imageResolution / 2;
    this.edgeLength =
      (this.chess2pVars.baseWidth - this.chess2pVars.borderWidth * 2)
      / this.chess2pVars.baseWidth * this.chess2pVars.imageResolution
      / 8;
    // clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);

    if (this.chess2pVars.hasBackground) this.drawBackground(this.chess2pVars.backgroundColor);

    this.outlineThickness = this.edgeLength / 40;

    this.ctx.strokeStyle = this.chess2pVars.blackTileColor;
    this.ctx.lineWidth = this.outlineThickness;

    // populate tiles
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const x = this.center - this.edgeLength * 4 + this.edgeLength * j;
        const y = this.center - this.edgeLength * 4 + this.edgeLength * i;
        if ((i + j) & 1) {
          this.drawTile(x, y, this.chess2pVars.blackTileColor, this.chess2pVars.backgroundColor);
        } else {
          this.drawTile(x, y, this.chess2pVars.whiteTileColor, this.chess2pVars.backgroundColor);
        }
      }
    }

    // draw outline
    this.drawOutline();

    if (this.chess2pVars.hasCoordinates) this.drawCoordinates(this.chess2pVars.coordinateColor);
  }

  private drawBackground = (backgroundColor: string) => {
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // draws outline of chess board
  private drawOutline = () => {
    const l = this.edgeLength * 4 + this.outlineThickness / 3.5;
    const ml = this.center - l; // minus length
    const pl = this.center + l; // plus length
    this.ctx.strokeStyle = this.chess2pVars.blackTileColor;
    this.ctx.beginPath();
    this.ctx.moveTo(ml, ml);
    this.ctx.lineTo(pl, ml);
    this.ctx.lineTo(pl, pl);
    this.ctx.lineTo(ml, pl);
    this.ctx.lineTo(ml, ml);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawTile = (x: number, y: number, tileColor: string, backgroundColor: string) => {
    if (tileColor === backgroundColor) return;
    this.ctx.fillStyle = tileColor;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + this.edgeLength, y);
    this.ctx.lineTo(x + this.edgeLength, y + this.edgeLength);
    this.ctx.lineTo(x, y + this.edgeLength);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // draws a single coordinate
  private drawCoord = (text: string, offset: number, hz: boolean = false): void => {
    const x = this.center - this.edgeLength * 4 + this.edgeLength / 2 - this.edgeLength / 1.4 * +!hz + this.edgeLength * (offset * +hz);
    const y = this.center + this.edgeLength * 4 - this.edgeLength / 2 + this.edgeLength / 1.4 * +hz + this.edgeLength * (offset * +!hz) + (text === "_" ? this.edgeLength / 40 : 0);
    this.ctx.fillText(text, x, y);
  }

  // draw all board coordinates
  private drawCoordinates = (coordinateColor: string) => {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = coordinateColor;
    this.ctx.font = `bold ${this.edgeLength / 3.5}px ${'Roboto Slab'}`;
    const lets = 'ABCDEFGH';
    for (let i = 0; i < lets.length; i++) {
      this.drawCoord(lets[i], i, true);
    }
    for (let i = 0; i < 8; i++) {
      this.drawCoord(7 - i + 1 + "", i - 7);
      if (7 - i + 1 == 6) {
        this.drawCoord("_", i - 7);
      }
    }
    this.rotateAroundCenter();
    for (let i = 0; i < lets.length; i++) {
      this.drawCoord(lets[i], 7 - i, true);
    }
    for (let i = 0; i < 8; i++) {
      this.drawCoord(i + 1 + "", i - 7);
      if (i + 1 == 6) {
        this.drawCoord("_", i - 7);
      }
    }
    this.rotateAroundCenter();
  }

  // rotate image around center by n degrees
  private rotateAroundCenter = (n: number = 180): void => {
    this.ctx.translate(this.center, this.center);
    this.ctx.rotate(n * Math.PI / 180);
    this.ctx.translate(-this.center, -this.center);
  }

  // update variable data, reset image
  changeChessVariable = (variable: keyof ChessVariables, newValue: string | number | boolean) => {
    const varType = typeof (this.chess2pVars[variable]);
    if (typeof (newValue) === varType) {
      (this.chess2pVars[variable] as typeof varType) = newValue as typeof varType;
    }
    this.buildBoard();
  }
}

export default Chess2Player;
