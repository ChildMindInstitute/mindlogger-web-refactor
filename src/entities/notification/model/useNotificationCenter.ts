import { actions, Notification } from "./notification.slice"

import { useAppDispatch } from "~/shared/utils"

export const useNotificationCenter = () => {
  const dispatch = useAppDispatch()

  const addNotification = (notification: Notification) => {
    dispatch(actions.add(notification))
  }

  const removeNotificationById = (id: string) => {
    dispatch(actions.removeById(id))
  }

  return {
    addNotification,
    removeNotificationById,
  }
}
