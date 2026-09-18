import React, { useEffect, useRef } from 'react';

export const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);

    // Dynamic camera / parallax state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Ambient & scroll-driven motion
    let baseAngle = 0;
    let scrollAngle = window.scrollY * 0.002;
    let targetScrollAngle = scrollAngle;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    const handleResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      targetMouseX = normalizedX * 0.35;
      targetMouseY = normalizedY * 0.35;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY;
      lastScrollY = currentScroll;
      scrollVelocity = delta * 0.005;
      targetScrollAngle = currentScroll * 0.0025;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Constellation particles (ZK proof network nodes)
    const particleCount = 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      radius: (Math.random() * 1.5 + 0.6) * dpr,
      baseAlpha: Math.random() * 0.45 + 0.15,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.4 ? 195 : 265, // Cyan vs Purple
    }));

    // Floating ZK mathematical glyphs
    const glyphs = [
      { text: 'π', x: 0.18, y: 0.25, baseAlpha: 0.18, scale: 22 },
      { text: 'σ', x: 0.85, y: 0.2, baseAlpha: 0.14, scale: 20 },
      { text: 'G₁', x: 0.12, y: 0.75, baseAlpha: 0.15, scale: 18 },
      { text: 'H(x)', x: 0.88, y: 0.72, baseAlpha: 0.16, scale: 19 },
      { text: 'λ', x: 0.32, y: 0.85, baseAlpha: 0.12, scale: 20 },
      { text: 'ZK', x: 0.82, y: 0.45, baseAlpha: 0.2, scale: 24 },
    ];

    let time = 0;

    const render = () => {
      time += 0.015;
      baseAngle += 0.003 + Math.abs(scrollVelocity) * 0.02;
      scrollVelocity *= 0.94; // damping

      // Smooth interpolation for mouse parallax and scroll
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scrollAngle += (targetScrollAngle - scrollAngle) * 0.08;

      const totalAngle = baseAngle + scrollAngle;

      ctx.clearRect(0, 0, width, height);

      // 1. Render subtle drifting constellation particles
      ctx.lineWidth = 0.5 * dpr;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulse = Math.sin(time * 1.5 + p.phase) * 0.15;
        const currentAlpha = Math.max(0.05, Math.min(0.8, p.baseAlpha + pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${currentAlpha})`;
        ctx.fill();

        // Connect nearby particles with gossamer filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 90 * dpr;

          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // 2. Render floating ZK mathematical glyphs in background
      glyphs.forEach((g, idx) => {
        const gx = g.x * width + mouseX * 25 * dpr * (idx % 2 === 0 ? 1 : -1);
        const gy = g.y * height + mouseY * 25 * dpr + Math.sin(time + idx) * 8 * dpr;
        const gAlpha = g.baseAlpha + Math.sin(time * 1.2 + idx) * 0.05;

        ctx.font = `600 ${g.scale * dpr}px 'Space Grotesk', system-ui, sans-serif`;
        ctx.fillStyle = `rgba(168, 85, 247, ${gAlpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(g.text, gx, gy);
      });

      // 3. Central 3D Celestial Artifact (Midnight Celestial Orb & Dual-State Gyroscope)
      // Placed slightly to the right/top on desktop, centered on mobile
      const isMobile = width < 900 * dpr;
      const centerX = isMobile ? width * 0.5 : width * 0.72 + mouseX * 40 * dpr;
      const centerY = (isMobile ? height * 0.32 : height * 0.38) + mouseY * 40 * dpr;
      const baseRadius = (isMobile ? Math.min(width, height) * 0.16 : Math.min(width, height) * 0.14);

      // Deep Volumetric Ambient Glow / Corona
      const ambientGlow = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.2, centerX, centerY, baseRadius * 2.8);
      ambientGlow.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
      ambientGlow.addColorStop(0.35, 'rgba(129, 140, 248, 0.08)');
      ambientGlow.addColorStop(0.7, 'rgba(168, 85, 247, 0.03)');
      ambientGlow.addColorStop(1, 'rgba(7, 11, 20, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = ambientGlow;
      ctx.fill();

      // Gyro Ring 1: Celestial Meridian (Cyan glow, tilted 40 deg, clockwise)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(totalAngle * 0.8 + mouseX * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.95, baseRadius * 0.75, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.6 * dpr;
      ctx.setLineDash([10 * dpr, 12 * dpr]);
      ctx.stroke();

      // Orbiting Beacon 1 (Proof generation node)
      const beaconAngle1 = totalAngle * 2.2;
      const orbX1 = Math.cos(beaconAngle1) * baseRadius * 1.95;
      const orbY1 = Math.sin(beaconAngle1) * baseRadius * 0.75;
      const rotAngle1 = Math.PI / 4;
      const rotatedX1 = orbX1 * Math.cos(rotAngle1) - orbY1 * Math.sin(rotAngle1);
      const rotatedY1 = orbX1 * Math.sin(rotAngle1) + orbY1 * Math.cos(rotAngle1);

      ctx.beginPath();
      ctx.arc(rotatedX1, rotatedY1, 4.5 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 14 * dpr;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Gyro Ring 2: Equatorial Counter-Ring (Purple glow, tilted -35 deg, counter-clockwise)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-totalAngle * 0.9 - mouseY * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, baseRadius * 1.7, baseRadius * 0.6, -Math.PI / 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.32)';
      ctx.lineWidth = 1.4 * dpr;
      ctx.setLineDash([6 * dpr, 10 * dpr]);
      ctx.stroke();

      // Orbiting Beacon 2
      const beaconAngle2 = -totalAngle * 2.5;
      const orbX2 = Math.cos(beaconAngle2) * baseRadius * 1.7;
      const orbY2 = Math.sin(beaconAngle2) * baseRadius * 0.6;
      const rotAngle2 = -Math.PI / 3.5;
      const rotatedX2 = orbX2 * Math.cos(rotAngle2) - orbY2 * Math.sin(rotAngle2);
      const rotatedY2 = orbX2 * Math.sin(rotAngle2) + orbY2 * Math.cos(rotAngle2);

      ctx.beginPath();
      ctx.arc(rotatedX2, rotatedY2, 4 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#c084fc';
      ctx.shadowBlur = 12 * dpr;
      ctx.shadowColor = '#c084fc';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Gyro Ring 3: Fine Inner Geometric Compass (Subtle Gold/Emerald cryptographic root ticks)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(totalAngle * 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.2)';
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([3 * dpr, 8 * dpr]);
      ctx.stroke();
      ctx.restore();

      // Central Dual-State Midnight Moon
      // Left = Confidential Private Witness (Dark Void / Shielded)
      // Right = Publicly Disclosed State (Luminous / Verified)
      ctx.save();
      ctx.translate(centerX, centerY);
      const dynamicTilt = Math.max(-0.25, Math.min(0.25, mouseX * 0.2 + scrollVelocity * 0.05));
      ctx.rotate(dynamicTilt);

      // Deep Confidential Shadow Hemisphere (Left)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, Math.PI * 0.5, Math.PI * 1.5);
      const shadowGrad = ctx.createRadialGradient(-baseRadius * 0.35, 0, 4, 0, 0, baseRadius);
      shadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      shadowGrad.addColorStop(0.6, 'rgba(8, 12, 24, 0.97)');
      shadowGrad.addColorStop(1, 'rgba(3, 7, 18, 0.99)');
      ctx.fillStyle = shadowGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.lineWidth = 1.2 * dpr;
      ctx.stroke();

      // Radiant Public Hemisphere (Right)
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, Math.PI * 1.5, Math.PI * 0.5);
      const lightGrad = ctx.createRadialGradient(baseRadius * 0.3, -baseRadius * 0.2, 5, 0, 0, baseRadius);
      lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.65)');
      lightGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.5)');
      lightGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.35)');
      lightGrad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');
      ctx.fillStyle = lightGrad;
      ctx.shadowBlur = 30 * dpr;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.45)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Crescent Dividing Contour
      ctx.beginPath();
      const crescentPulse = Math.sin(time * 2) * 0.03;
      ctx.ellipse(0, 0, baseRadius * (0.32 + crescentPulse), baseRadius, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.8 * dpr;
      ctx.shadowBlur = 12 * dpr;
      ctx.shadowColor = '#38bdf8';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Outer Perimeter Halo Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.6 * dpr;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    // Start loop
    render();

    // Pause when page is hidden to preserve battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="background-animation-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="background-animation-canvas" />
    </div>
  );
};
export default BackgroundAnimation;
