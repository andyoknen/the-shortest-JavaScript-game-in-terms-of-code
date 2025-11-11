// Simple 30-second fruit chase game
document.body.innerHTML = `
<style>
  body { margin: 0; background: #101820; color: #f0f6ff; font: 16px monospace; text-align: center; }
  canvas { display: block; margin: 16px auto; background: #080d11; border: 2px solid #2ee6a3; }
</style>
<main>
  <h2>Fruit Dash</h2>
  <p id="info">Use arrow keys</p>
  <canvas id="board" width="320" height="240"></canvas>
</main>
`;

const info = document.getElementById('info');
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const player = { x: 150, y: 110, size: 16 };
const fruit = { x: 40, y: 40, size: 10 };
const keys = new Set();
let score = 0;
let timeLeft = 30;
let active = true;
let last = performance.now();

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const spawnFruit = () => {
  fruit.x = 20 + Math.random() * (canvas.width - 40);
  fruit.y = 20 + Math.random() * (canvas.height - 40);
};

window.addEventListener('keydown', event => keys.add(event.key));
window.addEventListener('keyup', event => keys.delete(event.key));

const update = dt => {
  const speed = 110;
  if (keys.has('ArrowUp')) player.y -= speed * dt;
  if (keys.has('ArrowDown')) player.y += speed * dt;
  if (keys.has('ArrowLeft')) player.x -= speed * dt;
  if (keys.has('ArrowRight')) player.x += speed * dt;
  player.x = clamp(player.x, 0, canvas.width - player.size);
  player.y = clamp(player.y, 0, canvas.height - player.size);

  const dx = player.x + player.size / 2 - (fruit.x + fruit.size / 2);
  const dy = player.y + player.size / 2 - (fruit.y + fruit.size / 2);
  if (Math.hypot(dx, dy) < (player.size + fruit.size) / 2) {
    score += 1;
    timeLeft = Math.min(60, timeLeft + 2);
    spawnFruit();
  }

  timeLeft = Math.max(0, timeLeft - dt);
  info.textContent = active
    ? `Очки: ${score} — Осталось: ${timeLeft.toFixed(1)} c`
    : `Игра окончена — ${score} очков`;
  if (!timeLeft) active = false;
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2ee6a3';
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.fillStyle = '#ff5f7e';
  ctx.beginPath();
  ctx.arc(fruit.x + fruit.size / 2, fruit.y + fruit.size / 2, fruit.size / 2, 0, Math.PI * 2);
  ctx.fill();
};

const loop = now => {
  const dt = (now - last) / 1000;
  last = now;
  if (active) update(dt);
  draw();
  requestAnimationFrame(loop);
};

spawnFruit();
loop(last);
