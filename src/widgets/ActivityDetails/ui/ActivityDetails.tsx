import classNames from "classnames"
import { Container, Row, Col, Spinner } from "react-bootstrap"

import * as activityDetailsModel from "../model"
import { ActivityItemList } from "./ActivityItemList"
import { BackNavigateButton } from "./BackNavigateButton"

import { ActivityProgressPreviewList } from "~/entities/activity"
import { BaseProgressBar } from "~/shared/ui"
import CustomCard from "~/shared/ui/Card"

interface ActivityDetailsWidgetProps {
  appletId: string
  activityId: string
  eventId: string
}

export const ActivityDetailsWidget = (props: ActivityDetailsWidgetProps) => {
  const { appletDetails, activityDetails, isLoading } = activityDetailsModel.hooks.useActivityDetails({
    appletId: props.appletId,
    activityId: props.activityId,
  })

  if (isLoading) {
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <Spinner as="div" animation="border" role="status" aria-hidden="true" />
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={3}>
          <BackNavigateButton />
        </Col>
        <Col lg={9}>{!activityDetails?.showAllAtOnce && <BaseProgressBar percentage={30} />}</Col>
      </Row>
      <Row className="mt-2 activity">
        <Col xl={3}>
          <div className={classNames("d-flex", "justify-content-center")}>
            {appletDetails && (
              <CustomCard
                id={appletDetails.id}
                type="card"
                title={appletDetails.displayName}
                imageSrc={appletDetails.image}
                className={classNames("hover", "mb-4", "activity-details-card")}
              />
            )}
          </div>

          {appletDetails?.activities && <ActivityProgressPreviewList activities={appletDetails.activities} />}
        </Col>
        <Col xl={9}>
          {activityDetails && <ActivityItemList activityDetails={activityDetails} eventId={props.eventId} />}
        </Col>
      </Row>
    </Container>
  )
}
