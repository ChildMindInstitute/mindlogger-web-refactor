import { useState } from "react"

import classNames from "classnames"
import { subMonths } from "date-fns"
import { Col, Container, Row } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups, useEntitiesSync } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import { ActivityListItem, EntityType, activityModel, useCompletedEntitiesQuery } from "~/entities/activity"

import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { CustomCard, Loader } from "~/shared/ui"
import { getYYYYDDMM, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

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
  flowId: string | null
  activityId: string
  entityType: EntityType
  eventId: string
}

export const ActivityGroupList = (props: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()

  const { data: completedEntities, isLoading: isCompletedEntitiesLoading } = useCompletedEntitiesQuery(
    {
      appletId: props.appletDetails.id,
      version: props.appletDetails.version,
      fromDate: getYYYYDDMM(subMonths(new Date(), 1)),
    },
    { select: data => data.data.result },
  )

  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const { groups } = useActivityGroups({
    appletDetails: props.appletDetails,
    eventsDetails: props.eventsDetails,
  })

  const { startActivity, startFlow } = activityModel.hooks.useStartEntity()

  const onCardAboutClick = () => {
    setIsAboutOpen(true)
  }

  const onAboutModalClose = () => {
    setIsAboutOpen(false)
  }

  const navigateToEntity = ({
    appletId,
    activityId,
    flowId,
    eventId,
    entityType,
  }: NavigateToActivityDetailsPageProps) => {
    if (props.isPublic && props.publicAppletKey) {
      return navigator.navigate(
        ROUTES.publicActivityDetails.navigateTo({
          appletId,
          activityId,
          eventId,
          entityType,
          publicAppletKey: props.publicAppletKey,
          flowId,
        }),
      )
    }

    return navigator.navigate(
      ROUTES.activityDetails.navigateTo({
        appletId,
        activityId,
        eventId,
        entityType,
        flowId,
      }),
    )
  }

  const startActivityOrFlow = ({ activityId, flowId, eventId }: ActivityListItem) => {
    if (flowId) {
      startFlow(props.appletDetails, flowId, eventId)

      return navigateToEntity({
        appletId: props.appletDetails.id,
        activityId,
        entityType: "flow",
        eventId: eventId,
        flowId,
      })
    } else {
      startActivity(props.appletDetails.id, activityId, eventId)

      return navigateToEntity({
        appletId: props.appletDetails.id,
        activityId,
        entityType: "regular",
        eventId: eventId,
        flowId: null,
      })
    }
  }

  useEntitiesSync({ completedEntities, appletId: props.appletDetails.id })

  if (isCompletedEntitiesLoading) {
    return <Loader />
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
                onActivityCardClick={startActivityOrFlow}
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
