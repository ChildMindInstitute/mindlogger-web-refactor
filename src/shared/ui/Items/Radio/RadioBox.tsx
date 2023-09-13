import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"

import { Theme } from "../../../constants"

type Props = PropsWithChildren<{
  color: string | null
  onHandleChange: () => void
}>

export const RadioBox = (props: Props) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="12px"
      className="response-option"
      borderRadius="5px"
      padding="16px"
      border={`2px solid ${Theme.colors.light.surfaceVariant}`}
      bgcolor={props.color ? props.color : "none"}
      sx={{ cursor: "pointer" }}
      onClick={props.onHandleChange}>
      {props.children}
    </Box>
  )
}
