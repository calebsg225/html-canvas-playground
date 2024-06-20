const chess3pCanvas = document.createElement('canvas');
chess3pCanvas.id = "chess-3p-canvas";

const addElements = (elements: HTMLCanvasElement[], destination: any) => {
  for (const element of elements) {
    destination.append(element);
  }
}

addElements([
  chess3pCanvas
], document.body);