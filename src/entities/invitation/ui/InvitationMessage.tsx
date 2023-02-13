import classNames from "classnames"

import "./style.scss"

interface InvitationMessageProps {
  message: string
}

export const InvitationMessage = ({ message }: InvitationMessageProps) => {
  return (
    <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
      <div className={"invitationMessage"}>{message}</div>
    </div>
  )
}
