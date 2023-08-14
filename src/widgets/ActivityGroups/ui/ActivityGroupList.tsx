import { useState } from "react"

import classNames from "classnames"
import { Col, Container, Row } from "react-bootstrap"

import CustomModal from "../../Modal"
import { useActivityGroups } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import { ActivityListItem, activityModel, EntityType } from "~/entities/activity"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { CustomCard } from "~/shared/ui"
import { useCustomNavigation, useCustomTranslation } from "~/shared/utils"

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
  entityId: string
  entityType: EntityType
  eventId: string
}

export const ActivityGroupList = (props: ActivityListWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigatator = useCustomNavigation()

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

  const navigateToEntity = ({ appletId, entityId, eventId, entityType }: NavigateToActivityDetailsPageProps) => {
    if (props.isPublic && props.publicAppletKey) {
      return navigatator.navigate(
        ROUTES.publicActivityDetails.navigateTo(appletId, entityId, eventId, entityType, props.publicAppletKey),
      )
    }

    return navigatator.navigate(ROUTES.activityDetails.navigateTo(appletId, entityId, eventId, entityType))
  }

  const startActivityOrFlow = ({ activityId, flowId, eventId }: ActivityListItem) => {
    if (flowId) {
      startFlow(props.appletDetails, flowId, eventId)

      return navigateToEntity({
        appletId: props.appletDetails.id,
        entityId: activityId,
        entityType: "flow",
        eventId: eventId,
      })
    } else {
      startActivity(props.appletDetails.id, activityId, eventId)

      return navigateToEntity({
        appletId: props.appletDetails.id,
        entityId: activityId,
        entityType: "regular",
        eventId: eventId,
      })
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
