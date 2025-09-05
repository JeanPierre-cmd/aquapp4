import React, { useState, useEffect } from 'react';
import { subscribe } from '../toasts';
import { Toast } from './Toast';
import { NotifKind } from '../types';

type ToastMessage = {
  id: string;
  message: string;
  kind: NotifKind;
};

const MAX_TOASTS = 3;
const TOAST_DURATION = 3500; // 3.5 seconds

export const ToastHost: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe((newToast) => {
      // Add the new toast and manage the queue size
      setToasts(currentToasts => {
        const withNewToast = [...currentToasts, newToast];
        // Slice from the end to keep only the last MAX_TOASTS items
        return withNewToast.slice(-MAX_TOASTS);
      });

      // Set a timer to remove this specific toast by its ID
      setTimeout(() => {
        setToasts(currentToasts => currentToasts.filter(t => t.id !== newToast.id));
      }, TOAST_DURATION);
    });
    return () => unsubscribe();
  }, []);

  const dismissToast = (id: string) => {
    setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3">
      {toasts.map(toast => (
        <div key={toast.id} className="animate-fade-in-right">
          <Toast
            message={toast.message}
            kind={toast.kind}
            onDismiss={() => dismissToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};
