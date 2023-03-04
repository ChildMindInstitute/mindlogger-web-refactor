import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import { ActivityListItem, activityModel, ActivityStatus } from "~/entities/activity"
import { AppletDetailsDTO, EventsByAppletIdResponseDTO } from "~/shared/api"
import { CustomCard } from "~/shared/ui"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

interface ActivityListWidgetProps {
  appletDetails: AppletDetailsDTO
  eventsDetails: EventsByAppletIdResponseDTO[]
}

export const ActivityGroupList = ({ appletDetails, eventsDetails }: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigatator = useCustomNavigation()

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isResumeActivityOpen, setIsResumeActivityOpen] = useState(false)

  const { pushActivityInProgress } = activityModel.hooks.useActivityInProgressState()

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const onResumeActivityModalClose = () => {
    setIsResumeActivityOpen(false)
  }

  const { groups } = useActivityGroups(appletDetails, eventsDetails)

  const onActivityCardClick = (activity: ActivityListItem) => {
    if (activity.status === ActivityStatus.InProgress) {
      setIsResumeActivityOpen(true)
    } else {
      pushActivityInProgress({
        appletId: appletDetails.id,
        activityId: activity.activityId,
        eventId: activity.eventId,
        startAt: new Date(),
        endAt: null,
      })
      navigatator.navigate(ROUTES.activityDetails.navigateTo(appletDetails.id, activity.activityId))
    }
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
