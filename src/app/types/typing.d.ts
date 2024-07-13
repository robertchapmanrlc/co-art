type Draw = {
  context: CanvasRenderingContext2D;
  currentPoint: Point;
  previousPoint: Point | null;
};

type Point = {
  x: number;
  y: number;
};

type DrawLine = {
  previousPoint: Point | null;
  currentPoint: Point;
  color: string;
}

type DrawLineProps = Draw & {
  color: string;
};