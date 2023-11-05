import { useMemo } from "react"

import classNames from "classnames"
import { Container, Row, Col, Spinner } from "react-bootstrap"
import { useLocation } from "react-router-dom"

import * as activityDetailsModel from "../model"
import { ActivityItemList } from "./ActivityItemList"
import { BackNavigateButton } from "./BackNavigateButton"

import { activityModel, ActivityProgressPreviewList } from "~/entities/activity"
import { BaseProgressBar } from "~/shared/ui"
import CustomCard from "~/shared/ui/Card"
import { useCustomTranslation } from "~/shared/utils"

type PrivateActivityDetailsWidgetProps = {
  isPublic: false

  appletId: string
  activityId: string
  eventId: string
}

type PublicActivityDetailsWidgetProps = {
  isPublic: true

  appletId: string
  activityId: string
  eventId: string

  publicAppletKey: string
}

type WidgetProps = PrivateActivityDetailsWidgetProps | PublicActivityDetailsWidgetProps

export const ActivityDetailsWidget = (props: WidgetProps) => {
  const location = useLocation()
  const isRestart = location.state?.isRestart ?? false

  const { t } = useCustomTranslation()

  const { appletDetails, activityDetails, eventsRawData, isLoading, isError, error, respondentMeta } =
    activityDetailsModel.hooks.useActivityDetails(props, {
      isRestart,
    })

  const { progress } = activityModel.hooks.useActivityEventProgressState({
    activityId: props.activityId,
    eventId: props.eventId,
  })

  const activityProgressPreviewList = useMemo(() => {
    if (!appletDetails?.activities) {
      return []
    }

    return appletDetails.activities.filter(x => !x.isOnePageAssessment && x.activityId !== props.activityId)
  }, [appletDetails?.activities, props.activityId])

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
        <span>{props.isPublic ? t("additional.invalid_public_url") : error?.evaluatedMessage}</span>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={3}>
          <BackNavigateButton />
        </Col>
        <Col lg={9}>{!activityDetails?.showAllAtOnce && <BaseProgressBar percentage={progress} />}</Col>
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

          {activityProgressPreviewList && <ActivityProgressPreviewList activities={activityProgressPreviewList} />}
        </Col>
        <Col xl={9}>
          {activityDetails && appletDetails ? (
            <ActivityItemList
              appletDetails={appletDetails}
              eventId={props.eventId}
              eventsRawData={eventsRawData}
              activityDetails={activityDetails}
              isPublic={props.isPublic}
              publicAppletKey={props.isPublic ? props.publicAppletKey : undefined}
              respondentMeta={respondentMeta}
            />
          ) : (
            <>Data fetching error</>
          )}
        </Col>
      </Row>
    </Container>
  )
}
