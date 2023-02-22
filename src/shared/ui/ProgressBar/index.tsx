import { ProgressBar } from "react-bootstrap"

interface BaseProgressBarProps {
  percentage: number
}

export const BaseProgressBar = ({ percentage }: BaseProgressBarProps) => {
  return (
    <div className="bg-white p-2">
      <ProgressBar striped className="mb-2" now={percentage} variant="primary" />
    </div>
  )
}
