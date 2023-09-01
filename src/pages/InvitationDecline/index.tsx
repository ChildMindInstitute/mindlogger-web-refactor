import { useInvitationTranslation } from "~/entities/invitation"
import { PageMessage } from "~/shared/ui"

export const InvitationDeclinePage = () => {
  const { t } = useInvitationTranslation()

  return <PageMessage message={t("invitationDeclined")} />
}
