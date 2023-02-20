import classNames from "classnames"
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap"
import { ArrowLeft } from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom"

import { AllActivityStatusMap } from "./AllActivityStatusMap"

import { BasicButton } from "~/shared/ui"
import CustomCard from "~/shared/ui/Card"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityDetailsWidgetProps {
  appletId: string
  activityId: string
}

export const ActivityDetailsWidget = ({ appletId, activityId }: ActivityDetailsWidgetProps) => {
  const { t } = useCustomTranslation()
  const navigate = useNavigate()

  const isOnePageAssessment = false // Mock
  const isSummaryScreen = true // Mock
  const percentage = 35 // Mock

  const mockActivityStatus = [
    { label: "activity 1", percentage: 20 },
    { label: "activity 2", percentage: 0 },
    { label: "activity 3", percentage: 70 },
  ] // Mock

  const onBackButtonClick = () => {
    navigate(-1)
  }

  return (
    <Container>
      <Row className="mt-5">
        <Col className="" xl={3}>
          <BasicButton variant="primary" className="mb-2 d-flex align-items-center" onClick={onBackButtonClick}>
            <ArrowLeft className="me-1" />
            {t("Consent.back")}
          </BasicButton>
        </Col>
        {!isOnePageAssessment && (
          <Col xl={9}>
            <Card className="bg-white p-2">
              <ProgressBar striped className="mb-2" now={percentage} variant="primary" />
            </Card>
          </Col>
        )}
      </Row>
      <Row className="mt-2 activity">
        <Col xl={3}>
          <div className={classNames("d-flex", "justify-content-center")}>
            <CustomCard
              id={"someid"}
              type="card"
              title={"title"}
              imageSrc={"https://picsum.photos/200"}
              className={classNames("hover", "mb-4", "activity-details-card")}
            />
          </div>

          {/* Ask BA what is it? */}
          {/* {headers.map(itemHeader => (
            <div className="mx-4">
              {itemHeader.headerName && (
                <div onClick={() => selectHeader(itemHeader.id)} className="mt-1 header-text">
                  {itemHeader.headerName}
                </div>
              )}
              {itemHeader.sectionName && (
                <div onClick={() => selectHeader(itemHeader.id)} className="ml-4 section-text">
                  {` - ${itemHeader.sectionName}`}
                </div>
              )}
            </div>
          ))} */}

          <AllActivityStatusMap activityStatus={mockActivityStatus} />
        </Col>
        <Col xl={9}>
          {/* Should be implemented after ITEMs */}
          {/* {isSummaryScreen && <ActivitySummary />} */}
          {/* {!isSummaryScreen && isOnePageAssessment && items} */}
          {/* {!isSummaryScreen && !isOnePageAssessment && _.map(items.slice(0, availableItems).reverse())} */}
        </Col>
      </Row>
    </Container>
  )
}
