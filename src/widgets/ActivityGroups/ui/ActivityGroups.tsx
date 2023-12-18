import classNames from "classnames"
import { Container, Spinner } from "react-bootstrap"

import { ActivityGroupList } from "./ActivityGroupList"

import { useAppletByIdQuery } from "~/entities/applet"
import { useEventsbyAppletIdQuery } from "~/entities/event"
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
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <Spinner as="div" animation="border" role="status" aria-hidden="true" />
      </Container>
    )
  }

  if (isEventsError || isAppletError) {
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <span>{t("additional.invalid_public_url")}</span>
      </Container>
    )
  }

  const appletDetails = appletData?.data?.result
  appletDetails.integrations = ["loris"] // mock integration - REMOVE BEFORE MERGING

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
