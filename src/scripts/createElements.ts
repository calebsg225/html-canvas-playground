// create empty canvas elements on html

// create 3 player chess canvas
const chess3pCanvas = document.createElement('canvas');
chess3pCanvas.id = "chess-3p-canvas";

// create 4-player chess canvas
const chess4pCanvas = document.createElement('canvas');
chess4pCanvas.id = "chess-4p-canvas";

const addElements = (elements: HTMLCanvasElement[], destination: any) => {
  for (const element of elements) {
    destination.append(element);
  }
}

// add all canvas elements to document in order
addElements([
  chess4pCanvas,
  chess3pCanvas,
], document.body);