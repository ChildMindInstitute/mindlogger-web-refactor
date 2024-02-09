import { useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';

import { NotificationAnimation } from './NotificationAnimation';
import { notificationCenterStore } from '../lib/store';
import { Notification as TNotification } from '../lib/types';

import { eventEmitter, useForceUpdate } from '~/shared/utils';

export const NotificationCenter = () => {
  const forceUpdate = useForceUpdate();
  const refMap: WeakMap<TNotification, HTMLDivElement> = useMemo(() => new WeakMap(), []); // Collect refs for each notification element to calculate their height

  const onNotificationAdded = useCallback(
    (notification: Record<string, unknown> | undefined) => {
      notificationCenterStore.notifications = [...notificationCenterStore.notifications, notification as TNotification];

      forceUpdate();
    },
    [forceUpdate],
  );

  const onNotificationRemoved = useCallback(
    (data: Record<string, unknown> | undefined) => {
      notificationCenterStore.notifications = notificationCenterStore.notifications.filter(
        (notif) => notif.id !== data?.notificationId,
      );
      forceUpdate();
    },
    [forceUpdate],
  );

  useEffect(() => {
    eventEmitter.on('onNotificationAdded', onNotificationAdded);
    eventEmitter.on('onNotificationRemoved', onNotificationRemoved);

    return () => {
      eventEmitter.off('onNotificationAdded', onNotificationAdded);
      eventEmitter.off('onNotificationRemoved', onNotificationRemoved);
    };
  }, [onNotificationAdded, onNotificationRemoved]);

  return (
    <Box id="app-notification-container" width="100%">
      <NotificationAnimation notifications={notificationCenterStore.notifications} refMap={refMap} />
    </Box>
  );
};
