import { OverlayTrigger, Tooltip, Image } from "react-bootstrap"

import { Markdown } from "../Markdown"

import questionMark from "~/assets/question-mark.svg"
import "./style.scss"

type TooltipProps = {
  markdown: string
}

export const CustomTooltip = ({ markdown }: TooltipProps) => {
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 20000 }}
      overlay={
        <Tooltip id="button-tooltip">
          <Markdown markdown={markdown} />
        </Tooltip>
      }>
      <Image src={questionMark} className="tooltip-icon" />
    </OverlayTrigger>
  )
}
