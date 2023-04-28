const saveButton = document.getElementById('save');
const eraseButton = document.getElementById('erase');
const addMarker = document.getElementById('add-marker');
// will be dynamic temporary for testing
const width = window.innerWidth / 2;
const height = window.innerHeight / 2;
const imgSRC = './img/map.jpg';

const stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
});

// create layers here
const imgLayer = new Konva.Layer();
const lineLayer = new Konva.Layer();
const markerLayer = new Konva.Layer();

// add all layers here
stage.add(imgLayer);
stage.add(lineLayer);
stage.add(markerLayer);

function createLine(startPoint, pos) {
  const line = new Konva.Line({
    points: [startPoint.x, startPoint.y, pos.x, pos.y],
    stroke: 'yellow',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  });
  lineLayer.add(line);
  return line;
}

function loadImg() {
  const img = new Konva.Image({
    x: 0,
    y: 0,
    image: imageObj,
    width: width,
    height: height,
  });
  imgLayer.add(img);
  imgLayer.draw();
}

const imageObj = new Image();
imageObj.src = imgSRC;
imageObj.onload = loadImg;

// drawing line
let startPoint;
let line;
let lineDraw = true;
let linePoints = [];
const linesPoints = [];

function mouseDownHandler() {
  if (lineDraw === false) {
    fixedPosition();
    addMarkup();
    return;
  }
  if (startPoint) {
    fixedPosition();
  }
  const pos = stage.getPointerPosition();
  startPoint = pos;
  linePoints.push(startPoint.x, startPoint.y);
}

function mouseMoveHandler() {
  if (startPoint) {
    const pos = stage.getPointerPosition();
    if (line) {
      line.points([startPoint.x, startPoint.y, pos.x, pos.y]);
    } else {
      line = createLine(startPoint, pos);
    }
    lineLayer.draw();
  }
}

function fixedPosition() {
  line = null;
  startPoint = null;
}

function keyupHander(event) {
  var name = event.key;
  if (name === 'Control') {
    return;
  }
  if ((event.ctrlKey && name === 'Z') || (event.ctrlKey && name === 'z')) {
    if (line) {
      line.remove();
    }
    if (linePoints.length > 0) {
      linesPoints.push(linePoints);
      linePoints = [];
    }
    fixedPosition();
  }
}

function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function saveImageHandler() {
  const base64IMG = stage.toDataURL();
  console.log(base64IMG);
}

function eraseHandler(e) {
  if (linesPoints.length > 0) {
    let lastLine = linesPoints[linesPoints.length - 1];
    if (lastLine.length >= 2) {
      lastLine.pop();
      lastLine.pop();
      if (lastLine.length === 0) linesPoints.pop();
    } else {
      if (lastLine.length === 1) {
        lastLine.pop();
        linesPoints.pop();
        lastLine = linesPoints[linesPoints.length - 1];
        lastLine.pop();
      } else {
        linesPoints.pop();
        lastLine = linesPoints[linesPoints.length - 1];
        lastLine.pop();
        lastLine.pop();
      }
    }
    redraw();
  }
}

function redraw() {
  lineLayer.removeChildren();
  for (let i = 0; i < linesPoints.length; i++) {
    line = new Konva.Line({
      points: [...linesPoints[i]],
      stroke: 'yellow',
      strokeWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    });
    lineLayer.add(line);
    fixedPosition();
  }
  lineLayer.draw();
}

function addMarkup() {
  const pos = stage.getPointerPosition();
  const circle = new Konva.Circle({
    x: pos.x,
    y: pos.y,
    radius: 5,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 1,
  });
  markerLayer.add(circle);
  markerLayer.draw();
}

saveButton.addEventListener('click', saveImageHandler, false);
eraseButton.addEventListener('click', eraseHandler, false);
addMarker.addEventListener('click', () => {
  line?.remove();
  addMarker.innerText = lineDraw ? 'enable marker' : 'enable line draw';
  lineDraw = !lineDraw;
});
stage.on('mousedown', mouseDownHandler);
stage.on('mousemove', mouseMoveHandler);
window.addEventListener('keyup', keyupHander);
