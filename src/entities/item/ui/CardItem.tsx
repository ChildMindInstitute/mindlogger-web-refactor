import { PropsWithChildren } from "react"

import classNames from "classnames"
import { Card, Col, Image, Row } from "react-bootstrap"

import { mockMarkdown } from "../lib/mockMarkDown"
import { CardItemNavigator } from "./CardItemNavigator"

import { Markdown } from "~/shared/ui"

import "./style.scss"

interface CardItemProps extends PropsWithChildren {
  watermark?: string
  isInvalid?: boolean
}

export const CardItem = ({ watermark, isInvalid, children }: CardItemProps) => {
  return (
    <Card className={classNames("mb-3", "px-3", { invalid: isInvalid })}>
      <Row className={classNames("no-gutters")}>
        <Col md={12}>
          <Card.Title>
            {watermark && <Image src={watermark} alt="watermark" rounded className={classNames("watermark")} />}
            <div className={classNames("markdown")}>
              <Markdown markdown={mockMarkdown} />
            </div>
          </Card.Title>
          <Card.Body>
            <Row className="no-gutters px-4 py-4">{children}</Row>
          </Card.Body>
        </Col>
      </Row>

      <CardItemNavigator
        isBackButtonShown={true}
        onBackButtonClick={() => {}}
        isNextButtonShown={true}
        onNextButtonClick={() => {}}
      />
    </Card>
  )
}
