type Draw = {
  context: CanvasRenderingContext2D;
  currentPoint: Point;
  previousPoint: Point | null;
};

type Point = {
  x: number;
  y: number;
};
