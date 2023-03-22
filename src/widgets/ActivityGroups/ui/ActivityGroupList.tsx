import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import {
  ActivityListItem,
  activityModel,
  ActivityOrFlowProgress,
  ActivityPipelineType,
  ActivityStatus,
} from "~/entities/activity"
import { AppletDetailsDTO, EventsByAppletIdResponseDTO } from "~/shared/api"
import { CustomCard } from "~/shared/ui"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

interface ActivityListWidgetProps {
  appletDetails: AppletDetailsDTO
  eventsDetails: EventsByAppletIdResponseDTO
}

type ResumeActivityState = {
  isOpen: boolean
  selectedActivity: ActivityListItem | null
}

export const ActivityGroupList = ({ appletDetails, eventsDetails }: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigatator = useCustomNavigation()
  const navigateToActivityDetailsPage = (appletId: string, activityId: string, eventId: string) => {
    return navigatator.navigate(ROUTES.activityDetails.navigateTo(appletId, activityId, eventId))
  }

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [resumeActivityState, setResumeActivityState] = useState<ResumeActivityState>({
    isOpen: false,
    selectedActivity: null,
  })

  const { upsertGroupInProgress } = activityModel.hooks.useGroupsInProgress()

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const onResumeActivityModalClose = () => {
    setResumeActivityState({ isOpen: false, selectedActivity: null })
  }

  const { groups } = useActivityGroups(appletDetails, eventsDetails)

  const navigateToActivityDetailsWithEmptyProgress = (activity: ActivityListItem) => {
    const isActivityPipelineFlow = !!activity.activityFlowDetails
    const isInActivityFlow = activity.isInActivityFlow

    let activityPipelineDetails: ActivityOrFlowProgress | undefined

    if (isActivityPipelineFlow && isInActivityFlow) {
      activityPipelineDetails = {
        type: ActivityPipelineType.Flow,
        currentActivityId: activity.activityId,
      }
    } else {
      activityPipelineDetails = {
        type: ActivityPipelineType.Regular,
      }
    }

    upsertGroupInProgress({
      appletId: appletDetails.id,
      activityId: activity.activityId,
      eventId: activity.eventId,
      progressPayload: {
        ...activityPipelineDetails,
        startAt: new Date(),
        endAt: null,
      },
    })

    return navigateToActivityDetailsPage(appletDetails.id, activity.activityId, activity.eventId)
  }

  const onActivityCardClick = (activity: ActivityListItem) => {
    if (activity.status === ActivityStatus.InProgress) {
      setResumeActivityState({ isOpen: true, selectedActivity: activity })
    } else {
      return navigateToActivityDetailsWithEmptyProgress(activity)
    }
  }

  const onActivityResume = () => {
    if (resumeActivityState.selectedActivity) {
      return navigateToActivityDetailsPage(
        appletDetails.id,
        resumeActivityState.selectedActivity.activityId,
        resumeActivityState.selectedActivity.eventId,
      )
    }
  }

  const onActivityRestart = () => {
    const { selectedActivity } = resumeActivityState

    if (selectedActivity?.activityId && selectedActivity?.eventId) {
      return navigateToActivityDetailsWithEmptyProgress(selectedActivity)
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
        show={resumeActivityState.isOpen}
        onHide={onResumeActivityModalClose}
        title={t("additional.resume_activity")}
        label={t("additional.activity_resume_restart")}
        footerPrimaryButton={t("additional.restart")}
        onPrimaryButtonClick={onActivityRestart}
        footerSecondaryButton={t("additional.resume")}
        onSecondaryButtonClick={onActivityResume}
      />
    </Container>
  )
}
