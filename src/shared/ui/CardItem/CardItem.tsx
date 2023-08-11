import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"

import { useCustomMediaQuery } from "../../utils"

import { Markdown } from "~/shared/ui"

import "./style.scss"

interface CardItemProps extends PropsWithChildren {
  watermark?: string
  isInvalid?: boolean
  markdown: string
}

export const CardItem = ({ children, markdown }: CardItemProps) => {
  const { greaterThanSM } = useCustomMediaQuery()

  return (
    <Box
      data-testid={"active-item"}
      display="grid"
      gridTemplateColumns="minmax(300px, 900px)"
      padding={greaterThanSM ? "72px 48px" : "36px 16px"}
      flexDirection="column"
      gap="48px">
      <Box>
        <Markdown markdown={markdown} />
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}
