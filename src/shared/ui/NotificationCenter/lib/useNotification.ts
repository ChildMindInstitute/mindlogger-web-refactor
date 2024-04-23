import { v4 as uuidv4 } from 'uuid';

import { Notification, NotificationType } from './types';
import { useNotificationCenter } from './useNotificationCenter';

import { notificationCenterStore } from '~/shared/ui/NotificationCenter/lib/store';

type NotificationParams = {
  message: string;
  type: NotificationType;
  duration?: number;

  /**
   * If false, prevents the same notification from being added multiple times. Default is true.
   */
  allowDuplicate?: boolean;
};

type ShowNotificationOptions = Omit<NotificationParams, 'type' | 'message'>;

export const useNotification = () => {
  const notificationCenter = useNotificationCenter();

  const showNotification = (params: NotificationParams) => {
    const existingNotification = notificationCenterStore.notifications.find(
      (notification) =>
        notification.message === params.message && notification.type === params.type,
    );

    if (existingNotification && !params.allowDuplicate) {
      return;
    }

    const defaultDuration = 5000;

    const notification: Notification = {
      id: uuidv4(),
      message: params.message,
      type: params.type,
      duration: params.duration ?? defaultDuration,
      createdAt: Date.now(),
    };

    notificationCenter.addNotification(notification);

    return notification;
  };

  const showSuccessNotification = (message: string, options?: ShowNotificationOptions) => {
    return showNotification({ ...options, message, type: 'success' });
  };

  const showWarningNotification = (message: string, options?: ShowNotificationOptions) => {
    return showNotification({ ...options, message, type: 'warning' });
  };

  const showErrorNotification = (message: string, options?: ShowNotificationOptions) => {
    return showNotification({ ...options, message, type: 'error' });
  };

  const showInfoNotification = (message: string, options?: ShowNotificationOptions) => {
    return showNotification({ ...options, message, type: 'info' });
  };

  return {
    showSuccessNotification,
    showWarningNotification,
    showErrorNotification,
    showInfoNotification,
  };
};
