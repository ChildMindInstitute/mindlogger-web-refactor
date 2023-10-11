import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Theme } from "../../constants"
import { useCustomMediaQuery, useCustomTranslation } from "../../utils"

import { Markdown } from "~/shared/ui"

import "./style.scss"

interface CardItemProps extends PropsWithChildren {
  watermark?: string
  isInvalid?: boolean
  isOptional?: boolean
  markdown: string
}

export const CardItem = ({ children, markdown, isOptional }: CardItemProps) => {
  const { greaterThanSM } = useCustomMediaQuery()

  const { t } = useCustomTranslation()

  return (
    <Box
      data-testid={"active-item"}
      display="flex"
      flex={1}
      padding={greaterThanSM ? "72px 48px" : "36px 16px"}
      flexDirection="column"
      gap="48px"
      sx={{ fontFamily: "Atkinson", fontWeight: "400", fontSize: "18px", lineHeight: "28px" }}>
      <Box>
        <Markdown markdown={markdown} />
        {isOptional && (
          <Typography
            variant="body1"
            color={Theme.colors.light.outline}
            sx={{ fontFamily: "Atkinson", fontWeight: "400", fontSize: "18px", lineHeight: "28px" }}>
            {`(${t("optional")})`}
          </Typography>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}
