import React, { useEffect, useRef } from 'react';

export const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Stars
    const particleCount = 75;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      hue: Math.random() > 0.5 ? 190 : 270, // cyan or purple
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient stars
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = p.hue === 190 ? '#38bdf8' : '#c084fc';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Draw the Signature Midnight Figure: Celestial Dual-State Moon & Orbital Gyroscope
      // Centered or slightly offset behind the hero
      const centerX = width * 0.5;
      const centerY = height * 0.42;
      const baseRadius = Math.min(width, height) * 0.18;

      angle += 0.006;

      // Outer Orbital Ring 1
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.7, baseRadius * 0.65, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.stroke();

      // Orbiting Node 1
      const orbX1 = Math.cos(angle * 2) * baseRadius * 1.7;
      const orbY1 = Math.sin(angle * 2) * baseRadius * 0.65;
      ctx.beginPath();
      ctx.arc(orbX1, orbY1, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.restore();

      // Outer Orbital Ring 2 (Perpendicular axis)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.5, baseRadius * 0.55, -Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 10]);
      ctx.stroke();

      // Orbiting Node 2
      const orbX2 = Math.cos(-angle * 2.2) * baseRadius * 1.5;
      const orbY2 = Math.sin(-angle * 2.2) * baseRadius * 0.55;
      ctx.beginPath();
      ctx.arc(orbX2, orbY2, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#c084fc';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#c084fc';
      ctx.fill();
      ctx.restore();

      // Central Figure: "Half Light, Half Shadow — The Midnight Moon"
      ctx.save();
      ctx.translate(centerX, centerY);

      // Deep Shadow Half (Left)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, Math.PI * 0.5, Math.PI * 1.5);
      const shadowGrad = ctx.createRadialGradient(-baseRadius * 0.3, 0, 10, 0, 0, baseRadius);
      shadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      shadowGrad.addColorStop(1, 'rgba(5, 8, 18, 0.98)');
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radiant Light Half (Right - Disclosed State)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, Math.PI * 1.5, Math.PI * 0.5);
      const lightGrad = ctx.createRadialGradient(baseRadius * 0.2, -baseRadius * 0.2, 5, 0, 0, baseRadius);
      lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
      lightGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.55)');
      lightGrad.addColorStop(1, 'rgba(168, 85, 247, 0.35)');
      ctx.fillStyle = lightGrad;
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Crescent dividing contour with glowing edge
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 0.35, baseRadius, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#38bdf8';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glowing outer rim
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="background-animation-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="background-animation-canvas" />
    </div>
  );
};
