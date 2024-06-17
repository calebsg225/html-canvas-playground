// 3 player chess board image
const width = 8192;
// midpoint
const center = width/2;
// board colors
const mainColor = "#004d00";
const backgroundColor = "gray";

const edgeLength = width/16;

const chess3p = document.createElement('canvas');

// set canvas size
chess3p.width = width;
chess3p.height = width;

const ctx = chess3p.getContext("2d");

// create background
ctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,width,width);

const xCalc = () => edgeLength / 2;
const yCalc = () => edgeLength * Math.cos(30*Math.PI/180);

const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

const lineWidth = 10;

ctx.strokeStyle = mainColor;
ctx.lineWidth = lineWidth;

const drawOutlineSection = () => {
  ctx.beginPath();
  ctx.moveTo(center + 4*xCalc(), center - diamondHeight - lineWidth/2);
  ctx.lineTo(center + 4*xCalc() + 4*edgeLength, center - diamondHeight - lineWidth/2);
  ctx.lineTo(4*edgeLength + center + lineWidth/2, center);
  ctx.lineTo(center + 4*xCalc() + 4*edgeLength, center - diamondHeight - lineWidth/2);
  ctx.closePath();
  ctx.stroke();
}

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if ((i+j)%2) {
      drawDiamond(ectx, (i*edgeLength) + (j*xCalc()), diamondHeight - j*yCalc());
    } else {
      drawDiamond(fctx, (i*edgeLength) + (j*xCalc()), diamondHeight - j*yCalc());
    }
  }
}

const rotateAroundCenter = () => {
  ctx.translate(center, center);
  ctx.rotate(Math.PI/3);
  ctx.translate(-center, -center);
}
for (let i = 0; i < 3; i++) {
  ctx.drawImage(filledDiamond, center, center - diamondHeight);
  drawOutlineSection();
  rotateAroundCenter();
  ctx.drawImage(emptyDiamond, center, center - diamondHeight);
  drawOutlineSection();
  rotateAroundCenter();
}

document.body.append(chess3p);