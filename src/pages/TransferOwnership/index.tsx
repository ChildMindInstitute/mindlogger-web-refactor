import Box from "@mui/material/Box"
import { useLocation, useParams, useSearchParams } from "react-router-dom"

import { TransferOwnershipAccept } from "~/features/TransferOwnershipAccept"
import { TransferOwnershipDecline } from "~/features/TransferOwnershipDecline"
import { PageContainer, PageMessage } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"
import { AuthorizationGuard } from "~/widgets/AuthorizationGuard"
import { AuthorizationButtons } from "~/widgets/AuthorizationNavigateButtons"

export const TransferOwnershipPage = () => {
  const { appletId } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const { t } = useCustomTranslation()

  const key = searchParams.get("key")
  const action = searchParams.get("action")

  if (!appletId || !key || !action) {
    return <PageMessage message={t("wrondLinkParametrError")} />
  }

  const redirectState = {
    isInvitationFlow: true,
    backRedirectPath: `${location.pathname}${location.search}`,
  }

  return (
    <PageContainer id="transfer-ownership-page" dataTestId="transfer-ownership-page">
      <Box margin="24px 0px">
        <AuthorizationGuard fallback={<AuthorizationButtons redirectState={redirectState} />}>
          {action === "accept" && <TransferOwnershipAccept appletId={appletId} keyParam={key} />}
          {action === "decline" && <TransferOwnershipDecline appletId={appletId} keyParam={key} />}
        </AuthorizationGuard>
      </Box>
    </PageContainer>
  )
}
