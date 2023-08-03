import Box from "@mui/material/Box"
import "./styles.scss"
import CircularProgress from "@mui/material/CircularProgress"

export const Loader = () => {
  return (
    <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  )
}
