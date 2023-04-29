import classNames from "classnames"
import { Container, Spinner } from "react-bootstrap"

import "./styles.scss"

type LoaderProps = {
  defaultSize?: boolean
}

export const Loader = ({ defaultSize }: LoaderProps) => {
  return (
    <Container
      className={classNames(
        "d-flex",
        "w-100",
        "justify-content-center",
        "align-items-center",
        { "default-loader-height": defaultSize },
        { "h-100": !defaultSize },
      )}>
      <Spinner as="div" animation="border" role="status" aria-hidden="true" />
    </Container>
  )
}
