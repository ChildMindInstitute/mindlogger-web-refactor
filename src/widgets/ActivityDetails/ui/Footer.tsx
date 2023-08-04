import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"

import { Theme } from "~/shared/constants"

type Props = PropsWithChildren<unknown>

export const Footer = ({ children }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      sx={{ borderTop: `1px solid ${Theme.colors.light.surfaceVariant}` }}>
      {children}
    </Box>
  )
}
