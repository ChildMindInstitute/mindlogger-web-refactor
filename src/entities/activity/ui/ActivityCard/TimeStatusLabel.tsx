import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import { SxProps, Theme as MuiTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { addDays, startOfDay } from "date-fns"

import { ActivityListItem, ActivityStatus } from "../../lib"

import ClockIcon from "~/assets/Clock.svg"
import { Theme } from "~/shared/constants"
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

  const tomorrow = addDays(startOfDay(new Date()), 1)

  const isSpreadToNextDay = !!activity.availableTo && activity.availableTo > tomorrow

  const isEntityAlwaysAvailable = activity.isAlwaysAvailable

  const formatDate = (date: Date): string => {
    const convertResult = convertToTimeOnNoun(date)
    if (convertResult.translationKey) {
      return t(convertResult.translationKey)
    } else {
      return convertResult.formattedDate!
    }
  }

  const timeStatusLabelSx: SxProps<MuiTheme> = {
    fontFamily: "Atkinson",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "0.15px",
    color: Theme.colors.light.onSurfaceVariant,
  }

  if (isEntityAlwaysAvailable) {
    return <></>
  }

  if (hasAvailableFromTo) {
    return (
      <Box display="flex" alignItems="center" gap="8px">
        <Avatar src={ClockIcon} sx={{ width: "24px", height: "24px" }} />
        <Typography variant="body1" sx={timeStatusLabelSx}>
          {`${t("activity_due_date.available")} ${formatDate(activity.availableFrom!)} ${t(
            "activity_due_date.to",
          )} ${formatDate(activity.availableTo!)} ${isSpreadToNextDay ? t("activity_due_date.the_following_day") : ""}`}
        </Typography>
      </Box>
    )
  }

  if (hasAvailableToOnly) {
    return (
      <Box display="flex" alignItems="center" gap="8px">
        <Avatar src={ClockIcon} sx={{ width: "24px", height: "24px" }} />
        <Typography variant="body1" sx={timeStatusLabelSx}>{`${t("activity_due_date.to")} ${formatDate(
          activity.availableTo!,
        )} ${isSpreadToNextDay ? t("activity_due_date.the_following_day") : ""}`}</Typography>
      </Box>
    )
  }

  if (hasTimeToComplete) {
    return (
      <Box display="flex" alignItems="center" gap="8px">
        <Avatar src={ClockIcon} sx={{ width: "24px", height: "24px" }} />

        <Typography variant="body1" sx={timeStatusLabelSx}>{`${t(
          "time_to_complete_hm",
          activity.timeLeftToComplete!,
        )}`}</Typography>
      </Box>
    )
  }

  return <></>
}

export default TimeStatusLabel
