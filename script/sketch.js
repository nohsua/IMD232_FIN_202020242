let springHeight = 32,
  left,
  right,
  maxHeight = 200,
  minHeight = 100,
  over = false,
  move = false,
  firstBounce = false,
  bounceCount = 0; // 첫 번째 튕김 여부

// 용수철 시뮬레이션 상수들
let M = 0.8, // Mass(질량)
  K = 0.2, // 용수철(spring) 상수
  D = 0.92, // Damping(감쇠)
  R = 150; // Rest Position(놓인 위치)

// 용수철 시뮬레이션 변수들
let ps = R, // 위치
  vs = 0.0, // 속도
  as = 0, // 가속도
  f = 0; // 힘

// 추가: 튕기는 원 배열
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

  // 추가: 초기에 원을 화면 위쪽 밖에 생성
  for (let i = 0; i < 5; i++) {
    let size = random(10, 30);
    let angle = random(-PI / 4, PI / 4); // 무작위 각도 (-45도에서 45도 사이)
    let speed = random(2, 5); // 무작위 속도
    let x = random(width);
    let y = -size / 2; // 화면 위쪽 밖에 위치

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

  // 사다리꼴 모양의 지붕 그리기
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

// 추가: 튕기는 원 그리기 함수
function drawCircles() {
  fill('#C5EEFF');
  for (let circle of circles) {
    ellipse(circle.x, circle.y, circle.size, circle.size);
  }
}

function updateSpring() {
  // 용수철(spring) 위치 업데이트
  if (!move) {
    f = -K * (ps - R); // f=-ky
    as = f / M; // 가속도 설정, f=ma == a=f/m
    vs = D * (vs + as); // 속도 설정
    ps = ps + vs; // 업데이트된 위치
  }

  // 추가: 튕기는 원 생성 조건 추가 (첫 번째 튕김 이후에만)
  if (abs(vs) < 0.1 && !move && firstBounce) {
    vs = 0; // 튕길 때의 속도를 0으로 설정

    // 추가: 튕기는 원 추가
    let size = random(5, 15);
    let angle = random(-PI / 4, PI / 4); // 무작위 각도 (-45도에서 45도 사이)
    let speed = random(0.8, 5); // 무작위 속도
    let x = random(width);
    let y = -size / 2; // 화면 위쪽 밖에 위치

    circles.push({ x, y, size, speed });
  }

  // 추가: 튕기는 원의 위치 업데이트 및 화면 바깥으로 나갔을 때 제거
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

  // 마우스가 상단 막대기 위에 있는지 여부 테스트
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

  // 상단 막대기의 위치 설정 및 제한
  if (move) {
    ps = mouseY - springHeight / 2;
    ps = constrain(ps, minHeight, maxHeight);
  }

  // 추가: 첫 번째 튕김 확인
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
