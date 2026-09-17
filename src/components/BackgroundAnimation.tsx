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
      draw(currentAngle);
    };
    window.addEventListener('resize', handleResize);

    // Scroll-driven motion parameters
    let currentAngle = window.scrollY * 0.003;
    let targetAngle = currentAngle;
    let isMoving = false;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    // Static ambient stars (positions are static, subtle twinkle only on scroll)
    const particleCount = 60;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.15,
      hue: Math.random() > 0.5 ? 195 : 265,
    }));

    // Draw the 3D celestial artifact (Half Light, Half Shadow Midnight Moon & Orbiting Gyroscope)
    const draw = (angle: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw gentle ambient stars
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
        ctx.fill();
      });

      // 2. 3D Celestial Artifact:
      // Positioned strategically in the ambient background (upper-right / center-depth)
      // to guarantee it NEVER interferes with reading main web page elements.
      const centerX = width > 1024 ? width * 0.75 : width * 0.5;
      const centerY = height * 0.38;
      const baseRadius = Math.min(width, height) * 0.13;

      // 3D Orbital Gyro Ring 1 (Rotates strictly on scroll)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.85, baseRadius * 0.65, Math.PI / 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 10]);
      ctx.stroke();

      // Orbital Node 1
      const orbX1 = Math.cos(angle * 1.5) * baseRadius * 1.85;
      const orbY1 = Math.sin(angle * 1.5) * baseRadius * 0.65;
      ctx.beginPath();
      ctx.arc(orbX1, orbY1, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 3D Orbital Gyro Ring 2 (Counter-rotates on scroll)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 1.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.6, baseRadius * 0.55, -Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 10]);
      ctx.stroke();

      // Orbital Node 2
      const orbX2 = Math.cos(-angle * 1.8) * baseRadius * 1.6;
      const orbY2 = Math.sin(-angle * 1.8) * baseRadius * 0.55;
      ctx.beginPath();
      ctx.arc(orbX2, orbY2, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#c084fc';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#c084fc';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 3. Central Dual-State 3D Moon:
      // "Half light, half shadow — the truest picture of Midnight itself."
      ctx.save();
      ctx.translate(centerX, centerY);
      // Slight 3D tilt based on scroll velocity
      const tilt = Math.max(Math.min(scrollVelocity * 0.05, 0.25), -0.25);
      ctx.rotate(tilt);

      // Deep Shadow Half (Left - Hidden Private Witnesses)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, Math.PI * 0.5, Math.PI * 1.5);
      const shadowGrad = ctx.createRadialGradient(-baseRadius * 0.3, 0, 5, 0, 0, baseRadius);
      shadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
      shadowGrad.addColorStop(1, 'rgba(5, 8, 18, 0.92)');
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radiant Light Half (Right - Publicly Disclosed State)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, Math.PI * 1.5, Math.PI * 0.5);
      const lightGrad = ctx.createRadialGradient(baseRadius * 0.2, -baseRadius * 0.2, 5, 0, 0, baseRadius);
      lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      lightGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.4)');
      lightGrad.addColorStop(1, 'rgba(168, 85, 247, 0.25)');
      ctx.fillStyle = lightGrad;
      ctx.shadowBlur = 25;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Crescent dividing contour
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 0.35, baseRadius, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Outer rim
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    };

    // Animation Loop that runs ONLY when motion is happening from scroll
    const updateMotion = () => {
      const diff = targetAngle - currentAngle;
      if (Math.abs(diff) > 0.0005) {
        currentAngle += diff * 0.12; // smooth lerp interpolation
        scrollVelocity = diff * 5;
        draw(currentAngle);
        animationFrameId = requestAnimationFrame(updateMotion);
      } else {
        currentAngle = targetAngle;
        scrollVelocity = 0;
        draw(currentAngle);
        isMoving = false; // Completely STOP motion when scrolling stops
      }
    };

    // Scroll Handler: Only trigger animation when user scrolls
    const onScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY;
      lastScrollY = currentScroll;

      targetAngle = currentScroll * 0.0035;

      if (!isMoving) {
        isMoving = true;
        animationFrameId = requestAnimationFrame(updateMotion);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial render in stationary state
    draw(currentAngle);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="background-animation-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="background-animation-canvas" />
    </div>
  );
};
