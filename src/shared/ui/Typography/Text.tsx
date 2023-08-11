import { PropsWithChildren } from "react"

import { SxProps, Theme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

type Props = PropsWithChildren<{
  fontSize?: string
  fontWeight?: string
  color?: string

  padding?: string
  margin?: string

  sx?: SxProps<Theme>
}>

export const Text = ({ children, fontSize, fontWeight, color, padding, margin, sx }: Props) => {
  return (
    <Typography variant="body1" fontSize={fontSize} fontWeight={fontWeight} sx={{ color, padding, margin, ...sx }}>
      {children}
    </Typography>
  )
}
