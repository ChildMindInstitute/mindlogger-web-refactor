import classNames from "classnames"
import { Container, Row, Col } from "react-bootstrap"

import { ActivityCardItemList } from "../../../entities/item/ui/ActivityCardItemList"
import { useAppletByIdQuery } from "../../ActivityGroups"
import { mockActivityList } from "../lib/activityList.mock"

import { ActivityProgressPreviewList } from "~/entities/activity"
import CustomCard from "~/shared/ui/Card"

interface ActivityDetailsWidgetProps {
  appletId: string
  activityId: string
}

export const ActivityDetailsWidget = ({ appletId, activityId }: ActivityDetailsWidgetProps) => {
  const { data } = useAppletByIdQuery({ isPublic: false, appletId })

  const appletDetails = data?.data?.result

  const isOnePageAssessment = true // Mock
  const isSummaryScreen = false // Mock

  return (
    <Container>
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
          {/* Should be implemented after ITEMs */}
          {/* {isSummaryScreen && <ActivitySummary />} */}
          {!isSummaryScreen && isOnePageAssessment && <ActivityCardItemList />}
          {/* {!isSummaryScreen && !isOnePageAssessment && _.map(items.slice(0, availableItems).reverse())} */}
        </Col>
      </Row>
    </Container>
  )
}
