import { create } from 'zustand';
import { Notification } from '../types';
import { fetchNotifications } from '../services/mockNotifications';

interface NotificationState {
  notifications: Notification[];
  isPanelOpen: boolean;
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  
  // Actions
  loadNotifications: () => Promise<void>;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const calculateUnread = (notifications: Notification[]) => 
  notifications.filter(n => !n.read).length;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isPanelOpen: false,
  isLoading: true,
  error: null,
  unreadCount: 0,

  loadNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await fetchNotifications();
      set({ 
        notifications, 
        isLoading: false,
        unreadCount: calculateUnread(notifications)
      });
    } catch (error) {
      set({ isLoading: false, error: 'No se pudieron cargar las notificaciones.' });
    }
  },

  togglePanel: () => set(state => ({ isPanelOpen: !state.isPanelOpen })),
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),

  markAsRead: (id: string) => {
    set(state => {
      const updatedNotifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return { 
        notifications: updatedNotifications,
        unreadCount: calculateUnread(updatedNotifications)
      };
    });
  },

  markAllAsRead: () => {
    set(state => {
      const updatedNotifications = state.notifications.map(n => ({ ...n, read: true }));
      return { 
        notifications: updatedNotifications,
        unreadCount: 0
      };
    });
  },
  
  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set(state => {
      const updatedNotifications = [newNotification, ...state.notifications];
      return {
        notifications: updatedNotifications,
        unreadCount: calculateUnread(updatedNotifications)
      };
    });
  }
}));
