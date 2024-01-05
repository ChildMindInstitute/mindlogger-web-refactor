import { forwardRef } from "react"

import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"

import { Theme } from "../../constants"

type Props = {
  type: "button" | "submit"
  isLoading?: boolean
  variant: "contained" | "outlined"
  borderColor?: string

  text: string
  onClick?: () => void
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning"
}

export const BaseButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <Button
      ref={ref}
      type={props.type}
      variant={props.variant}
      disabled={props.isLoading}
      onClick={props.onClick}
      color={props.color ?? undefined}
      sx={{
        borderRadius: "100px",
        maxWidth: "400px",
        width: "100%",
        padding: "10px 24px",
        height: "48px",
        borderColor: props.borderColor ?? undefined,
      }}>
      {props.isLoading ? (
        <CircularProgress size={25} sx={{ color: Theme.colors.light.primary }} />
      ) : (
        <Typography
          fontFamily="Atkinson"
          fontSize="16px"
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
})
