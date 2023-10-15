import { PropsWithChildren } from "react"

import { SxProps, Theme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "subtitle1"
  | "subtitle2"
  | "caption"
  | "button"
  | "overline"

type Props = PropsWithChildren<{
  variant: TextVariant

  fontSize?: string
  fontWeight?: string
  color?: string

  padding?: string
  margin?: string

  sx?: SxProps<Theme>
}>

export const Text = ({ children, fontSize, fontWeight, color, padding, margin, sx, variant }: Props) => {
  return (
    <Typography
      variant={variant}
      fontFamily="Atkinson"
      fontSize={fontSize}
      fontWeight={fontWeight}
      sx={{ color, padding, margin, ...sx }}>
      {children}
    </Typography>
  )
}
