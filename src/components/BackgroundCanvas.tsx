import { useLayoutEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeAndDraw = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;

      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous scale
      ctx.scale(dpr, dpr);

      // Use CSS pixel space for drawing
      const width = cssWidth;
      const height = cssHeight;

      const dots = Array.from({ length: 100 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 3 + Math.random() * 3,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        for (let x = 0; x < width; x += 15) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 15) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Dots
        dots.forEach(dot => {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fill();
        });

        // Lines
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.stroke();
            }
          }
        }

        // Animate
        dots.forEach(dot => {
          dot.x += dot.dx;
          dot.y += dot.dy;
          if (dot.x < 0 || dot.x > width) dot.dx *= -1;
          if (dot.y < 0 || dot.y > height) dot.dy *= -1;
        });

        requestAnimationFrame(draw);
      };

      draw();
    };

    resizeAndDraw();
    window.addEventListener('resize', resizeAndDraw);
    return () => window.removeEventListener('resize', resizeAndDraw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'block',
      }}
    />
  );
}
