import { NotificationType } from "../model"
import { ErrorNotification } from "./ErrorNotification"
import { SuccessNotification } from "./SuccessNotification"
import { WarningNotification } from "./WarningNotification"

type Props = {
  id: string
  message: string
  type: NotificationType
}

export const Notification = ({ id, message, type }: Props) => {
  switch (type) {
    case "success":
      return <SuccessNotification id={id} message={message} />
    case "error":
      return <ErrorNotification id={id} message={message} />
    case "warning":
      return <WarningNotification id={id} message={message} />
    case "info":
      return <SuccessNotification id={id} message={message} />
    default:
      return <SuccessNotification id={id} message={message} />
  }
}
