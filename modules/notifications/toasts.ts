// A simple pub/sub model for toasts
import { NotifKind } from './types';

type ToastMessage = {
  id: string;
  message: string;
  kind: NotifKind;
};

type Listener = (toast: ToastMessage) => void;

let listeners: Listener[] = [];

export const toast = (message: string, kind: NotifKind = 'info') => {
  const newToast: ToastMessage = {
    id: crypto.randomUUID(),
    message,
    kind,
  };
  listeners.forEach(listener => listener(newToast));
};

export const subscribe = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};
