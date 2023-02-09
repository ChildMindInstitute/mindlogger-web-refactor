import { Activity, ActivityStatus } from "../lib"

import { useCustomTranslation } from "~/shared/utils"

interface TimeStatusLabelProps {
  activity: Activity
}

const TimeStatusLabel = ({ activity }: TimeStatusLabelProps) => {
  const { t } = useCustomTranslation()

  const isStatusScheduled = activity.status === ActivityStatus.Scheduled

  const isStatusPastDue = activity.status === ActivityStatus.PastDue

  const isStatusInProgress = activity.status === ActivityStatus.InProgress

  const hasSceduledAt =
    isStatusScheduled && activity.hasEventContext && !activity.isTimeoutAllow && activity.scheduledAt

  const hasAvailableFromTo =
    isStatusScheduled &&
    activity.hasEventContext &&
    activity.isTimeoutAllow &&
    activity.availableFrom &&
    activity.availableTo

  const hasAvailableToOnly = isStatusPastDue && activity.availableTo

  const hasTimeToComplete =
    (isStatusScheduled || isStatusPastDue || isStatusInProgress) &&
    activity.isTimedActivityAllow &&
    !!activity.timeToComplete

  return (
    <>
      {hasSceduledAt && <small>{`${t("activity_due_date.scheduled_at")} ${activity.scheduledAt}`}</small>}

      {hasAvailableFromTo && (
        <small>
          {`${t("activity_due_date.available")} ${activity.availableFrom} ${t("activity_due_date.to")} ${
            activity.availableTo
          }`}
        </small>
      )}

      {hasAvailableToOnly && <small>{`${t("activity_due_date.to")} ${activity.availableTo}`}</small>}

      {hasTimeToComplete && <small>{`${t("time_to_complete_hm", { ...activity.timeToComplete })}`}</small>}
    </>
  )
}

export default TimeStatusLabel
