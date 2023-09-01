import { useInvitationTranslation } from "~/entities/invitation"
import { PageContainer, PageMessage } from "~/shared/ui"

export const InvitationDeclinePage = () => {
  const { t } = useInvitationTranslation()

  return (
    <PageContainer id="invitation-decline-page" dataTestId="invitation-decline-page">
      <PageMessage message={t("invitationDeclined")} />
    </PageContainer>
  )
}
