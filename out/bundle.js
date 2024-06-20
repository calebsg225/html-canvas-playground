define("types/types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
// 3 player chess board image
define("chess3p", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Chess3PLayer {
        constructor(canvasId, destination) {
            // generates 3 player chess board
            this.buildBoard = () => {
                const { backgroundColor, blackTileColor, whiteTileColor, hasBackground, hasRing, hasCoordinates, ringColor, coordinateColor, circleInRingColor, baseWidth, borderWidth, ringPosition, imageResolution, ringThickness } = this.chess3pVariables;
                this.canvas.width = imageResolution;
                this.canvas.height = imageResolution;
                this.center = imageResolution / 2;
                this.edgeLength = imageResolution / ((baseWidth * 16 * Math.cos(30 * Math.PI / 180)) / (baseWidth - borderWidth * 2));
                this.tileWidth = 4 * (this.edgeLength + this.xCalc());
                this.tileHeight = 4 * this.yCalc();
                // clear the canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
                if (hasBackground)
                    this.drawBackground(backgroundColor, imageResolution);
                if (hasRing)
                    this.drawRing(ringColor, circleInRingColor, imageResolution, ringPosition, ringThickness, baseWidth);
                const { canvas: blackInnerTileStructure, context: fctx } = this.createStructureCanvas(this.tileWidth, this.tileHeight);
                const { canvas: whiteInnerTileStructure, context: ectx } = this.createStructureCanvas(this.tileWidth, this.tileHeight);
                this.outlineThickness = this.edgeLength / 50; // width of board edge and ring
                this.outlineOffset = this.outlineThickness / 8; // offset edge from tiles to prevent any gap
                // set outline styles
                this.ctx.strokeStyle = blackTileColor;
                this.ctx.lineWidth = this.outlineThickness;
                // populate tile structures (each is one sixth of the board)
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        const x = (i * this.edgeLength) + (j * this.xCalc());
                        const y = this.tileHeight - j * this.yCalc();
                        if ((i + j) % 2) {
                            this.drawTile(ectx, x, y, whiteTileColor, backgroundColor);
                            this.drawTile(fctx, x, y, blackTileColor, backgroundColor);
                        }
                        else {
                            this.drawTile(ectx, x, y, blackTileColor, backgroundColor);
                            this.drawTile(fctx, x, y, whiteTileColor, backgroundColor);
                        }
                    }
                }
                for (let i = 0; i < 3; i++) {
                    this.ctx.drawImage(blackInnerTileStructure, this.center, this.center - this.tileHeight);
                    this.drawOutlineSection();
                    this.rotateAroundCenter();
                    this.ctx.drawImage(whiteInnerTileStructure, this.center, this.center - this.tileHeight);
                    this.drawOutlineSection();
                    this.rotateAroundCenter();
                }
                if (hasCoordinates)
                    this.drawAllCoordinates(coordinateColor);
            };
            // helper functions for diagonal distances
            this.xCalc = () => this.edgeLength / 2;
            this.yCalc = () => this.edgeLength * Math.cos(30 * Math.PI / 180);
            // create canvas elements for tile structure
            this.createStructureCanvas = (width, height) => {
                const structure = document.createElement('canvas');
                structure.width = width;
                structure.height = height;
                const ctx = structure.getContext('2d');
                return { canvas: structure, context: ctx };
            };
            // draw a single tile in a given position
            this.drawTile = (ctx, x, y, tileColor, backgroundColor) => {
                if (tileColor === backgroundColor)
                    return;
                ctx.fillStyle = tileColor;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + this.xCalc(), y - this.yCalc());
                ctx.lineTo(x + this.xCalc() + this.edgeLength, y - this.yCalc());
                ctx.lineTo(x + this.edgeLength, y);
                ctx.closePath();
                ctx.fill();
            };
            this.drawRing = (ringColor, circleInRingColor, imageResolution, ringPosition, ringThickness, baseWidth) => {
                this.ctx.save();
                this.ctx.strokeStyle = ringColor;
                this.ctx.fillStyle = circleInRingColor;
                this.ctx.lineWidth = ringThickness;
                this.ctx.beginPath();
                this.ctx.arc(this.center, this.center, (imageResolution * (baseWidth - ringPosition * 2) / baseWidth) / 2, 0, 2 * Math.PI);
                this.ctx.closePath();
                if (this.ctx.fillStyle !== this.ctx.strokeStyle)
                    this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
            };
            this.drawBackground = (backgroundColor, imageResolution) => {
                this.ctx.fillStyle = backgroundColor;
                this.ctx.fillRect(0, 0, imageResolution, imageResolution);
            };
            // rotate image to next position in order to place tile structures
            this.rotateAroundCenter = (n = 60) => {
                this.ctx.translate(this.center, this.center);
                this.ctx.rotate(n * Math.PI / 180);
                this.ctx.translate(-this.center, -this.center);
            };
            // draws 1/6 of the board outline
            this.drawOutlineSection = () => {
                this.ctx.beginPath();
                this.ctx.moveTo(this.center + 4 * this.xCalc() - this.outlineThickness / 6, this.center - this.tileHeight - this.outlineThickness / 2 + this.outlineOffset);
                this.ctx.lineTo(this.center + 4 * this.xCalc() + 4 * this.edgeLength - this.outlineOffset, this.center - this.tileHeight - this.outlineThickness / 2 + this.outlineOffset);
                this.ctx.lineTo(4 * this.edgeLength + this.center + this.outlineThickness / 2 - this.outlineOffset, this.center);
                this.ctx.lineTo(this.center + 4 * this.xCalc() + 4 * this.edgeLength - this.outlineOffset, this.center - this.tileHeight - this.outlineThickness / 2 + this.outlineOffset);
                this.ctx.closePath();
                this.ctx.stroke();
            };
            // update variable data, reset image
            this.changeChessVariable = (variable, newValue) => {
                const varType = typeof (this.chess3pVariables[variable]);
                if (typeof (newValue) === varType) {
                    this.chess3pVariables[variable] = newValue;
                }
                this.buildBoard();
            };
            // place a single coordinate
            this.drawCoordinateCharacter = (text, xoffset, yoffset) => {
                this.ctx.fillText(text, this.center - this.tileHeight + this.edgeLength / 2 + xoffset - (this.edgeLength / 20), this.center + this.tileWidth - yoffset);
            };
            this.drawAllCoordinates = (coordinateColor) => {
                this.rotateAroundCenter(210);
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillStyle = coordinateColor;
                this.ctx.font = `bold ${this.edgeLength / 3.5}px ${'Roboto Slab'}`;
                for (let i = 0; i < 6; i++) {
                    this.coordinateData[i].split(',').forEach((char, j) => {
                        const k = j < 4 ? j : 7 - j;
                        if (!(i % 2) && (+char === 6 || +char === 9)) {
                            this.drawCoordinateCharacter('_', j * this.yCalc(), k * this.xCalc() - this.edgeLength / 50);
                        }
                        this.drawCoordinateCharacter(char, j * this.yCalc(), k * this.xCalc());
                    });
                    this.rotateAroundCenter();
                }
            };
            this.chess3pVariables = {
                backgroundColor: "#E6E6D9", // color of 'white' side tiles, background
                blackTileColor: "#024200", // color of 'black' side tiles, coordinates, ring
                whiteTileColor: this.chess3pVariables.backgroundColor,
                hasBackground: true,
                hasRing: true, // add a ring if true
                hasCoordinates: true, // add coordinates if true
                ringColor: this.chess3pVariables.blackTileColor,
                coordinateColor: this.chess3pVariables.blackTileColor,
                circleInRingColor: this.chess3pVariables.backgroundColor, // color of background inside the ring
                baseWidth: 36, // irl length and width of image in inches
                borderWidth: 2.5, // border between outer vertices of board and edge of image square in irl inches
                ringPosition: 1, // distance between edge of image and ring in irl inches
                imageResolution: 5550, // image resolution in pixels
                ringThickness: this.chess3pVariables.imageResolution / 600, // thickness of outer ring in pixels
            };
            this.coordinateData = [
                '8,7,6,5,4,3,2,1',
                'L,K,J,I,D,C,B,A',
                '12,11,10,9,5,6,7,8',
                'H,G,F,E,I,J,K,L',
                '1,2,3,4,9,10,11,12',
                'A,B,C,D,E,F,G,H',
            ];
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            destination.append(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.buildBoard();
        }
    }
    exports.default = Chess3PLayer;
});
// 4 player chess board image
// create empty canvas elements on html
// create 3 player chess canvas
const chess3pCanvas = document.createElement('canvas');
chess3pCanvas.id = "chess-3p-canvas";
// create 4-player chess canvas
const chess4pCanvas = document.createElement('canvas');
chess4pCanvas.id = "chess-4p-canvas";
const addElements = (elements, destination) => {
    for (const element of elements) {
        destination.append(element);
    }
};
// add all canvas elements to document in order
addElements([
    chess4pCanvas,
    chess3pCanvas,
], document.body);
define("main", ["require", "exports", "chess3p"], function (require, exports, chess3p_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chess3p = new chess3p_1.default('chess-3player-canvas', document.body);
});
//# sourceMappingURL=bundle.js.map