import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row, Spinner } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useAppletByIdQuery } from "../api"

import { CustomCard } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityListWidgetProps {
  appletId: string | number
}

export const ActivityListWidget = ({ appletId }: ActivityListWidgetProps) => {
  const { t, language } = useCustomTranslation()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const {
    data: appletDetails,
    isError,
    isLoading,
  } = useAppletByIdQuery(appletId, {
    select: data => data.data.result,
  })

  if (isLoading) {
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <Spinner as="div" animation="border" role="status" aria-hidden="true" />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <span>
          You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
        </span>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row className={classNames("mt-5", "mb-3")}>
        <Col lg={3}>
          {appletDetails && (
            <CustomCard
              type="card"
              id={appletDetails.id}
              title={appletDetails.displayName}
              imageSrc={appletDetails.image}
              buttonLabel={t("about")}
              buttonOnClick={onCardAboutClick}
            />
          )}
        </Col>
        <Col lg={7}>
          {appletDetails.activities &&
            appletDetails.activities.map(activity => (
              // <ActivityItem key={activity.id} activity={activity as Activity} />
              <>Future implementation</>
            ))}
        </Col>
      </Row>
      <CustomModal
        show={isAboutOpen}
        onHide={onAboutModalClose}
        title={t("about")}
        label={appletDetails.about[language]}
      />
    </Container>
  )
}
