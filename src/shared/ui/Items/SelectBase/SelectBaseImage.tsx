import Avatar from "@mui/material/Avatar"

import { useCustomMediaQuery } from "../../../utils"

type Props = {
  src: string
}

export const SelectBaseImage = (props: Props) => {
  const { lessThanSM } = useCustomMediaQuery()

  const width = lessThanSM ? "44px" : "64px"
  const height = lessThanSM ? "44px" : "64px"

  return <Avatar src={props.src} sx={{ width, height }} variant="rounded" />
}
