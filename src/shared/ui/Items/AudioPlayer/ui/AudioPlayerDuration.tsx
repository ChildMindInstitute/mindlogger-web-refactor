import Box from "@mui/material/Box"

import { Text } from "../../../Typography"

import { useCustomMediaQuery } from "~/shared/utils"

type Props = {
  currentDuration: string
  totalDuration: string
}

export const AudioPlayerDuration = ({ currentDuration, totalDuration }: Props) => {
  const { lessThanSM } = useCustomMediaQuery()

  const fontSize = lessThanSM ? "12px" : "14px"

  const width = lessThanSM ? "75px" : "100px"

  return (
    <Box width={width}>
      <Text fontSize={fontSize} sx={{ cursor: "default" }}>{`${currentDuration} / ${totalDuration}`}</Text>
    </Box>
  )
}
