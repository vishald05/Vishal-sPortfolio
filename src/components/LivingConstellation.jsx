import { useEffect, useRef, useState } from "react";

const DESKTOP_QUERY = "(min-width: 851px)";
const PARTICLE_COUNT = 54;
const CONNECTION_DISTANCE = 132;
const MAX_CONNECTIONS = 260;
const IDLE_SPEED = 0.00018;
const POINTER_RADIUS = 165;
const POINTER_STRENGTH = 0.055;

function createParticle(width, height, index) {
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
  const orbit = Math.min(width, height) * (0.22 + (index % 5) * 0.05);
  return {
    x: width * 0.5 + Math.cos(angle) * orbit + (Math.random() - 0.5) * width * 0.3,
    y: height * 0.48 + Math.sin(angle) * orbit + (Math.random() - 0.5) * height * 0.28,
    vx: (Math.random() - 0.5) * 0.14,
    vy: (Math.random() - 0.5) * 0.14,
    radius: 1.1 + (index % 4) * 0.35,
    alpha: 0.35 + (index % 5) * 0.1,
    phase: Math.random() * Math.PI * 2,
  };
}

function LivingConstellation() {
  const canvasRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!isDesktop || !canvasRef.current) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const interactionTarget = canvas.parentElement || canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, active: false };
    const ripple = { x: 0, y: 0, age: Infinity };
    const particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let isVisible = !document.hidden;
    let hasDrawnStaticFrame = false;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      if (!particles.length) {
        for (let index = 0; index < PARTICLE_COUNT; index += 1) {
          particles.push(createParticle(width, height, index));
        }
      }
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const motionTime = prefersReducedMotion ? 0 : time;

      particles.forEach((particle, index) => {
        if (!prefersReducedMotion) {
          particle.vx += Math.cos(motionTime * IDLE_SPEED + particle.phase) * 0.0012;
          particle.vy += Math.sin(motionTime * IDLE_SPEED * 1.15 + particle.phase) * 0.0012;
        }

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < POINTER_RADIUS) {
            const influence = (1 - distance / POINTER_RADIUS) * POINTER_STRENGTH;
            particle.vx += (dx / distance) * influence;
            particle.vy += (dy / distance) * influence;
          }
        }

        if (ripple.age < 700) {
          const dx = particle.x - ripple.x;
          const dy = particle.y - ripple.y;
          const distance = Math.hypot(dx, dy);
          const ringDistance = Math.abs(distance - ripple.age * 0.18);
          if (distance > 0 && ringDistance < 34) {
            const influence = (1 - ringDistance / 34) * 0.035 * (1 - ripple.age / 700);
            particle.vx += (dx / distance) * influence;
            particle.vy += (dy / distance) * influence;
          }
        }

        particle.vx *= 0.985;
        particle.vy *= 0.985;
        if (!prefersReducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
        }

            const margin = 18;
        if (particle.x < margin || particle.x > width - margin) particle.vx *= -1;
        if (particle.y < margin || particle.y > height - margin) particle.vy *= -1;
        particle.x = Math.max(margin, Math.min(width - margin, particle.x));
        particle.y = Math.max(margin, Math.min(height - margin, particle.y));

        particle._index = index;
      });

      let connectionCount = 0;
      for (let first = 0; first < particles.length && connectionCount < MAX_CONNECTIONS; first += 1) {
        for (let second = first + 1; second < particles.length && connectionCount < MAX_CONNECTIONS; second += 1) {
          const firstParticle = particles[first];
          const secondParticle = particles[second];
          const distance = Math.hypot(firstParticle.x - secondParticle.x, firstParticle.y - secondParticle.y);
          if (distance > CONNECTION_DISTANCE) continue;

          const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.24;
          context.strokeStyle = `rgba(139, 120, 184, ${opacity})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(firstParticle.x, firstParticle.y);
          context.lineTo(secondParticle.x, secondParticle.y);
          context.stroke();
          connectionCount += 1;
        }
      }

      particles.forEach((particle) => {
        context.fillStyle = `rgba(73, 54, 94, ${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (ripple.age < 700) {
        context.strokeStyle = `rgba(139, 120, 184, ${0.2 * (1 - ripple.age / 700)})`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.age * 0.18, 0, Math.PI * 2);
        context.stroke();
      }
    };

    const animate = (time) => {
      if (!isVisible) {
        animationFrame = 0;
        return;
      }

      if (prefersReducedMotion) {
        if (!hasDrawnStaticFrame) {
          draw();
          hasDrawnStaticFrame = true;
        }
        return;
      }

      ripple.age += 16;
      draw(time);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handlePointerDown = (event) => {
      const bounds = canvas.getBoundingClientRect();
      ripple.x = event.clientX - bounds.left;
      ripple.y = event.clientY - bounds.top;
      ripple.age = 0;
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion && !animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    interactionTarget.addEventListener("pointermove", handlePointerMove);
    interactionTarget.addEventListener("pointerleave", handlePointerLeave);
    interactionTarget.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resize();
    draw();
    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    } else {
      hasDrawnStaticFrame = true;
    }

    return () => {
      observer.disconnect();
      interactionTarget.removeEventListener("pointermove", handlePointerMove);
      interactionTarget.removeEventListener("pointerleave", handlePointerLeave);
      interactionTarget.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [isDesktop]);

  if (!isDesktop) {
    return null;
  }

  return <canvas ref={canvasRef} className="living-constellation" aria-label="Interactive living constellation" role="img" />;
}

export default LivingConstellation;
