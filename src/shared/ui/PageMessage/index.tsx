import classNames from "classnames"

import "./style.scss"

interface PageMessageProps {
  message: string
}

export const PageMessage = ({ message }: PageMessageProps) => {
  return (
    <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
      <div className={"page-message"}>{message}</div>
    </div>
  )
}
