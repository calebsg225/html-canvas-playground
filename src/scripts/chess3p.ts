// 3 player chess board image

// simple image manipulation interface:
//      \/ \/ \/ \/ \/
const blackTileColor = "#024200"; // color of 'black' side tiles, coordinates, ring
const whiteTileColor = "white";
const backgroundColor = "#E6E6D9"; // color of 'white' side tiles, background

const ring = true; // add a ring if true
const coordinates = true; // add coordinates if true

const base = 36; // irl length and width of image in inches
const borderWidth = 2.5; // border between outer vertices of board and edge of image square in irl inches
const ringPosition = 1; // distance between edge of image and ring in irl inches

const width = 3200; // image resolution in pixels
//      /\ /\ /\ /\ /\

const center = width/2;
const edgeLength = width/((base*16*Math.cos(30*Math.PI/180))/(base-borderWidth*2));

const chess3p = document.createElement('canvas');
// set canvas size
chess3p.width = width;
chess3p.height = width;

const ctx = chess3p.getContext("2d");
// create background
ctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,width,width);

// helper functions for diagonal distances
const xCalc = () => edgeLength / 2;
const yCalc = () => edgeLength * Math.cos(30*Math.PI/180);

// create canvas elements for tile structure
const createStructureCanvas = (width: number, height: number): { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } => {
  const structure = document.createElement('canvas');
  structure.width = width;
  structure.height = height;
  const ctx = structure.getContext('2d');
  return { canvas: structure, context: ctx };
}

const tileWidth = 4 * (edgeLength + xCalc());
const tileHeight = 4 * yCalc();

const { canvas: blackInnerTileStructure, context: fctx } = createStructureCanvas(tileWidth, tileHeight);
const { canvas: whiteInnerTileStructure, context: ectx } = createStructureCanvas(tileWidth, tileHeight);

const lineWidth = edgeLength/50; // width of board edge and ring
const lineOffset = lineWidth/8; // offset edge from tiles to prevent any gap

// set outline styles
ctx.strokeStyle = blackTileColor;
ctx.lineWidth = lineWidth;

// draw a single tile in a given position
const drawTile = (ctx: CanvasRenderingContext2D, x: number, y: number, tileColor: string) => {
  ctx.fillStyle = tileColor;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + xCalc(), y - yCalc());
  ctx.lineTo(x + xCalc() + edgeLength, y - yCalc());
  ctx.lineTo(x + edgeLength, y);
  ctx.closePath();
  ctx.fill();
}

// populate tile structures (each is one sixth of the board)
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if ((i+j)%2) {
      drawTile(ectx, (i*edgeLength) + (j*xCalc()), tileHeight - j*yCalc(), blackTileColor);
      drawTile(fctx, (i*edgeLength) + (j*xCalc()), tileHeight - j*yCalc(), whiteTileColor);
    } else {
      drawTile(ectx, (i*edgeLength) + (j*xCalc()), tileHeight - j*yCalc(), whiteTileColor);
      drawTile(fctx, (i*edgeLength) + (j*xCalc()), tileHeight - j*yCalc(), blackTileColor);
    }
  }
}

// rotate image to next position in order to place tile structures
const rotateAroundCenter = (n: number = 3) => {
  ctx.translate(center, center);
  ctx.rotate(Math.PI/n);
  ctx.translate(-center, -center);
}

// draws board edges
const drawOutlineSection = () => {
  ctx.beginPath();
  ctx.moveTo(center + 4*xCalc() - lineWidth/6, center - tileHeight - lineWidth/2 + lineOffset);
  ctx.lineTo(center + 4*xCalc() + 4*edgeLength - lineOffset, center - tileHeight - lineWidth/2 + lineOffset);
  ctx.lineTo(4*edgeLength + center + lineWidth/2 - lineOffset, center);
  ctx.lineTo(center + 4*xCalc() + 4*edgeLength - lineOffset, center - tileHeight - lineWidth/2 + lineOffset);
  ctx.closePath();
  ctx.stroke();
}

// place all tile structures to make a full board
for (let i = 0; i < 3; i++) {
  ctx.drawImage(blackInnerTileStructure, center, center - tileHeight);
  drawOutlineSection();
  rotateAroundCenter();
  ctx.drawImage(whiteInnerTileStructure, center, center - tileHeight);
  drawOutlineSection();
  rotateAroundCenter();
}

// places a single coordinate
const drawCoordinate = (text: string, xoffset: number, yoffset: number) => {
  ctx.fillText(text, center - tileHeight + edgeLength/2 + xoffset - (edgeLength/20), center + tileWidth - yoffset);
}

const coordData = [
  '8,7,6,5,4,3,2,1',
  'L,K,J,I,D,C,B,A',
  '12,11,10,9,5,6,7,8',
  'H,G,F,E,I,J,K,L',
  '1,2,3,4,9,10,11,12',
  'A,B,C,D,E,F,G,H',
];

rotateAroundCenter(6); // put image in correct orientation for placing coordinates
// draw all coordinates
if (coordinates) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = blackTileColor;
  ctx.font = `bold ${edgeLength/3.5}px ${'Roboto Slab'}`;
  for (let i = 0; i < 6; i++) {
    coordData[i].split(',').forEach((char, j) => {
      const k = j < 4 ? j : 7 - j;
      if (!(i%2) && ( +char === 6 || +char === 9 )) {
        drawCoordinate('_', j*yCalc(), k*xCalc() - edgeLength/50);
      }
      drawCoordinate(char, j*yCalc(), k*xCalc());
    });
    rotateAroundCenter();
  }
}

// draw ring
if (ring) {
  ctx.beginPath();
  ctx.arc(center, center, (width * (base - ringPosition*2) / base) / 2, 0, 2*Math.PI);
  ctx.stroke();
}

document.body.append(chess3p);