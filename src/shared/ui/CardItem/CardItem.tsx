import { PropsWithChildren, ReactNode } from "react"

import classNames from "classnames"
import { Card, Col, Image, Row } from "react-bootstrap"

import { Markdown } from "~/shared/ui"

import "./style.scss"

interface CardItemProps extends PropsWithChildren {
  watermark?: string
  isInvalid?: boolean
  buttons?: ReactNode
  markdown: string
}

export const CardItem = ({ watermark, isInvalid, children, buttons, markdown }: CardItemProps) => {
  return (
    <Card className={classNames("mb-3", "px-3", { invalid: isInvalid })}>
      <Row className={classNames("no-gutters")}>
        <Col md={12}>
          <Card.Title className={classNames("question")}>
            {watermark && <Image src={watermark} alt="watermark" rounded className={classNames("watermark")} />}
            <div className={classNames("markdown")}>
              <Markdown markdown={markdown} />
            </div>
          </Card.Title>
          <Card.Body>
            <Row className="no-gutters px-4 py-4">{children}</Row>
          </Card.Body>
        </Col>
      </Row>

      {buttons}
    </Card>
  )
}
