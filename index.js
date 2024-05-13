/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("canvas");
const radiusControl = document.getElementById('radius')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.display = "block";
const ctx = canvas.getContext("2d");
let animationFrameHolder;
let throwController = {
  x: 0,
  y: 0,
  start: 0,
  end: 0,
  throwDuration: 0,
};

const ball = {
  x: 100,
  y: 25,
  vx: 15,
  vy: 1,
  gx: 0,
  gy: 0.5,
  radius: 25,
  color: "blue",
  carrying: false,
  bounciness: 0.8,
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },
};

function clear() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
const keysDown = {};
function keyed(e) {
  keysDown[e.key] = e.type === "keydown";
  console.log(keysDown);
}
addEventListener("keydown", keyed);
addEventListener("keyup", keyed);
radiusControl.addEventListener('input', (e) => {
  ball.radius = radiusControl.valueAsNumber
})

function draw() {
  clear();
  ball.draw();
  ball.x += ball.vx;
  ball.y += ball.vy;
  // friction
  // ball.vx *= 0.99;
  // ball.vy *= 0.99;
  // handle
  if (keysDown.ArrowLeft) {
    ball.vx -= 0.1;
  }
  if (keysDown.ArrowRight) {
    ball.vx += 0.1;
  }

  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    // ball.y -= ball.radius
    if (keysDown.ArrowUp) {
      ball.vy = -20;
    } else {
      const d =
        ball.y + ball.radius >= canvas.height
          ? -canvas.height + ball.y + ball.radius
          : ball.y - ball.radius;
      ball.y -= d;
      // console.log( ball.y + ball.radius >= canvas.height ? canvas.height - ball.y - ball.radius : ball.y - ball.radius);
      // ball.vx *= 0.99;
      ball.vy *= -ball.bounciness;
    }
  } else {
    ball.vy += ball.gy;
  }
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    const d =
      ball.x + ball.radius >= canvas.width
        ? -canvas.width + ball.x + ball.radius
        : ball.x - ball.radius;
    ball.x -= d;

    ball.vx *= -ball.bounciness;
    // ball.vy *= 0.99;
  }
  // ball.vx += ball.gx;
  // ball.gy += 0.3
  animationFrameHolder = window.requestAnimationFrame(draw);
}

const cOnBall = (x, y) =>
  x > ball.x - ball.radius &&
  x < ball.x + ball.radius &&
  y > ball.y - ball.radius &&
  y < ball.y + ball.radius;

canvas.addEventListener("mousedown", (e) => {
  ball.carrying = !ball.carrying;
  throwController.x0 = e.clientX;
  throwController.y0 = e.clientY;
  throwController.start = 0;
  cancelAnimationFrame(animationFrameHolder);
});

canvas.addEventListener("mousemove", (e) => {
  if (ball.carrying) {
    clear();
    ball.x = e.clientX;
    ball.y = e.clientY;
    ball.draw();
    throwController.start += 0.2;
  }
});

canvas.addEventListener("mouseup", (e) => {
  ball.carrying = false;
  throwController.x1 = e.clientX;
  throwController.y1 = e.clientY;
  throwController.end = new Date().getTime();
  throwController.throwDuration = throwController.end - throwController.start;
  let s = 0.3;
  ball.vx = s * (throwController.x1 - throwController.x0);
  ball.vy = s * (throwController.y1 - throwController.y0);
  console.log(throwController);
  animationFrameHolder = window.requestAnimationFrame(draw);
  running = true;
});

// canvas.addEventListener("click", (e) => {
// if (!running) {
animationFrameHolder = window.requestAnimationFrame(draw);
// running = true;
//   }
// }); 

// canvas.addEventListener("mouseout", (e) => {
//   window.cancelAnimationFrame(raf);
//   running = false;
// });

ball.draw();
