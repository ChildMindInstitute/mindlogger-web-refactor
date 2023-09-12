import Box from "@mui/material/Box"

import { useInvitationTranslation } from "~/entities/invitation"
import { PageMessage } from "~/shared/ui"

export const InvitationAcceptPage = () => {
  const { t } = useInvitationTranslation()

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center">
      <PageMessage message={t("invitationAccepted")} />
    </Box>
  )
}
