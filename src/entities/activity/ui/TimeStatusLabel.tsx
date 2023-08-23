import { ActivityListItem, ActivityStatus } from "../lib"

import { convertToTimeOnNoun, useCustomTranslation } from "~/shared/utils"

interface TimeStatusLabelProps {
  activity: ActivityListItem
}

const TimeStatusLabel = ({ activity }: TimeStatusLabelProps) => {
  const { t } = useCustomTranslation()

  const isStatusScheduled = activity.status === ActivityStatus.Scheduled

  const isStatusAvailable = activity.status === ActivityStatus.Available

  const isStatusInProgress = activity.status === ActivityStatus.InProgress

  const hasAvailableFromTo = isStatusScheduled

  const hasAvailableToOnly = isStatusAvailable

  const hasTimeToComplete = isStatusInProgress && activity.isTimerSet && !!activity.timeLeftToComplete

  const convert = (date: Date): string => {
    const convertResult = convertToTimeOnNoun(date)
    if (convertResult.translationKey) {
      return t(convertResult.translationKey)
    } else {
      return convertResult.formattedDate!
    }
  }

  return (
    <>
      {hasAvailableFromTo && (
        <small>
          {`${t("activity_due_date.available")} ${convert(activity.availableFrom!)} ${t(
            "activity_due_date.to",
          )} ${convert(activity.availableTo!)}`}
        </small>
      )}

      {hasAvailableToOnly && <small>{`${t("activity_due_date.to")} ${convert(activity.availableTo!)}`}</small>}

      {hasTimeToComplete && <small>{`${t("time_to_complete_hm", activity.timeLeftToComplete!)}`}</small>}
    </>
  )
}

export default TimeStatusLabel
