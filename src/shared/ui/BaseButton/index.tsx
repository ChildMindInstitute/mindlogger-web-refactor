import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"

import { Theme } from "../../constants"

type Props = {
  type: "button" | "submit"
  isLoading?: boolean
  variant: "contained" | "outlined"

  text: string
  onClick?: () => void
}

export const BaseButton = (props: Props) => {
  return (
    <Button
      type={props.type}
      variant={props.variant}
      disabled={props.isLoading}
      onClick={props.onClick}
      sx={{
        borderRadius: "100px",
        maxWidth: "400px",
        width: "100%",
        padding: "10px 24px",
        height: "48px",
      }}>
      {props.isLoading ? (
        <CircularProgress size={25} sx={{ color: Theme.colors.light.primary }} />
      ) : (
        <Typography
          fontFamily="Atkinson"
          fontSize="14px"
          fontWeight={700}
          fontStyle="normal"
          lineHeight="20px"
          letterSpacing="0.1px"
          textTransform="none">
          {props.text}
        </Typography>
      )}
    </Button>
  )
}
