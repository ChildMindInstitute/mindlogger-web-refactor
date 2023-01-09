import { Container } from "react-bootstrap"
import classNames from "classnames"

import "./styles.scss"

interface ErrorLabelProps {
  errorMessage?: string | null
  successMessage?: string | null
}

export const DisplaySystemMessage = ({ errorMessage, successMessage }: ErrorLabelProps) => {
  return (
    <Container className={classNames("system-message-box")}>
      {errorMessage && <span className={classNames("system-message-label", "failed-message")}>{errorMessage}</span>}

      {successMessage && (
        <span className={classNames("system-message-label", "success-message")}>{successMessage}</span>
      )}
    </Container>
  )
}
