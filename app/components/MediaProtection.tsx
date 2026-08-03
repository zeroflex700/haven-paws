"use client";

import { useEffect } from "react";

export default function MediaProtection() {
  useEffect(() => {
    function blockContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.tagName === "VIDEO") {
        e.preventDefault();
      }
    }

    function blockDrag(e: DragEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.tagName === "VIDEO") {
        e.preventDefault();
      }
    }

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDrag);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  return null;
}