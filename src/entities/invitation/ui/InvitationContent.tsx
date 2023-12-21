import Box from "@mui/material/Box"

import { useInvitationTranslation } from "../lib"

interface InvitationContentProps {
  appletName: string
  isUserAuthenticated: boolean
}

export const InvitationContent = ({ appletName, isUserAuthenticated }: InvitationContentProps) => {
  const { t } = useInvitationTranslation()

  return (
    <Box data-testid="invitation-content">
      <Box
        className="invitationBody"
        dangerouslySetInnerHTML={{ __html: t("inviteContent.description", { displayName: appletName }) }}
      />
      <Box margin="24px 0px">
        <ol>
          <li>{t("inviteContent.step1")}</li>
          <li>
            {t("inviteContent.step2")}
            {!isUserAuthenticated ? t("inviteContent.step2_1") : ""}
          </li>
          <li>
            <Box dangerouslySetInnerHTML={{ __html: t("inviteContent.step3", { displayName: appletName }) }} />
          </li>
        </ol>
      </Box>
    </Box>
  )
}
