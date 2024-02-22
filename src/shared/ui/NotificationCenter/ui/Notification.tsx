import { forwardRef, useEffect } from "react"

import { ErrorNotification } from "./ErrorNotification"
import { SuccessNotification } from "./SuccessNotification"
import { WarningNotification } from "./WarningNotification"
import { NotificationType } from "../lib/types"

import { eventEmitter } from "~/shared/utils"

type Props = {
  id: string
  message: string
  type: NotificationType
  duration: number
}

export const Notification = forwardRef<HTMLDivElement, Props>(({ id, message, type, duration }: Props, ref) => {
  useEffect(() => {
    setTimeout(() => {
      eventEmitter.emit("onNotificationRemoved", { notificationId: id })
    }, duration)
  }, [duration, id])

  switch (type) {
    case "success":
      return <SuccessNotification ref={ref} id={id} message={message} duration={duration} />
    case "error":
      return <ErrorNotification ref={ref} id={id} message={message} duration={duration} />
    case "warning":
      return <WarningNotification ref={ref} id={id} message={message} duration={duration} />
    case "info":
      return <SuccessNotification ref={ref} id={id} message={message} duration={duration} />
    default:
      return <SuccessNotification ref={ref} id={id} message={message} duration={duration} />
  }
})
