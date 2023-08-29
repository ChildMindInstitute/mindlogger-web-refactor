import { ActivityPipelineType, activityModel } from "~/entities/activity"
import { useCustomTranslation } from "~/shared/utils"

type Props = {
  activityLength: number
  groupInProgress: activityModel.types.ProgressState | null
}

export const ActivityMetaData = ({ groupInProgress, activityLength }: Props) => {
  const { t } = useCustomTranslation()

  const isFlow = groupInProgress?.type === ActivityPipelineType.Flow

  const activityLengthLabel = t("question_count", { length: activityLength })

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
