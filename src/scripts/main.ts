import Chess3PLayer from "./chess3p.js";

for (let i = 0; i < 10; i++) {
  const j = new Chess3PLayer(`3pchess${i}`, document.body);
  j.changeChessVariable('imageResolution', 1000);
}