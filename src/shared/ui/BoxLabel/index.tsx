import "./style.scss"

type BoxLabelProps = {
  message: string
}

export const BoxLabel = ({ message }: BoxLabelProps) => {
  return (
    <div className="box-label-wrapper">
      <div className="box-label-content">{message}</div>
    </div>
  )
}
