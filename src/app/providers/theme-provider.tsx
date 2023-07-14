import { PropsWithChildren } from "react"

import { ThemeProvider, createTheme } from "@mui/material/styles"

type Props = PropsWithChildren<unknown>

const theme = createTheme()

export const MUIThemeProvider = ({ children }: Props) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
