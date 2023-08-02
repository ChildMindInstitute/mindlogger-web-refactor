import { useActivityEventProgressState } from "../model/hooks"

import { BaseProgressBar } from "~/shared/ui"

interface ActivityProgressPreviewCardProps {
  title: string
  activityId: string
  eventId: string
}

// TODO: Remove this component in the future
// Deprecated component; Keep it for now

export const ActivityProgressPreviewCard = ({ title, activityId, eventId }: ActivityProgressPreviewCardProps) => {
  const { progress } = useActivityEventProgressState({ activityId, eventId })

  return (
    <div key={title} className="my-2 rounded border w-h p-2 text-center bg-white">
      <div className="mb-2">{title}</div>
      <BaseProgressBar percentage={progress} />
    </div>
  )
}
