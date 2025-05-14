// 4 player chess board image

import { ChessVariables } from "./types/types";

class Chess4Player {
  private chess4pVariables: ChessVariables;

  private center: number;
  private edgeLength: number;

  private outlineThickness: number;
  private outlineOffset: number;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasId: string, destinationElement: any) {
    this.chess4pVariables = {
      backgroundColor: "#E6E6D9", // color of 'white' side tiles, background

      blackTileColor: "#024200", // color of 'black' side tiles, coordinates, ring
      whiteTileColor: "#E6E6D9",

      hasBackground: true,
      hasRing: false, // add a ring if true
      hasInnerCircle: false, // has a circle inside the ring
      hasCoordinates: true, // add coordinates if true

      ringColor: "#024200",
      coordinateColor: "#024200",
      innerCircleColor: "#E6E6D9", // color of background inside the ring

      baseWidth: 36, // irl length and width of image in inches
      borderWidth: 2.5, // border between outer vertices of board and edge of image square in irl inches

      ringPosition: 1, // distance between edge of image and ring in irl inches

      imageResolution: 5550, // image resolution in pixels
    }

    this.canvas = document.createElement('canvas');
    this.canvas.id = canvasId;
    destinationElement.append(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.buildBoard();
  }

  // generate 4 player chess board
  private buildBoard = () => {
    // man this is wild, can't believe I wrote this shit
    const {
      backgroundColor,
      blackTileColor,
      whiteTileColor,
      hasBackground,
      hasCoordinates,
      coordinateColor,
      baseWidth,
      borderWidth,
      imageResolution
    } = this.chess4pVariables;
    this.canvas.width = imageResolution;
    this.canvas.height = imageResolution;

    this.center = imageResolution / 2;
    this.edgeLength = (baseWidth - borderWidth * 2) / baseWidth * imageResolution / 14;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (hasBackground) this.drawBackground(backgroundColor);

    this.outlineThickness = this.edgeLength / 50;
    this.outlineOffset = this.outlineThickness / 8;

    this.ctx.strokeStyle = blackTileColor;
    this.ctx.lineWidth = this.outlineThickness;

    //populate tiles
    for (let i = 0; i < 14; i++) {
      if (i <= 2 || i >= 11) {
        for (let j = 0; j < 8; j++) {
          const x = this.center - this.edgeLength * 4 + this.edgeLength * j;
          const y = this.center - this.edgeLength * 7 + this.edgeLength * i;
          if ((i + j) % 2) {
            this.drawTile(x, y, blackTileColor, backgroundColor);
          } else {
            this.drawTile(x, y, whiteTileColor, backgroundColor);
          }
        }
      } else {
        for (let j = 0; j < 14; j++) {
          const x = this.center - this.edgeLength * 7 + this.edgeLength * j;
          const y = this.center - this.edgeLength * 7 + this.edgeLength * i;
          if ((i + j) % 2) {
            this.drawTile(x, y, whiteTileColor, backgroundColor);
          } else {
            this.drawTile(x, y, blackTileColor, backgroundColor);
          }
        }
      }

    }

    // draw outline
    this.drawOutline();

    if (hasCoordinates) this.drawCoordinates(coordinateColor);
  };

  private drawBackground = (backgroundColor: string) => {
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // draws outline of chess board
  private drawOutline = () => {
    const sl = this.edgeLength * 4 + this.outlineThickness / 2;
    const ll = this.edgeLength * 7 + this.outlineThickness / 2;
    const msl = this.center - sl; // minus small length
    const psl = this.center + sl; // plus small length
    const mll = this.center - ll; // minus large length
    const pll = this.center + ll; // plus large length
    this.ctx.strokeStyle = this.chess4pVariables.blackTileColor;
    this.ctx.beginPath();
    this.ctx.moveTo(msl, mll);
    this.ctx.lineTo(psl, mll);
    this.ctx.lineTo(psl, msl);
    this.ctx.lineTo(pll, msl);
    this.ctx.lineTo(pll, psl);
    this.ctx.lineTo(psl, psl);
    this.ctx.lineTo(psl, pll);
    this.ctx.lineTo(msl, pll);
    this.ctx.lineTo(msl, psl);
    this.ctx.lineTo(mll, psl);
    this.ctx.lineTo(mll, msl);
    this.ctx.lineTo(msl, msl);
    this.ctx.lineTo(msl, mll);
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
  private drawCoord = (text: string, raised: boolean, xoffset: number): void => {
    const x = this.center - this.edgeLength * 7 + this.edgeLength / 2 + this.edgeLength * xoffset;
    const y = this.center + this.edgeLength * (raised ? 7 : 4) + this.edgeLength / 5 + (text === "_" ? this.edgeLength / 30 : 0);
    this.ctx.fillText(text, x, y);
  }

  // draw all board coordinates
  private drawCoordinates = (coordinateColor: string) => {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = coordinateColor;
    this.ctx.font = `bold ${this.edgeLength / 3.5}px ${'Roboto Slab'}`;
    const lets = 'ABCDEFGHIJKLMN';
    for (let i = 0; i < lets.length; i++) {
      this.drawCoord(lets[i], i > 2 && i < 11, i);
    }
    this.rotateAroundCenter();
    for (let i = 0; i < 14; i++) {
      this.drawCoord(i + 1 + "", i > 2 && i < 11, 13 - i);
      if (i + 1 == 6 || i + 1 == 9) {
        this.drawCoord("_", i > 2 && i < 11, 13 - i);
      }
    }
    this.rotateAroundCenter();
    for (let i = 0; i < lets.length; i++) {
      this.drawCoord(lets[i], i > 2 && i < 11, 13 - i);
    }
    this.rotateAroundCenter();
    for (let i = 0; i < 14; i++) {
      this.drawCoord(i + 1 + "", i > 2 && i < 11, i);
      if (i + 1 == 6 || i + 1 == 9) {
        this.drawCoord("_", i > 2 && i < 11, 13 - i);
      }
    }
    this.rotateAroundCenter();
  }

  // rotate image around center by n degrees
  private rotateAroundCenter = (n: number = 90): void => {
    this.ctx.translate(this.center, this.center);
    this.ctx.rotate(n * Math.PI / 180);
    this.ctx.translate(-this.center, -this.center);
  }

  // update variable data, reset image
  changeChessVariable = (variable: keyof ChessVariables, newValue: string | number | boolean) => {
    const varType = typeof (this.chess4pVariables[variable]);
    if (typeof (newValue) === varType) {
      (this.chess4pVariables[variable] as typeof varType) = newValue as typeof varType;
    }
    this.buildBoard();
  }
}

export default Chess4Player;
