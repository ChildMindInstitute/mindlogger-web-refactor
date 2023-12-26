import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"

import { Theme } from "../../../constants"

type Props = PropsWithChildren<{
  color: string | null
  checked?: boolean | undefined
  onHandleChange: () => void
}>

export const SelectBaseBox = (props: Props) => {
  const borderColor = props.checked ? Theme.colors.light.primary : Theme.colors.light.surfaceVariant
  const backgroundColor = props.checked ? Theme.colors.light.secondaryContainer : Theme.colors.light.surface
  const hoverBackgroundColor = props.checked
    ? Theme.colors.light.secondaryContainerHover
    : Theme.colors.light.onSurfaceOpacity008

  const activeBackgroundColor = props.checked ? hoverBackgroundColor : Theme.colors.light.neutural90

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="12px"
      className="response-option"
      borderRadius="12px"
      padding="16px"
      border={`2px solid ${borderColor}`}
      bgcolor={props.color ? props.color : backgroundColor}
      onClick={props.onHandleChange}
      data-testid={`select-box ${props.color ? `bgcolor-${props.color}` : ""}`}
      sx={{
        transition: "background-color 0.2s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          background: hoverBackgroundColor,
        },
        "&:active": {
          background: activeBackgroundColor,
        },
      }}>
      {props.children}
    </Box>
  )
}
