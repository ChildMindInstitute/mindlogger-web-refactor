import { BaseProgressBar } from "~/shared/ui"

interface ActivityProgressPreviewCardProps {
  title: string
  progress: number
}

export const ActivityProgressPreviewCard = ({ title, progress = 0 }: ActivityProgressPreviewCardProps) => {
  return (
    <div key={title} className="my-2 rounded border w-h p-2 text-center bg-white">
      <div className="mb-2">{title}</div>
      <BaseProgressBar percentage={progress} />
    </div>
  )
}
