import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

export const Notification: React.FC = () => {
  const { notification } = useNotification();
  const { message, type, visible } = notification;

  const baseStyle = 
    'fixed top-5 right-5 p-4 rounded-ui-md text-sm font-bold z-[100] transition-all duration-300 transform';
  
  const typeStyles = {
    success: 'bg-primary text-text-inverted',
    error: 'bg-danger text-text-inverted',
    info: 'bg-surface-200 text-text dark:bg-zinc-700 dark:text-white',
  };

  const visibilityStyle = visible 
    ? 'opacity-100 translate-x-0' 
    : 'opacity-0 translate-x-10';

  return (
    <div className={`${baseStyle} ${typeStyles[type]} ${visibilityStyle}`}>
      {message}
    </div>
  );
};
