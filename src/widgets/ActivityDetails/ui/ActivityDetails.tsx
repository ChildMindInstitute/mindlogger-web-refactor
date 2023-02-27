import classNames from "classnames"
import { Container, Row, Col, Spinner } from "react-bootstrap"

import { mockActivityList } from "../lib/activityList.mock"
import { useActivityDetails } from "../lib/useActivityDetails"
import { ActivityItemList } from "./ActivityItemList"
import { BackNavigateButton } from "./BackNavigateButton"

import { ActivityProgressPreviewList } from "~/entities/activity"
import { BaseProgressBar } from "~/shared/ui"
import CustomCard from "~/shared/ui/Card"

interface ActivityDetailsWidgetProps {
  appletId: string
  activityId: string
}

export const ActivityDetailsWidget = (props: ActivityDetailsWidgetProps) => {
  const { appletDetails, activityDetails, isLoading } = useActivityDetails({
    appletId: props.appletId,
    activityId: "30",
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

          <ActivityProgressPreviewList activities={mockActivityList} />
        </Col>
        <Col xl={9}>
          <ActivityItemList activityDetails={mockActivityList[0]} />
        </Col>
      </Row>
    </Container>
  )
}
