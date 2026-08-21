"use client";

import { useEffect, useRef } from "react";

type ParticleFieldProps = {
className?: string;
density?: number;
};

type Particle = {
x: number;
y: number;
size: number;
speedX: number;
speedY: number;
opacity: number;
};

export default function ParticleField({
className = "",
density = 70,
}: ParticleFieldProps) {
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
const canvas = canvasRef.current;

if (!canvas) return;

const context = canvas.getContext("2d");

if (!context) return;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let animationFrame = 0;
let width = 0;
let height = 0;
let particles: Particle[] = [];

const getParticleCount = () => {
  const area = window.innerWidth * window.innerHeight;

  if (window.innerWidth < 640) {
    return Math.min(28, Math.max(16, Math.round(area / 35000)));
  }

  return Math.min(
    density,
    Math.max(30, Math.round(area / 22000))
  );
};

function createParticle(): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.8 + 0.4,
    speedX: (Math.random() - 0.5) * 0.12,
    speedY: -(Math.random() * 0.16 + 0.035),
    opacity: Math.random() * 0.45 + 0.12,
  };
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  width = rect.width;
  height = rect.height;

  canvas.width = Math.max(1, Math.floor(width * pixelRatio));
  canvas.height = Math.max(1, Math.floor(height * pixelRatio));

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  particles = Array.from(
    { length: getParticleCount() },
    createParticle
  );
}

function draw() {
  context.clearRect(0, 0, width, height);

  for (const particle of particles) {
    context.beginPath();

    const glow =
      particle.size > 1.5
        ? `rgba(231, 184, 75, ${particle.opacity})`
        : `rgba(255, 255, 255, ${particle.opacity})`;

    context.fillStyle = glow;
    context.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );
    context.fill();

    if (!reducedMotion) {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.y < -10) {
        particle.y = height + 10;
        particle.x = Math.random() * width;
      }

      if (particle.x < -10) {
        particle.x = width + 10;
      }

      if (particle.x > width + 10) {
        particle.x = -10;
      }
    }
  }

  if (!reducedMotion) {
    animationFrame = requestAnimationFrame(draw);
  }
}

resize();
draw();

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas);

return () => {
  cancelAnimationFrame(animationFrame);
  resizeObserver.disconnect();
};

}, [density]);

return (
<canvas
ref={canvasRef}
aria-hidden="true"
className={"pointer-events-none absolute inset-0 h-full w-full ${className}"}
/>
);
}