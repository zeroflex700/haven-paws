"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * AuthMotionProvider
 * -------------------
 * UI-only. Tracks whether the current device qualifies for the richer
 * desktop motion system (fine pointer, hover support, roomy viewport,
 * no reduced-motion preference), and — only when it does — runs a single
 * requestAnimationFrame loop that eases the cursor position into two CSS
 * custom properties: --pointer-x and --pointer-y (0..1).
 *
 * Every decorative layer (background blobs, card tilt, spotlight) reads
 * those two variables straight from CSS. This keeps the whole motion
 * system to one listener + one animation loop, no matter how many
 * layers respond to it, and it never triggers a React re-render on
 * pointer move.
 */

const AuthMotionContext = createContext(false);

export function useAuthMotion() {
  return useContext(AuthMotionContext);
}

export default function AuthMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const isRoomy = window.matchMedia("(min-width: 1024px)").matches;

    const shouldEnable = !reduceMotion && canHover && isRoomy;
    setEnabled(shouldEnable);

    if (!shouldEnable) return;

    let frame = 0;
    let targetX = 0.5;
    let targetY = 0.5;

    function handlePointerMove(e: PointerEvent) {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    }

    function tick() {
      const node = rootRef.current;

      if (node) {
        const currentX = parseFloat(
          node.style.getPropertyValue("--pointer-x") || "0.5"
        );
        const currentY = parseFloat(
          node.style.getPropertyValue("--pointer-y") || "0.5"
        );

        // Gentle easing rather than snapping straight to the cursor —
        // this is what keeps the tilt/spotlight feeling physical.
        const nextX = currentX + (targetX - currentX) * 0.08;
        const nextY = currentY + (targetY - currentY) * 0.08;

        node.style.setProperty("--pointer-x", nextX.toFixed(4));
        node.style.setProperty("--pointer-y", nextY.toFixed(4));
      }

      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <AuthMotionContext.Provider value={enabled}>
      <div
        ref={rootRef}
        data-auth-motion={enabled ? "on" : "off"}
        style={{ "--pointer-x": 0.5, "--pointer-y": 0.5 } as React.CSSProperties}
        className="contents"
      >
        {children}
      </div>
    </AuthMotionContext.Provider>
  );
}
