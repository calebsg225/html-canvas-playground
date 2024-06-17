// 3 player chess board image
const width = 4096;
// midpoint
const center = width/2;
// board colors
const mainColor = "#004d00";
const backgroundColor = "gray";

const edgeLength = width/20;

const chess3p = document.createElement('canvas');

// set canvas size
chess3p.width = width;
chess3p.height = width;

const ctx = chess3p.getContext("2d");

// create background
ctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,4096,4096);

const xCalc = () => edgeLength / 2;
const yCalc = () => edgeLength * Math.cos(30*Math.PI/180);

const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.strokeStyle = mainColor;
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + xCalc(), y - yCalc());
  ctx.lineTo(x + xCalc() + edgeLength, y - yCalc());
  ctx.lineTo(x + edgeLength, y);
  ctx.closePath();
  ctx.fill();
}

const filledDiamond = document.createElement('canvas');
const emptyDiamond = document.createElement('canvas');
const diamondWidth = 4 * (edgeLength + xCalc());
const diamondHeight = 4 * yCalc();
filledDiamond.width = diamondWidth;
filledDiamond.height = diamondHeight;
emptyDiamond.width = diamondWidth;
emptyDiamond.height = diamondHeight;

const fctx = filledDiamond.getContext('2d');
const ectx = emptyDiamond.getContext('2d');

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if ((i+j)%2) {
      console.log(i, j);
      drawDiamond(ectx, (i*edgeLength) + (j*xCalc()), diamondHeight - j*yCalc());
    } else {
      drawDiamond(fctx, (i*edgeLength) + (j*xCalc()), diamondHeight - j*yCalc());
    }
  }
}

document.body.append(chess3p);