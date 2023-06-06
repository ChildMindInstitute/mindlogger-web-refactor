import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { useAuthorizationGuard } from "../../AuthorizationGuard"

import { Invitation, useInvitationTranslation, usePrivateInvitationQuery } from "~/entities/invitation"
import { PrivateJoinAcceptButton } from "~/features/PrivateJoinAccept"
import { PrivateJoinDeclineButton } from "~/features/PrivateJoinDecline"
import { PageMessage } from "~/shared/ui"
import { AuthorizationButtons } from "~/widgets/AuthorizationNavigateButtons"

interface FetchPrivateInvitationProps {
  keyParams: string
  redirectState?: Record<string, unknown>
}

export const FetchPrivateInvitation = ({ keyParams, redirectState }: FetchPrivateInvitationProps) => {
  const { t } = useInvitationTranslation()
  const { isAuthenticated } = useAuthorizationGuard()

  const { isError, data, isLoading } = usePrivateInvitationQuery(keyParams)

  if (isError) {
    return <PageMessage message={t("invitationAlreadyRemoved")} />
  }

  if (isLoading) {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className="loading">{t("loadingInvitation")}</div>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return (
    <Invitation
      invite={data?.data?.result}
      isUserAuthenticated={isAuthenticated}
      actionComponent={
        <div className={classNames("d-flex", "justify-content-center", "align-items-center", "flex-row")}>
          {isAuthenticated ? (
            <>
              <PrivateJoinAcceptButton invitationKey={keyParams} />
              <PrivateJoinDeclineButton />
            </>
          ) : (
            <AuthorizationButtons redirectState={redirectState} />
          )}
        </div>
      }
    />
  )
}
