let springHeight = 32,
  left,
  right,
  maxHeight = 200,
  minHeight = 100,
  over = false,
  move = false,
  firstBounce = false,
  bounceCount = 0;

// 용수철 시뮬레이션 상수들
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
  // 캔버스를 중앙에 위치시키기 위한 변수
  let canvasX = windowWidth / 2 - 300; // 캔버스의 x 좌표
  let canvasY = windowHeight / 2 - 350; // 캔버스의 y 좌표

  // 캔버스 생성 및 위치 설정
  createCanvas(600, 700).position(canvasX, canvasY);
  rectMode(CORNERS);
  noStroke();
  left = width / 2 - 100;
  right = width / 2 + 100;

  // 눈을 화면 위쪽 밖에 생성
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
  // 바탕 그리기
  fill(0.2);
  let baseWidth = 0.5 * ps + -8;
  rect(width / 2 - baseWidth, ps + springHeight, width / 2 + baseWidth, height);

  // 상단 막대기의 색상 설정하고 그리기
  if (over || move) {
    fill('#FFD451');
  } else {
    fill('white');
  }

  rect(left, ps, right, ps + springHeight);

  // 지붕 그리기
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

// 눈 그리기
function drawCircles() {
  fill('#C5EEFF');
  for (let circle of circles) {
    ellipse(circle.x, circle.y, circle.size, circle.size);
  }
}

function updateSpring() {
  // 용수철(spring) 위치 업데이트
  if (!move) {
    f = -K * (ps - R);
    as = f / M;
    vs = D * (vs + as);
    ps = ps + vs;
  }

  // 튕기는 눈 생성 조건 추가
  if (abs(vs) < 0.1 && !move && firstBounce) {
    vs = 0; // 튕길 때의 속도를 0으로 설정

    // 눈 추가
    let size = random(5, 15);
    let angle = random(-PI / 4, PI / 4);
    let speed = random(0.8, 3.8);
    let x = random(width);
    let y = -size / 2;

    circles.push({ x, y, size, speed });
  }

  // 눈의 위치 업데이트 및 화면 바깥으로 나갔을 때 제거
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    circle.y += circle.speed;

    // 화면 바깥으로 나가면 배열에서 제거
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
