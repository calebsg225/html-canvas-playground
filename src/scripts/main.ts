import Chess3PLayer from "./chess3p.js";
import Chess4Player from "./chess4p.js";

const i = new Chess4Player(`4pchess`, document.body);
i.changeChessVariable('imageResolution', 2000);

const j = new Chess3PLayer(`3pchess`, document.body);
j.changeChessVariable('imageResolution', 1000);