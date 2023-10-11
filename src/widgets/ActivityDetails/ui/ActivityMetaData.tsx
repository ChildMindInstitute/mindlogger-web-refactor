import { ActivityPipelineType, activityModel } from "~/entities/activity"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  activityLength: number
  groupInProgress: activityModel.types.ProgressState | null
}

export const ActivityMetaData = ({ groupInProgress, activityLength }: Props) => {
  const { t } = useCustomTranslation()

  const isFlow = groupInProgress?.type === ActivityPipelineType.Flow

  const isActivitiesMoreThanOne = activityLength > 1

  const activityLengthLabel = isActivitiesMoreThanOne
    ? t("question_count_plural", { length: activityLength })
    : t("question_count_singular", { length: activityLength })

  if (!isFlow) {
    return <>{activityLengthLabel}</>
  }

  return (
    <>
      {`Activity ${groupInProgress.pipelineActivityOrder + 1} `}
      &bull;
      {` ${activityLengthLabel}`}
    </>
  )
}
