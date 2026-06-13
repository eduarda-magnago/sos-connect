import { ReactNode, useEffect, useState } from "react";

import { FeedbackDialog, type FeedbackVariant } from "./FeedbackDialog";

type FeedbackRequest = {
  variant?: FeedbackVariant;
  title: string;
  message: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

let feedbackHandler: ((feedback: FeedbackRequest) => void) | null = null;

export function showFeedback(feedback: FeedbackRequest) {
  feedbackHandler?.(feedback);
}

export function showSuccess(title: string, message: string, onPrimary?: () => void) {
  showFeedback({ variant: "success", title, message, onPrimary });
}

export function showError(title: string, message: string, onPrimary?: () => void) {
  showFeedback({ variant: "error", title, message, onPrimary });
}

export function showWarning(title: string, message: string, onPrimary?: () => void) {
  showFeedback({ variant: "warning", title, message, onPrimary });
}

export function showInfo(title: string, message: string, onPrimary?: () => void) {
  showFeedback({ variant: "info", title, message, onPrimary });
}

export function confirmFeedback({
  title,
  message,
  confirmText,
  cancelText = "Cancelar",
  variant = "warning",
  onConfirm,
}: {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  variant?: FeedbackVariant;
  onConfirm: () => void;
}) {
  showFeedback({
    variant,
    title,
    message,
    primaryText: confirmText,
    secondaryText: cancelText,
    onPrimary: onConfirm,
  });
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<FeedbackRequest | null>(null);

  useEffect(() => {
    feedbackHandler = setFeedback;

    return () => {
      feedbackHandler = null;
    };
  }, []);

  function handlePrimary() {
    const action = feedback?.onPrimary;
    setFeedback(null);
    action?.();
  }

  function handleSecondary() {
    const action = feedback?.onSecondary;
    setFeedback(null);
    action?.();
  }

  return (
    <>
      {children}
      <FeedbackDialog
        visible={!!feedback}
        variant={feedback?.variant}
        title={feedback?.title ?? ""}
        message={feedback?.message ?? ""}
        primaryText={feedback?.primaryText}
        secondaryText={feedback?.secondaryText}
        onPrimary={handlePrimary}
        onSecondary={handleSecondary}
      />
    </>
  );
}
