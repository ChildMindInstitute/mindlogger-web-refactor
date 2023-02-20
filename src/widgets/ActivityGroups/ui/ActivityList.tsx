import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row, Spinner } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import { CustomCard } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityListWidgetProps {
  appletId: string | number
}

export const ActivityGroupList = ({ appletId }: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const { groups, isLoading, isError, appletDetails } = useActivityGroups(String(appletId))

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
          {groups
            ?.filter(g => g.activities.length)
            .map(g => (
              <ActivityGroup group={g} key={g.name} />
            ))}
        </Col>
      </Row>
      <CustomModal
        show={isAboutOpen}
        onHide={onAboutModalClose}
        title={t("about")}
        label={appletDetails?.description}
      />
    </Container>
  )
}
