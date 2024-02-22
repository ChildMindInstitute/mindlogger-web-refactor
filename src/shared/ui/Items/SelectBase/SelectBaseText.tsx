import Typography from "@mui/material/Typography"

import { Theme } from "../../../constants"

type Props = {
  text: string
}

export const SelectBaseText = (props: Props) => {
  return (
    <Typography
      variant="body1"
      color={Theme.colors.light.onSurface}
      fontFamily="Atkinson"
      fontSize="18px"
      fontStyle="normal"
      fontWeight={400}
      lineHeight="28px"
      data-testid="select-text"
      sx={{ cursor: "pointer" }}>
      {props.text}
    </Typography>
  )
}
