import { useInvitationTranslation } from "~/entities/invitation"
import { PageContainer, PageMessage } from "~/shared/ui"

export const InvitationAcceptPage = () => {
  const { t } = useInvitationTranslation()

  return (
    <PageContainer id="invitation-accept-page" dataTestId="invitation-accept-page">
      <PageMessage message={t("invitationAccepted")} />
    </PageContainer>
  )
}
