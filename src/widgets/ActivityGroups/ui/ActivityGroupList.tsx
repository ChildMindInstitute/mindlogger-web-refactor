import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import { AppletDetailsDto } from "~/shared/api"
import { CustomCard } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityListWidgetProps {
  appletDetails?: AppletDetailsDto
}

export const ActivityGroupList = ({ appletDetails }: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const { groups } = useActivityGroups(appletDetails)

  return (
    <Container fluid>
      <Row className={classNames("mt-5", "mb-3")}>
        <Col lg={3} className={classNames("d-flex", "justify-content-center")}>
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
