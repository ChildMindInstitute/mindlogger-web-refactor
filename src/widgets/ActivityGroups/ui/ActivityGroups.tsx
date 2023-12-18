import { ActivityGroupList } from "./ActivityGroupList"

import { useAppletByIdQuery } from "~/entities/applet"
import { useEventsbyAppletIdQuery } from "~/entities/event"
import { Container, Loader } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

type FetchPublicActivitiesProps = {
  isPublic: true
  publicAppletKey: string
}

type FetchPrivateActivitiesProps = {
  isPublic: false
  appletId: string
}

type FetchActivitiesProps = FetchPublicActivitiesProps | FetchPrivateActivitiesProps

export const ActivityGroups = (props: FetchActivitiesProps) => {
  const { t } = useCustomTranslation()

  const { isError: isAppletError, isLoading: isAppletLoading, data: appletData } = useAppletByIdQuery(props)
  const { isError: isEventsError, isLoading: isEventsLoading, data: eventsData } = useEventsbyAppletIdQuery(props)

  if (isAppletLoading || isEventsLoading) {
    return <Loader />
  }

  if (isEventsError || isAppletError) {
    return (
      <Container
        sx={{ display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
        <span>{t("additional.invalid_public_url")}</span>
      </Container>
    )
  }

  const appletDetails = appletData?.data?.result
  const eventsDetails = eventsData?.data?.result

  return (
    appletDetails && (
      <ActivityGroupList
        appletDetails={appletDetails}
        eventsDetails={eventsDetails}
        isPublic={props.isPublic}
        publicAppletKey={props.isPublic ? props.publicAppletKey : null}
      />
    )
  )
}
