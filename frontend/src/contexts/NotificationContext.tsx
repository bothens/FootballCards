import React, { createContext, useState, useContext, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  message: string;
  type: NotificationType;
  visible: boolean;
}

interface NotificationContextProps {
  showNotification: (message: string, type?: NotificationType) => void;
  notification: NotificationState;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    visible: false,
  });

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 4000); // Hide after 4 seconds
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
