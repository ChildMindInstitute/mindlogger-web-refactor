export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type Notification = {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
  createdAt: number;
};
