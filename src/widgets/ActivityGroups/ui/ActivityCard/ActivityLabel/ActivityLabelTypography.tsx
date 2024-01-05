import Typography from "@mui/material/Typography"

type Props = {
  text: string
  color: string
}

export const ActivityLabelTypography = ({ text, color }: Props) => {
  return (
    <Typography
      color={color}
      sx={{ fontSize: "14px", fontWeight: 400, fontFamily: "Atkinson", lineHeight: "20px", letterSpacing: " 0.1px" }}>
      {text}
    </Typography>
  )
}
