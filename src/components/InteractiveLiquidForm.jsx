import { useEffect, useRef, useState } from "react";

const DESKTOP_QUERY = "(min-width: 851px)";

function InteractiveLiquidForm() {
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
    const context = canvas.getContext("2d");
    const interactionTarget = canvas.parentElement;
    if (!context || !interactionTarget) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, active: false };
    const targetTilt = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let isVisible = !document.hidden;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawRibbon = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width, height) / 420;
      const idleRotation = prefersReducedMotion ? 0 : Math.sin(time * 0.00022) * 0.045;
      const rotation = idleRotation + tilt.y * 0.12;
      const wave = prefersReducedMotion ? 0 : Math.sin(time * 0.0011) * 8;

      context.save();
      context.translate(centerX, centerY);
      context.rotate(rotation);
      context.scale(scale, scale);
      context.translate(tilt.x * 8, tilt.y * 5);

      const gradient = context.createLinearGradient(-115, -180, 125, 190);
      gradient.addColorStop(0, "rgba(73,54,94,0.96)");
      gradient.addColorStop(0.38, "rgba(139,120,184,0.94)");
      gradient.addColorStop(0.7, "rgba(73,54,94,0.98)");
      gradient.addColorStop(1, "rgba(201,185,223,0.78)");

      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = gradient;
      context.lineWidth = 72;
      context.shadowColor = "rgba(73,54,94,0.12)";
      context.shadowBlur = 18;
      context.beginPath();
      context.moveTo(-44 + wave * 0.15, -170);
      context.bezierCurveTo(104, -132, 82, -64, -18, -28);
      context.bezierCurveTo(-106, 6, -98, 70, 32 + wave * 0.2, 92);
      context.bezierCurveTo(94, 122, 76, 158, 36, 177);
      context.stroke();

      context.shadowBlur = 0;
      context.lineWidth = 10;
      context.strokeStyle = "rgba(233,225,242,0.42)";
      context.beginPath();
      context.moveTo(-58 + wave * 0.15, -168);
      context.bezierCurveTo(82, -126, 67, -70, -26, -34);
      context.bezierCurveTo(-91, -4, -82, 54, 27, 86);
      context.bezierCurveTo(70, 100, 67, 137, 39, 164);
      context.stroke();

      context.lineWidth = 3;
      context.strokeStyle = "rgba(255,255,255,0.48)";
      context.beginPath();
      context.moveTo(-59 + wave * 0.15, -166);
      context.bezierCurveTo(71, -124, 58, -75, -28, -40);
      context.stroke();

      context.restore();
    };

    const animate = (time) => {
      if (!isVisible) {
        animationFrame = 0;
        return;
      }

      tilt.x += (targetTilt.x - tilt.x) * 0.055;
      tilt.y += (targetTilt.y - tilt.y) * 0.055;
      drawRibbon(time);
      if (!prefersReducedMotion) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event) => {
      const bounds = interactionTarget.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = (event.clientY - bounds.top) / bounds.height;
      targetTilt.x = Math.max(-1, Math.min(1, pointer.x * 2 - 1));
      targetTilt.y = Math.max(-1, Math.min(1, pointer.y * 2 - 1));
    };

    const handlePointerLeave = () => {
      targetTilt.x = 0;
      targetTilt.y = 0;
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
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resize();
    drawRibbon();
    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    }

    return () => {
      observer.disconnect();
      interactionTarget.removeEventListener("pointermove", handlePointerMove);
      interactionTarget.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [isDesktop]);

  if (!isDesktop) {
    return null;
  }

  return <canvas ref={canvasRef} className="interactive-liquid-form" aria-hidden="true" />;
}

export default InteractiveLiquidForm;
