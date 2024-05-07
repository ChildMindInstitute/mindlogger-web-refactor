import { Notification } from './types';

type Store = {
  notifications: Notification[];
};

export const notificationCenterStore: Store = {
  notifications: [],
};
