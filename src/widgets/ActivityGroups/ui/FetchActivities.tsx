import classNames from "classnames"
import { Container, Spinner } from "react-bootstrap"

import { useAppletByIdQuery } from "../api"
import { ActivityGroupList } from "./ActivityGroupList"

type FetchPublicActivitiesProps = {
  isPublic: true
  publicAppletKey: string
}

type FetchPrivateActivitiesProps = {
  isPublic: false
  appletId: string
}

type FetchActivitiesProps = FetchPublicActivitiesProps | FetchPrivateActivitiesProps

export const FetchActivities = (props: FetchActivitiesProps) => {
  const { isError, isLoading, data, error } = useAppletByIdQuery(props)

  if (isLoading) {
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <Spinner as="div" animation="border" role="status" aria-hidden="true" />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <span>{error.evaluatedMessage}</span>
      </Container>
    )
  }

  return <ActivityGroupList appletDetails={data?.data?.result} />
}
