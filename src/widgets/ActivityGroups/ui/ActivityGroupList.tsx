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
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { CustomCard } from "~/shared/ui"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

type PrivateActivityListWidgetProps = {
  isPublic: false
  appletDetails: AppletDetailsDTO
  eventsDetails: AppletEventsResponse
}

type PublicActivityListWidgetProps = {
  isPublic: true
  publicAppletKey: string | null
  appletDetails: AppletDetailsDTO
  eventsDetails: AppletEventsResponse
}

type ActivityListWidgetProps = PublicActivityListWidgetProps | PrivateActivityListWidgetProps

type ResumeActivityState = {
  isOpen: boolean
  selectedActivity: ActivityListItem | null
}

type NavigateToActivityDetailsPageProps = {
  appletId: string
  activityId: string
  eventId: string
}

export const ActivityGroupList = (props: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigatator = useCustomNavigation()
  const navigateToActivityDetailsPage = (
    { appletId, activityId, eventId }: NavigateToActivityDetailsPageProps,
    options: { isRestart: boolean },
  ) => {
    if (props.isPublic && props.publicAppletKey) {
      return navigatator.navigate(
        ROUTES.publicActivityDetails.navigateTo(appletId, activityId, eventId, props.publicAppletKey),
        {
          state: {
            isRestart: options.isRestart,
          },
        },
      )
    }

    return navigatator.navigate(ROUTES.activityDetails.navigateTo(appletId, activityId, eventId), {
      state: {
        isRestart: options.isRestart,
      },
    })
  }

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [resumeActivityState, setResumeActivityState] = useState<ResumeActivityState>({
    isOpen: false,
    selectedActivity: null,
  })

  const { upsertGroupInProgress } = activityModel.hooks.useActivityGroupsInProgressState()

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const onResumeActivityModalClose = () => {
    setResumeActivityState({ isOpen: false, selectedActivity: null })
  }

  const { groups } = useActivityGroups(props.appletDetails, props.eventsDetails)

  const navigateToActivityDetailsWithEmptyProgress = (activity: ActivityListItem) => {
    const isActivityPipelineFlow = !!activity.activityFlowDetails
    const isInActivityFlow = activity.isInActivityFlow

    let activityPipelineDetails: ActivityOrFlowProgress | undefined

    if (isActivityPipelineFlow && isInActivityFlow) {
      activityPipelineDetails = {
        type: ActivityPipelineType.Flow,
        currentActivityId: activity.activityId,
        pipelineActivityOrder: 0, // Hardcoded because WEB APP not supported activity flow
      }
    } else {
      activityPipelineDetails = {
        type: ActivityPipelineType.Regular,
      }
    }

    upsertGroupInProgress({
      appletId: props.appletDetails.id,
      activityId: activity.activityId,
      eventId: activity.eventId,
      progressPayload: {
        ...activityPipelineDetails,
        startAt: new Date().toString(),
        endAt: null,
      },
    })

    return navigateToActivityDetailsPage(
      {
        appletId: props.appletDetails.id,
        activityId: activity.activityId,
        eventId: activity.eventId,
      },
      { isRestart: true },
    )
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
        {
          appletId: props.appletDetails.id,
          activityId: resumeActivityState.selectedActivity.activityId,
          eventId: resumeActivityState.selectedActivity.eventId,
        },
        { isRestart: false },
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
          {props.appletDetails && (
            <CustomCard
              type="card"
              id={props.appletDetails.id}
              title={props.appletDetails.displayName}
              imageSrc={props.appletDetails.image}
              buttonLabel={t("about")}
              buttonOnClick={onCardAboutClick}
            />
          )}
        </Col>
        <Col lg={7}>
          {groups
            ?.filter(g => g.activities.length)
            .map(g => (
              <ActivityGroup
                group={g}
                key={g.name}
                onActivityCardClick={onActivityCardClick}
                isPublic={props.isPublic}
              />
            ))}
        </Col>
      </Row>
      <CustomModal
        show={isAboutOpen}
        onHide={onAboutModalClose}
        title={t("about")}
        label={props.appletDetails?.about ? props.appletDetails.about : t("no_markdown")}
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
