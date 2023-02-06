import { Activity } from "../lib"

import { useCustomTranslation } from "~/shared/utils"

interface TimeStatusLabelProps {
  activity: Activity
}

const TimeStatusLabel = ({ activity }: TimeStatusLabelProps) => {
  const { t } = useCustomTranslation()

  const isStatusScheduled = activity.status === "Scheduled"

  const isStatusPastDue = activity.status === "PastDue"

  const isStatusInProgress = activity.status === "InProgress"

  const hasSceduledAt = isStatusScheduled && activity.hasEventContext && !activity.isTimeoutAllow

  const hasAvailableFromTo = isStatusScheduled && activity.hasEventContext && activity.isTimeoutAllow

  const hasAvailableToOnly = isStatusPastDue

  const hasTimeToComplete =
    (isStatusScheduled || isStatusPastDue || isStatusInProgress) &&
    activity.isTimedActivityAllow &&
    !!activity.timeToComplete

  return (
    <>
      {hasSceduledAt && activity.scheduledAt && (
        <small>{`${t("activity_due_date.scheduled_at")} ${activity.scheduledAt}`}</small>
      )}

      {hasAvailableFromTo && activity.availableFrom && activity.availableTo && (
        <small>
          {`${t("activity_due_date.available")} ${activity.availableFrom} ${t("activity_due_date.to")} ${
            activity.availableTo
          }`}
        </small>
      )}

      {hasAvailableToOnly && activity.availableTo && (
        <small>{`${t("activity_due_date.to")} ${activity.availableTo}`}</small>
      )}

      {hasTimeToComplete && <small>{`${t("time_to_complete_hm", { ...activity.timeToComplete })}`}</small>}
    </>
  )
}

export default TimeStatusLabel
