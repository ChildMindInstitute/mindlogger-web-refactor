import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import { AppletDetailsDTO } from "~/shared/api"
import { CustomCard } from "~/shared/ui"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

interface ActivityListWidgetProps {
  appletDetails: AppletDetailsDTO
}

export const ActivityGroupList = ({ appletDetails }: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigatator = useCustomNavigation()

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isResumeActivityOpen, setIsResumeActivityOpen] = useState(false)

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const onResumeActivityModalClose = () => {
    setIsResumeActivityOpen(false)
  }

  const { groups } = useActivityGroups(appletDetails)

  const onActivityCardClick = (activityId: string) => {
    // Check if activityId exist in progress state
    // If yes, showResumeModal
    // if no - redirect to activity details page + add activity in progress

    navigatator.navigate(ROUTES.activityDetails.navigateTo(appletDetails.id, activityId))
  }

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
              <ActivityGroup group={g} key={g.name} onActivityCardClick={onActivityCardClick} />
            ))}
        </Col>
      </Row>
      <CustomModal
        show={isAboutOpen}
        onHide={onAboutModalClose}
        title={t("about")}
        label={appletDetails?.description}
      />
      <CustomModal
        show={isResumeActivityOpen}
        onHide={onResumeActivityModalClose}
        title={t("additional.resume_activity")}
        label={t("additional.activity_resume_restart")}
        footerPrimaryButton={t("additional.restart")}
        onPrimaryButtonClick={() => {
          console.log("restart")
        }}
        footerSecondaryButton={t("additional.resume")}
        onSecondaryButtonClick={() => {
          console.log("resume")
        }}
      />
    </Container>
  )
}
