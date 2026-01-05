import { useEffect, RefObject } from 'react';

const FOCUSABLE_SELECTORS = `a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])`;

const getFocusableElements = (container: HTMLElement) => {
  const els = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
  return els.filter(el => el.offsetParent !== null || el.getClientRects().length > 0);
};

export const useFocusTrap = (ref: RefObject<HTMLElement | null>, active: boolean) => {
  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    const previousActive = document.activeElement as HTMLElement | null;

    // Ensure the container is focusable if no focusables inside
    const focusables = getFocusableElements(container);
    if (focusables.length) {
      focusables[0].focus();
    } else {
      container.tabIndex = -1;
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const current = getFocusableElements(container);
        if (current.length === 0) {
          e.preventDefault();
          return;
        }
        const first = current[0];
        const last = current[current.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      try { previousActive?.focus(); } catch {}
    };
  }, [ref, active]);
};
