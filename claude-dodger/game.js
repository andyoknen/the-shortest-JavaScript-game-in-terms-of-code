// Embedded Dodger Game - Ultra-compact arcade game
(function() {
  // Create canvas and context
  const c = document.createElement('canvas');
  const x = c.getContext('2d');
  c.width = 400;
  c.height = 600;
  c.style.border = '2px solid #333';
  c.style.display = 'block';
  c.style.margin = '20px auto';
  c.style.background = '#1a1a2e';
  document.body.appendChild(c);
  
  // Game state
  let p = {x: 180, y: 520, w: 40, h: 40, s: 8}; // player
  let e = []; // enemies
  let sc = 0; // score
  let g = true; // game active
  let k = {}; // keys
  
  // Input handling
  document.addEventListener('keydown', ev => k[ev.key] = true);
  document.addEventListener('keyup', ev => k[ev.key] = false);
  
  // Touch controls for mobile
  let tx = null;
  c.addEventListener('touchstart', ev => {
    ev.preventDefault();
    tx = ev.touches[0].clientX;
  });
  c.addEventListener('touchmove', ev => {
    ev.preventDefault();
    if (tx !== null) {
      const dx = ev.touches[0].clientX - tx;
      p.x += dx;
      tx = ev.touches[0].clientX;
    }
  });
  c.addEventListener('touchend', () => tx = null);
  
  // Spawn enemy
  function spawn() {
    e.push({
      x: Math.random() * (c.width - 30),
      y: -30,
      w: 30 + Math.random() * 20,
      h: 30 + Math.random() * 20,
      s: 2 + Math.random() * 3 + sc / 500
    });
  }
  
  // Collision detection
  function hit(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && 
           a.y < b.y + b.h && a.y + a.h > b.y;
  }
  
  // Game loop
  function loop() {
    if (!g) {
      // Game over screen
      x.fillStyle = 'rgba(0,0,0,0.7)';
      x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = '#ff6b6b';
      x.font = 'bold 48px Arial';
      x.textAlign = 'center';
      x.fillText('GAME OVER', c.width/2, c.height/2 - 40);
      x.fillStyle = '#fff';
      x.font = '24px Arial';
      x.fillText('Score: ' + Math.floor(sc), c.width/2, c.height/2 + 10);
      x.font = '18px Arial';
      x.fillText('Press SPACE to restart', c.width/2, c.height/2 + 50);
      
      if (k[' ']) {
        // Reset game
        p.x = 180;
        p.y = 520;
        e = [];
        sc = 0;
        g = true;
        k[' '] = false;
      }
      requestAnimationFrame(loop);
      return;
    }
    
    // Clear screen
    x.fillStyle = '#1a1a2e';
    x.fillRect(0, 0, c.width, c.height);
    
    // Update player
    if ((k['ArrowLeft'] || k['a']) && p.x > 0) p.x -= p.s;
    if ((k['ArrowRight'] || k['d']) && p.x < c.width - p.w) p.x += p.s;
    
    // Draw player with glow
    x.shadowBlur = 20;
    x.shadowColor = '#4ecdc4';
    x.fillStyle = '#4ecdc4';
    x.fillRect(p.x, p.y, p.w, p.h);
    x.shadowBlur = 0;
    
    // Spawn enemies
    if (Math.random() < 0.02 + sc / 10000) spawn();
    
    // Update and draw enemies
    for (let i = e.length - 1; i >= 0; i--) {
      const en = e[i];
      en.y += en.s;
      
      // Draw enemy with glow
      x.shadowBlur = 15;
      x.shadowColor = '#ff6b6b';
      x.fillStyle = '#ff6b6b';
      x.fillRect(en.x, en.y, en.w, en.h);
      x.shadowBlur = 0;
      
      // Check collision
      if (hit(p, en)) {
        g = false;
      }
      
      // Remove off-screen enemies
      if (en.y > c.height) {
        e.splice(i, 1);
        sc += 10;
      }
    }
    
    // Draw score
    x.fillStyle = '#fff';
    x.font = 'bold 24px Arial';
    x.textAlign = 'left';
    x.fillText('Score: ' + Math.floor(sc), 10, 30);
    
    // Draw instructions
    x.font = '14px Arial';
    x.fillStyle = 'rgba(255,255,255,0.5)';
    x.fillText('← → or A D to move', 10, c.height - 10);
    
    sc += 0.1; // Increase score over time
    
    requestAnimationFrame(loop);
  }
  
  // Start game
  loop();
})();
