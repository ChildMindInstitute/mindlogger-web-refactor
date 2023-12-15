import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

import "./styles.scss"

export const Loader = () => {
  return (
    <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  )
}
