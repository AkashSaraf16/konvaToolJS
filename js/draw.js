const saveButton = document.getElementById("save");
const eraseButton = document.getElementById("erase");
// will be dynamic temporary for testing
const width = window.innerWidth / 2;
const height = window.innerHeight / 2;
const imgSRC = "./img/map.jpg";

const stage = new Konva.Stage({
  container: "container",
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
const linePoints = [];

function mouseDownHandler() {
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
      line = new Konva.Line({
        points: [startPoint.x, startPoint.y, pos.x, pos.y],
        stroke: "yellow",
        strokeWidth: 2,
        lineCap: "round",
        lineJoin: "round",
      });
      lineLayer.add(line);
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
  if (name === "Control") {
    return;
  }
  if ((event.ctrlKey && name === "Z") || name === "z") {
    fixedPosition();
  }
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
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
  if (linePoints.length > 0) {
    linePoints.pop();
    linePoints.pop();
    // lineLayer.clear();             // TODO: check why this is not working
    lineLayer.removeChildren();
    line = new Konva.Line({
      points: [...linePoints],
      stroke: "yellow",
      strokeWidth: 2,
      lineCap: "round",
      lineJoin: "round",
    });
    lineLayer.add(line);
    lineLayer.draw();
  }
}

saveButton.addEventListener("click", saveImageHandler, false);
eraseButton.addEventListener("click", eraseHandler, false);
stage.on("mousedown", mouseDownHandler);
stage.on("mousemove", mouseMoveHandler);
window.addEventListener("keyup", keyupHander);
