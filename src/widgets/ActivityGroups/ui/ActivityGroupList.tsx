import { useState } from "react"

import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { subMonths } from "date-fns"

import { CustomModal } from "../../Modal"
import { useActivityGroups, useEntitiesSync } from "../model/hooks"
import { ActivityGroup } from "./ActivityGroup"

import AppletDefaultIcon from "~/assets/AppletDefaultIcon.svg"
import { ActivityListItem, EntityType, activityModel, useCompletedEntitiesQuery } from "~/entities/activity"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { AvatarBase } from "~/shared/ui"
import Loader from "~/shared/ui/Loader"
import { Mixpanel, formatToDtoDate, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

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

  const { data: completedEntities, isFetching: isCompletedEntitiesFetching } = useCompletedEntitiesQuery(
    {
      appletId: props.appletDetails.id,
      version: props.appletDetails.version,
      fromDate: formatToDtoDate(subMonths(new Date(), 1)),
    },
    { select: data => data.data.result, enabled: !props.isPublic },
  )

  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const isAppletAboutExist = props.appletDetails?.about
  const isAppletImageExist = Boolean(props.appletDetails?.image)

  const { groups } = useActivityGroups({
    appletDetails: props.appletDetails,
    eventsDetails: props.eventsDetails,
  })

  const { startActivity, startFlow } = activityModel.hooks.useStartEntity()

  const onCardAboutClick = () => {
    if (!isAppletAboutExist) {
      return
    }

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
    Mixpanel.track("Assessment Started")

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

  if (isCompletedEntitiesFetching) {
    return <Loader />
  }

  return (
    <Container sx={{ flex: "1" }}>
      <Box display="flex" gap="16px" marginTop="24px" alignItems="center">
        <AvatarBase
          src={isAppletImageExist ? props.appletDetails.image : AppletDefaultIcon}
          name={props.appletDetails.displayName}
          width="48px"
          height="48px"
          variant="rounded"
          data-testid="applet-image"
        />
        <Typography
          variant="h4"
          onClick={onCardAboutClick}
          data-testid="applet-name"
          sx={{
            fontFamily: "Atkinson",
            fontSize: "22px",
            fontWeight: 400,
            lineHeight: "28px",
            fontStyle: "normal",
            cursor: isAppletAboutExist ? "pointer" : "default",
          }}>
          {props.appletDetails.displayName}
        </Typography>
      </Box>

      <Box>
        {groups
          ?.filter(g => g.activities.length)
          .map(g => (
            <ActivityGroup group={g} key={g.name} onActivityCardClick={startActivityOrFlow} isPublic={props.isPublic} />
          ))}
      </Box>
      <CustomModal
        show={isAboutOpen}
        onHide={onAboutModalClose}
        title={t("about")}
        label={props.appletDetails?.about ? props.appletDetails.about : t("no_markdown")}
      />
    </Container>
  )
}
