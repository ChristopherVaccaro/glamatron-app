// Simple confetti effect for delightful interactions
export function triggerConfetti(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const colors = ['#f43f5e', '#ec4899', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      left: ${centerX}px;
      top: ${centerY}px;
    `;
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
    const velocity = 80 + Math.random() * 60;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 50; // Initial upward boost
    
    let x = 0;
    let y = 0;
    let opacity = 1;
    let rotation = Math.random() * 360;
    const rotationSpeed = (Math.random() - 0.5) * 20;
    const gravity = 200;
    let velocityY = vy;
    
    const startTime = performance.now();
    const duration = 800 + Math.random() * 400;
    
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        particle.remove();
        return;
      }
      
      const dt = 0.016; // ~60fps
      x += vx * dt;
      velocityY += gravity * dt;
      y += velocityY * dt;
      rotation += rotationSpeed;
      opacity = 1 - progress;
      
      particle.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${1 - progress * 0.5})`;
      particle.style.opacity = String(opacity);
      
      requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
  }
}

// Heart burst effect - smaller, more focused
export function triggerHeartBurst(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const hearts = ['❤️', '💕', '💖', '💗', '✨'];
  const particleCount = 8;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    particle.style.cssText = `
      position: fixed;
      font-size: ${10 + Math.random() * 6}px;
      pointer-events: none;
      z-index: 9999;
      left: ${centerX}px;
      top: ${centerY}px;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 40 + Math.random() * 30;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 30;
    
    let x = 0;
    let y = 0;
    let opacity = 1;
    let scale = 1;
    const gravity = 100;
    let velocityY = vy;
    
    const startTime = performance.now();
    const duration = 600;
    
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        particle.remove();
        return;
      }
      
      const dt = 0.016;
      x += vx * dt;
      velocityY += gravity * dt;
      y += velocityY * dt;
      opacity = 1 - progress;
      scale = 1 + progress * 0.5;
      
      particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      particle.style.opacity = String(opacity);
      
      requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
  }
}
