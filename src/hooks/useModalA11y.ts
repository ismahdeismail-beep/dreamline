import { useEffect, useRef } from 'react';

/** Selector for elements that can receive keyboard focus inside a dialog. */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Baseline dialog accessibility for a modal overlay.
 *
 * Modals previously had no `role="dialog"`, no Escape-to-close, no focus
 * containment, and no scroll lock, so screen readers did not announce them and
 * keyboard users could tab out into the page behind.
 *
 * On open:  move focus into the dialog, lock body scroll, listen for Escape
 *           and Tab.
 * On close: restore body scroll, remove listeners, and return focus to whatever
 *           was focused before (usually the button that opened the modal).
 *
 * Modals that are conditionally rendered (mounted only while open) can pass
 * `true` for `isOpen`; modals always mounted and toggled should pass their own
 * open state.
 */
export function useModalA11y<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const dialogRef = useRef<T | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusTo.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const node = dialogRef.current;
    const firstFocusable = node?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? node)?.focus();

    const getFocusable = () =>
      node
        ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
          )
        : [];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !node) return;

      // Contain focus: wrap at both ends so Tab never escapes the dialog.
      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [isOpen, onClose]);

  return dialogRef;
}