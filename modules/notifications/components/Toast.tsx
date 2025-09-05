import React from 'react';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { NotifKind } from '../types';

interface ToastProps {
  message: string;
  kind: NotifKind;
  onDismiss: () => void;
}

const toastStyles = {
  info: { icon: <Info />, bar: 'bg-secondary', text: 'text-secondary' },
  success: { icon: <CheckCircle2 />, bar: 'bg-success', text: 'text-success' },
  warning: { icon: <AlertTriangle />, bar: 'bg-warning', text: 'text-warning' },
  error: { icon: <AlertCircle />, bar: 'bg-error', text: 'text-error' },
};

export const Toast: React.FC<ToastProps> = ({ message, kind, onDismiss }) => {
  const { icon, bar, text: textColor } = toastStyles[kind];

  return (
    <div className={`flex items-center w-full max-w-sm p-4 text-text bg-surface rounded-lg shadow-lg border border-border relative overflow-hidden`} role="alert">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bar}`}></div>
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ml-2 ${textColor}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button type="button" className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 rounded-lg text-textSecondary hover:text-text hover:bg-border/50 transition-colors" onClick={onDismiss} aria-label="Close">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
