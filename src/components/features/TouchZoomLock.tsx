'use client';

import { useEffect } from 'react';

export default function TouchZoomLock() {
  useEffect(() => {
    let lastTouchEnd = 0;

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest('button, a, input, select, textarea, [role="button"], [contenteditable="true"]'));

    const preventGestureZoom = (event: Event) => {
      event.preventDefault();
    };

    const preventDoubleTapZoom = (event: TouchEvent) => {
      const now = Date.now();
      if (isInteractiveTarget(event.target)) {
        lastTouchEnd = now;
        return;
      }

      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('gesturestart', preventGestureZoom, { passive: false });
    document.addEventListener('gesturechange', preventGestureZoom, { passive: false });
    document.addEventListener('gestureend', preventGestureZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', preventGestureZoom);
      document.removeEventListener('gesturechange', preventGestureZoom);
      document.removeEventListener('gestureend', preventGestureZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  return null;
}
