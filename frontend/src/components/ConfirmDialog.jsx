
import { useEffect } from "react";
import Modal from "./Modal";

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message = "Please confirm that you want to continue.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "danger",
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isLoading) {
        onCancel?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  function handleConfirm() {
    if (!isLoading) {
      onConfirm?.();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? undefined : onCancel}>
      <div className="confirm-dialog" role="alertdialog" aria-modal="true">
        <div className="confirm-dialog__icon" aria-hidden="true">
          {variant === "danger" ? "!" : "?"}
        </div>

        <h2 className="confirm-dialog__title">{title}</h2>

        <p className="confirm-dialog__message">{message}</p>

        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`button ${
              variant === "danger"
                ? "button--danger"
                : "button--primary"
            }`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
