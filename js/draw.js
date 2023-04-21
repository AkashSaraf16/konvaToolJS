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

// add all layers here
stage.add(imgLayer);
stage.add(lineLayer);

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

function mouseDownHandler() {
    const pos = stage.getPointerPosition();
    startPoint = pos;
  }

function mouseMoveHandler() {
  if (startPoint) {
    const pos = stage.getPointerPosition();
    if (line) {
      line.points([startPoint.x, startPoint.y, pos.x, pos.y]);
    } else {
      line = new Konva.Line({
        points: [startPoint.x, startPoint.y, pos.x, pos.y],
        stroke: 'yellow',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round',
      });
      lineLayer.add(line);
    }
    lineLayer.draw();
  }
}

function mouseUpHandler() {
  line = null;
  startPoint = null;
}

stage.on('mousedown', mouseDownHandler);
stage.on('mousemove', mouseMoveHandler);
stage.on('mouseup', mouseUpHandler);
