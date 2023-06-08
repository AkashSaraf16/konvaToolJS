// import hullPoints from './hull.js';
import { massHullPoints } from './hull.js';
const deleteButton = document.getElementById('delete-button');
let isDelete = false;
deleteButton.addEventListener('click', () => {
  const text = 'Delete Point Disable';
  deleteButton.innerText =
    deleteButton.innerText === text ? 'Delete Point Enable' : text;
  isDelete = !isDelete;
});

const stage = new Konva.Stage({
  container: 'container',
  width: 500,
  height: 500,
});

const lineLayer = new Konva.Layer();
const circleLayer = new Konva.Layer();


stage.add(lineLayer);
stage.add(circleLayer);

function renderHull(hullPoints) {

  let filteredLines = [];
  for (let i = 0; i < hullPoints?.length - 1; i++) {
    const line = new Konva.Line({
      points: [
        hullPoints[i][0],
        hullPoints[i][1],
        hullPoints[i + 1][0],
        hullPoints[i + 1][1],
      ],
      stroke: 'black',
      strokeWidth: 2,
    });

    const circleStart = new Konva.Circle({
      x: hullPoints[i][0],
      y: hullPoints[i][1],
      radius: 4,
      fill: 'red',
      draggable: true,
    });

    line.startCircle = circleStart;

    circleStart.on('mousedown', handleCircleClick);

    circleStart.on('dragmove', handleCircleMove);

    lineLayer.add(line);
    circleLayer.add(circleStart);
  }

  function handleCircleClick(event) {
    const currentCircle = event.target;
    const intersectLines = lineLayer.children.filter((eachLine) => {
      const [x1, y1, x2, y2] = eachLine.points();
      if (
        (x1 === currentCircle.x() && y1 === currentCircle.y()) ||
        (x2 === currentCircle.x() && y2 === currentCircle.y())
      ) {
        return true;
      }
      return false;
    });
    filteredLines = intersectLines;
    if (isDelete) {
      removePoints(filteredLines, currentCircle);
    }
  }

  function handleCircleMove(event) {
    const currentCircle = event.target;
    filteredLines.forEach((eachLine) => {
      if (eachLine.startCircle._id === currentCircle._id) {
        const [, , x2, y2] = eachLine.points();
        eachLine.points([currentCircle.x(), currentCircle.y(), x2, y2]);
      } else {
        eachLine.points([
          eachLine.startCircle.x(),
          eachLine.startCircle.y(),
          currentCircle.x(),
          currentCircle.y(),
        ]);
      }
    });
    lineLayer.batchDraw();
  }
}

function removePoints(filteredLines, currentCircle) {
  let startPoints = null;
  let endPoints = null;
  let lineCircle = null;
  filteredLines.forEach((eachLine) => {
    if (eachLine.startCircle._id === currentCircle._id) {
      endPoints = eachLine.points().slice(2);
      eachLine.remove();
    } else {
      startPoints = eachLine.points().slice(0, 2);
      lineCircle = eachLine.startCircle;
      eachLine.remove();
    }
  });
  const newLine = new Konva.Line({
    points: [...startPoints, ...endPoints],
    stroke: 'black',
    strokeWidth: 2,
  });
  newLine.startCircle = lineCircle;
  currentCircle.remove();
  lineLayer.add(newLine);
  lineLayer.batchDraw();
  console.log(lineLayer.children)

}

massHullPoints.slice(0,1).forEach((eachHullPoints) => {
  renderHull(eachHullPoints);
});
renderHull();