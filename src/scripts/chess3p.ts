const chess3p = document.createElement('canvas');
const ctx = chess3p.getContext("2d");

ctx.fillStyle = "blue";
ctx.fillRect(10, 10, 100, 100);

document.body.append(chess3p);