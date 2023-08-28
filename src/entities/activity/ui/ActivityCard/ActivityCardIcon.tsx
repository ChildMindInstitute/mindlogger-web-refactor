import Box from "@mui/material/Box"

import ActivityDefaultIcon from "~/assets/activity-default-icon.svg"
import ActivityFlowDefaultIcon from "~/assets/activity-flow-default-icon.svg"
import { AvatarBase } from "~/shared/ui"

type Props = {
  isFlow: boolean
  src?: string | null
}

export const ActivityCardIcon = (props: Props) => {
  const defaultImage = props.isFlow ? ActivityFlowDefaultIcon : ActivityDefaultIcon

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="64px">
      {props.src ? (
        <AvatarBase src={props.src} name="" width="64px" height="64px" />
      ) : (
        <AvatarBase src={defaultImage} name="" width="64px" height="64px" />
      )}
    </Box>
  )
}
