import Box from "@mui/material/Box"

import { Text } from "../Text"

interface PageMessageProps {
  message: string
}

export const PageMessage = ({ message }: PageMessageProps) => {
  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
      <Text variant="body1" fontSize="24px" margin="16px 0px">
        {message}
      </Text>
    </Box>
  )
}
