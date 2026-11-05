"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";

const toastStyle: CSSProperties = {
  background: "var(--asap-color-surface)",
  color: "var(--asap-color-ink)",
  border: "1px solid var(--asap-color-border)",
  boxShadow: "var(--asap-shadow-overlay)",
  borderRadius: "var(--asap-radius-xl)",
  fontFamily: "var(--asap-font-sans)",
};

const actionButtonStyle: CSSProperties = {
  background: "var(--asap-color-primary)",
  color: "var(--asap-color-primary-foreground)",
  borderRadius: "var(--asap-radius-md)",
  height: "var(--asap-space-control-lg)",
  padding: "0 14px",
  fontWeight: 600,
};

const cancelButtonStyle: CSSProperties = {
  background: "var(--asap-color-surface-muted)",
  color: "var(--asap-color-ink)",
  borderRadius: "var(--asap-radius-md)",
  height: "var(--asap-space-control-lg)",
};

function Toaster({ position = "bottom-center", toastOptions, ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position={position}
      closeButton={false}
      containerAriaLabel="Notifications"
      toastOptions={{
        ...toastOptions,
        style: { ...toastStyle, ...toastOptions?.style },
        actionButtonStyle: { ...actionButtonStyle, ...toastOptions?.actionButtonStyle },
        cancelButtonStyle: { ...cancelButtonStyle, ...toastOptions?.cancelButtonStyle },
        classNames: {
          title: "text-asap-sm font-semibold",
          description: "text-asap-xs text-muted",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

/**
 * Toast with an Undo action. The handler runs when the person taps Undo.
 * Duration is long enough to reach the button on a phone.
 */
function toastWithUndo(
  message: string,
  onUndo: () => void,
  options?: { description?: string; duration?: number },
) {
  return toast(message, {
    description: options?.description,
    duration: options?.duration ?? 5000,
    action: {
      label: "Undo",
      onClick: () => {
        onUndo();
      },
    },
  });
}

export { Toaster, toast, toastWithUndo };
