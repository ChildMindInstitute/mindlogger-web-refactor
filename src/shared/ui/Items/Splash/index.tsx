import Box from "@mui/material/Box"

type SplashScreenItemProps = {
  imageSrc: string
}

export const SplashScreenItem = ({ imageSrc }: SplashScreenItemProps) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="90%" margin="auto">
      <img src={imageSrc} style={{ maxWidth: "100%" }} />
    </Box>
  )
}
