import Chess2Player from "./chess2p.js";
import Chess3PLayer from "./chess3p.js";
import Chess4Player from "./chess4p.js";

const i = new Chess2Player(`2pchess`, document.body);
i.changeChessVariable('imageResolution', 1024);

const j = new Chess3PLayer(`3pchess`, document.body);
j.changeChessVariable('imageResolution', 1024);

const k = new Chess4Player(`4pchess`, document.body);
k.changeChessVariable('imageResolution', 1024);
