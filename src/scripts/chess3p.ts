// 3 player chess board image
const width = 5550;
// midpoint
const center = width/2;
// board colors
const mainColor = "#024200";
const backgroundColor = "white";

const base = 36; // irl length and width of image in inches
const border = 3; // border width in inches surrounding board

const edgeLength = width/((base*16*Math.cos(30*Math.PI/180))/(base-border*2));

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

const lineWidth = edgeLength/50;
const  lineOffset = lineWidth/8;

ctx.strokeStyle = mainColor;
ctx.lineWidth = lineWidth;

const drawOutlineSection = () => {
  ctx.beginPath();
  ctx.moveTo(center + 4*xCalc() - lineWidth/6, center - diamondHeight - lineWidth/2 + lineOffset);
  ctx.lineTo(center + 4*xCalc() + 4*edgeLength - lineOffset, center - diamondHeight - lineWidth/2 + lineOffset);
  ctx.lineTo(4*edgeLength + center + lineWidth/2 - lineOffset, center);
  ctx.lineTo(center + 4*xCalc() + 4*edgeLength - lineOffset, center - diamondHeight - lineWidth/2 + lineOffset);
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

const drawCoordinates = (text: string, xoffset: number, yoffset: number) => {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = mainColor;
  ctx.font = `bold ${edgeLength/3.5}px ${'Roboto Slab'}`;
  ctx.fillText(text, center - diamondHeight + edgeLength/2 + xoffset - (edgeLength/15), center + diamondWidth - yoffset);
}

const rotateAroundCenter = (n: number = 3) => {
  ctx.translate(center, center);
  ctx.rotate(Math.PI/n);
  ctx.translate(-center, -center);
}
// place board
for (let i = 0; i < 3; i++) {
  ctx.drawImage(filledDiamond, center, center - diamondHeight);
  drawOutlineSection();
  rotateAroundCenter();
  ctx.drawImage(emptyDiamond, center, center - diamondHeight);
  drawOutlineSection();
  rotateAroundCenter();
}

const coordData = [
  '8,7,6,5,4,3,2,1',
  'L,K,J,I,D,C,B,A',
  '12,11,10,9,5,6,7,8',
  'H,G,F,E,I,J,K,L',
  '1,2,3,4,9,10,11,12',
  'A,B,C,D,E,F,G,H',
];
// draw font
rotateAroundCenter(6);
for (let i = 0; i < 6; i++) {
  coordData[i].split(',').forEach((char, j) => {
    const k = j < 4 ? j : 7 - j;
    if (!(i%2) && ( +char === 6 || +char === 9 )) {
      drawCoordinates('_', j*yCalc(), k*xCalc() - edgeLength/50);
    }
    drawCoordinates(char, j*yCalc(), k*xCalc());
  });
  rotateAroundCenter();
}

ctx.beginPath();
ctx.arc(center, center, (width * (base - border * 1.1) / base) / 2, 0, 2*Math.PI);
ctx.stroke();

document.body.append(chess3p);