let springHeight = 32,
  left,
  right,
  maxHeight = 200,
  minHeight = 100,
  over = false,
  move = false,
  firstBounce = false,
  bounceCount = 0;

let M = 0.8,
  K = 0.2,
  D = 0.92,
  R = 150;

let ps = R,
  vs = 0.0,
  as = 0,
  f = 0;

let circles = [];

function setup() {
  let canvasX = windowWidth / 2 - 300;
  let canvasY = windowHeight / 2 - 350;

  createCanvas(600, 700).position(canvasX, canvasY);
  rectMode(CORNERS);
  noStroke();
  left = width / 2 - 100;
  right = width / 2 + 100;

  for (let i = 0; i < 5; i++) {
    let size = random(10, 30);
    let angle = random(-PI / 4, PI / 4);
    let speed = random(2, 5);
    let x = random(width);
    let y = -size / 2;

    circles.push({ x, y, size, speed });
  }
}

function draw() {
  background('#213D83');

  updateSpring();
  drawSpring();
  if (firstBounce) {
    drawCircles();
  }
}

function drawSpring() {
  fill(0.2);
  let baseWidth = 0.5 * ps + -8;
  rect(width / 2 - baseWidth, ps + springHeight, width / 2 + baseWidth, height);

  if (over || move) {
    fill('#FFD451');
  } else {
    fill('white');
  }

  rect(left, ps, right, ps + springHeight);

  fill('brown');
  quad(
    0,
    height,
    width,
    height,
    (7 * width) / 8,
    height - 380,
    width / 8,
    height - 380
  );
}

function drawCircles() {
  fill('#C5EEFF');
  for (let circle of circles) {
    ellipse(circle.x, circle.y, circle.size, circle.size);
  }
}

function updateSpring() {
  if (!move) {
    f = -K * (ps - R);
    as = f / M;
    vs = D * (vs + as);
    ps = ps + vs;
  }

  if (abs(vs) < 0.1 && !move && firstBounce) {
    vs = 0;

    let size = random(5, 15);
    let angle = random(-PI / 4, PI / 4);
    let speed = random(0.8, 3.8);
    let x = random(width);
    let y = -size / 2;

    circles.push({ x, y, size, speed });
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    circle.y += circle.speed;

    if (
      circle.y - circle.size / 2 > height ||
      circle.x < 0 ||
      circle.x > width
    ) {
      circles.splice(i, 1);
    }
  }

  if (
    mouseX > left &&
    mouseX < right &&
    mouseY > ps &&
    mouseY < ps + springHeight
  ) {
    over = true;
  } else {
    over = false;
  }

  if (move) {
    ps = mouseY - springHeight / 2;
    ps = constrain(ps, minHeight, maxHeight);
  }

  if (!firstBounce && abs(vs) < 0.1 && move) {
    firstBounce = true;
  }
}

function mousePressed() {
  if (over) {
    move = true;
  }
}

function mouseReleased() {
  move = false;
}
