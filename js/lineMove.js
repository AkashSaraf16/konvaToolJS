import hullPoints from './hull.js';

const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});

const lineLayer = new Konva.Layer();
const circleLayer = new Konva.Layer();

stage.add(lineLayer);
stage.add(circleLayer);

const lines = [];
let filteredLines = [];

for (let i = 0; i < hullPoints.length - 1; i++) {
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

  lines.push(line);

  lineLayer.add(line);
  circleLayer.add(circleStart);
}

function handleCircleClick(event) {
  const intersectLines = lines.filter((eachLine) => {
    const currentCircle = event.target;
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
