import React from 'react';
import { X, Trash2, Check, Undo, Inbox, ExternalLink } from 'lucide-react';
import { useNotifications } from '../useNotifications';
import { Notif } from '../types';

interface ListProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick?: (notif: Notif) => void;
  navigate?: (path: string) => void;
}

const kindStyles = {
  info: { icon: 'text-secondary', bg: 'bg-secondary/10' },
  success: { icon: 'text-success', bg: 'bg-success/10' },
  warning: { icon: 'text-warning', bg: 'bg-warning/10' },
  error: { icon: 'text-error', bg: 'bg-error/10' },
};

export const List: React.FC<ListProps> = ({ isOpen, onClose, onItemClick, navigate }) => {
  const { items, markRead, markUnread, dismiss, clearAll, toast } = useNotifications();

  if (!isOpen) return null;

  const handleItemClick = (notif: Notif) => {
    markRead(notif.id);
    if (onItemClick) {
      onItemClick(notif);
    }
    if (navigate && typeof notif.data?.route === 'string') {
      navigate(notif.data.route);
    }
    onClose();
  };

  const handleMarkRead = (id: string) => {
    markRead(id);
    toast('Marcada como leída.', 'success');
  };

  const handleMarkUnread = (id: string) => {
    markUnread(id);
    toast('Marcada como no leída.', 'info');
  };

  const handleDismiss = (id: string) => {
    dismiss(id);
    toast('Notificación descartada.', 'info');
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todas las notificaciones?')) {
      clearAll();
      toast('Todas las notificaciones han sido limpiadas.', 'success');
      onClose();
    }
  };

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-surface rounded-lg shadow-2xl border border-border z-50 flex flex-col animate-fade-in-down"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-heading"
    >
      <header className="flex justify-between items-center p-4 border-b border-border">
        <h3 id="notifications-heading" className="text-lg font-semibold text-text">Notificaciones</h3>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-textSecondary hover:text-primary transition-colors"
              title="Limpiar todas las notificaciones"
            >
              Limpiar todo
            </button>
          )}
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-textSecondary hover:bg-border/50 hover:text-text transition-colors"
            title="Cerrar panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto max-h-[60vh]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 text-textSecondary">
            <Inbox className="h-12 w-12 mb-4" />
            <p className="font-semibold">Todo al día</p>
            <p className="text-sm">No tienes notificaciones nuevas.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map(notif => (
              <li key={notif.id} className={`p-4 ${kindStyles[notif.kind].bg} hover:bg-border/50 transition-colors group`}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-2 h-2 mt-1.5 rounded-full ${notif.read ? 'bg-gray-500' : 'bg-primary animate-pulse'}`} title={notif.read ? 'Leída' : 'No leída'}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-text">{notif.title}</p>
                    {notif.message && <p className="text-sm text-textSecondary mt-1">{notif.message}</p>}
                    <div className="flex items-center gap-4 mt-3 text-xs text-textSecondary">
                      <button onClick={() => notif.read ? handleMarkUnread(notif.id) : handleMarkRead(notif.id)} className="hover:text-primary transition-colors flex items-center gap-1">
                        {notif.read ? <Undo size={14} /> : <Check size={14} />}
                        {notif.read ? 'No leído' : 'Leído'}
                      </button>
                      {notif.data?.route && (
                        <button onClick={() => handleItemClick(notif)} className="hover:text-primary transition-colors flex items-center gap-1">
                          <ExternalLink size={14} /> Abrir
                        </button>
                      )}
                      <button onClick={() => handleDismiss(notif.id)} className="hover:text-error transition-colors flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} /> Descartar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
