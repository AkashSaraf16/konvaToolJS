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

function mouseDownHandler() {
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

async function convertToBase64FileSystem(url) {
  const staticMapUrl = await fetch(url);
  const imgBlob = await staticMapUrl.blob();
  const imgPromise = new Promise((resolve) => {
    const blobReader = new FileReader();
    blobReader.readAsDataURL(imgBlob);
    blobReader.onloadend = () => resolve(blobReader.result);
  });
  return imgPromise;
}

function saveImageHandler() {
  var dataURL = stage.toDataURL({ pixelRatio: 1 });
  const base64url = convertToBase64FileSystem(dataURL);
  base64url.then((val) => console.log(val));
}

document
  .getElementById("save")
  .addEventListener("click", saveImageHandler, false);

stage.on("mousedown", mouseDownHandler);
stage.on("mousemove", mouseMoveHandler);
window.addEventListener("keyup", keyupHander);
