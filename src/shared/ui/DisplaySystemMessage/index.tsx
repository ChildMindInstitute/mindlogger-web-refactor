import { Container } from "../Container"

import "./styles.scss"

interface ErrorLabelProps {
  errorMessage?: string | null
  successMessage?: string | null
}

export const DisplaySystemMessage = ({ errorMessage, successMessage }: ErrorLabelProps) => {
  return (
    <Container className="system-message-box">
      {errorMessage && <span className="system-message-label failed-message">{errorMessage}</span>}

      {successMessage && <span className="system-message-label success-message">{successMessage}</span>}
    </Container>
  )
}
