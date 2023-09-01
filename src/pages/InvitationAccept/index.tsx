import { useInvitationTranslation } from "~/entities/invitation"
import { PageMessage } from "~/shared/ui"

export const InvitationAcceptPage = () => {
  const { t } = useInvitationTranslation()

  return <PageMessage message={t("invitationAccepted")} />
}
