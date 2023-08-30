import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Theme } from "~/shared/constants"

type Props = {
  title: string
}

export const ActivityCardTitle = ({ title }: Props) => {
  return (
    <Box>
      <Typography
        variant="h3"
        color={Theme.colors.light.primary}
        sx={{ fontSize: "20px", fontFamily: "Atkinson", fontWeight: 700, fontStyle: "normal", lineHeight: "28px" }}>
        {title}
      </Typography>
    </Box>
  )
}
