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
  linePoints.push(line);
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
    fixedPosition();
  }
}

function saveImageHandler() {
  const base64IMG = stage.toDataURL();
  console.log(base64IMG);
}

function eraseHandler(e) {
  if (linePoints.length > 0) {
    const currentElement = linePoints.pop();
    currentElement.remove();
    redraw();
  }
}

function redraw() {
  lineLayer.draw();
  markerLayer.draw();
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
  linePoints.push(circle);
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
