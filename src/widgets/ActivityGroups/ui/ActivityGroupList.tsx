import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import { ActivityListItem, activityModel, ActivityOrFlowProgress, ActivityPipelineType } from "~/entities/activity"
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

type NavigateToActivityDetailsPageProps = {
  appletId: string
  activityId: string
  eventId: string
}

export const ActivityGroupList = (props: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigatator = useCustomNavigation()

  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const { upsertGroupInProgress } = activityModel.hooks.useActivityGroupsInProgressState()
  const { getGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()
  const { groups } = useActivityGroups({
    appletDetails: props.appletDetails,
    eventsDetails: props.eventsDetails,
  })

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const navigateToActivityDetailsPage = ({ appletId, activityId, eventId }: NavigateToActivityDetailsPageProps) => {
    if (props.isPublic && props.publicAppletKey) {
      return navigatator.navigate(
        ROUTES.publicActivityDetails.navigateTo(appletId, activityId, eventId, props.publicAppletKey),
      )
    }

    return navigatator.navigate(ROUTES.activityDetails.navigateTo(appletId, activityId, eventId))
  }

  const onActivityCardClick = (activity: ActivityListItem) => {
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

    const groupInProgressById = getGroupInProgressByIds({
      appletId: props.appletDetails.id,
      eventId: activity.eventId,
      activityId: activity.activityId,
    })

    upsertGroupInProgress({
      appletId: props.appletDetails.id,
      activityId: activity.activityId,
      eventId: activity.eventId,
      progressPayload: {
        ...activityPipelineDetails,
        startAt: groupInProgressById ? groupInProgressById.startAt : Date.now(),
        endAt: null,
      },
    })

    return navigateToActivityDetailsPage({
      appletId: props.appletDetails.id,
      activityId: activity.activityId,
      eventId: activity.eventId,
    })
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
    </Container>
  )
}
