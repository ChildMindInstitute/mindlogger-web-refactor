import { ProgressBar } from "react-bootstrap"

interface AllActivityStatusMapProps {
  activityStatus: Array<{
    label: string
    percentage: number
  }>
}

export const AllActivityStatusMap = ({ activityStatus }: AllActivityStatusMapProps) => {
  return (
    <div>
      {activityStatus.map(status => (
        <div key={status.label} className="my-2 rounded border w-h p-2 text-center bg-white">
          <div className="mb-2">{status.label}</div>
          <ProgressBar className="mb-2" now={status.percentage} variant="primary" />
        </div>
      ))}
    </div>
  )
}
