import Box from "@mui/material/Box"

import { SaveAndExitButton } from "~/features/SaveAssessmentAndExit"
import { ROUTES } from "~/shared/constants"
import { NotificationCenter } from "~/shared/ui"
import Loader from "~/shared/ui/Loader"
import { useCustomMediaQuery, useCustomNavigation } from "~/shared/utils"

type Props = {
  appletId: string
  isPublic: boolean
  publicKey: string | null
}

export const AssessmentLoadingScreen = (props: Props) => {
  const navigator = useCustomNavigation()

  const { greaterThanSM } = useCustomMediaQuery()

  const onSaveAndExitClick = () => {
    return navigator.navigate(
      props.isPublic && props.publicKey
        ? ROUTES.publicJoin.navigateTo(props.publicKey)
        : ROUTES.appletDetails.navigateTo(props.appletId),
    )
  }

  return (
    <Box id="assessment-screen-layout" display="flex" flex={1} flexDirection="column">
      <Box display="flex" justifyContent="flex-end" padding={greaterThanSM ? "19px 24px" : "15px 16px"}>
        <Box
          width="125px"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          justifySelf="flex-end">
          <SaveAndExitButton onClick={onSaveAndExitClick} />
        </Box>
      </Box>

      <Box id="assessment-content-container" display="flex" flex={1} flexDirection="column" overflow="scroll">
        <NotificationCenter />
        <Loader />
      </Box>
    </Box>
  )
}
