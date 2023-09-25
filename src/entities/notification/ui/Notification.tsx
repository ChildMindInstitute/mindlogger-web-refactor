import { NotificationType } from "../model"
import { ErrorNotification } from "./ErrorNotification"
import { SuccessNotification } from "./SuccessNotification"
import { WarningNotification } from "./WarningNotification"

type Props = {
  id: string
  message: string
  type: NotificationType
  duration: number
}

export const Notification = ({ id, message, type, duration }: Props) => {
  switch (type) {
    case "success":
      return <SuccessNotification id={id} message={message} duration={duration} />
    case "error":
      return <ErrorNotification id={id} message={message} duration={duration} />
    case "warning":
      return <WarningNotification id={id} message={message} duration={duration} />
    case "info":
      return <SuccessNotification id={id} message={message} duration={duration} />
    default:
      return <SuccessNotification id={id} message={message} duration={duration} />
  }
}
