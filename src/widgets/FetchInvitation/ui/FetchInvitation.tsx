import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { Invitation, useInvitationQuery, useInvitationTranslation } from "~/entities/invitation"
import { InvitationAcceptButton } from "~/features/InvitationAccept"
import { InvitationDeclineButton } from "~/features/InvitationDecline"
import { PageMessage } from "~/shared/ui"

interface FetchInvitationProps {
  keyParams: string
}

export const FetchInvitation = ({ keyParams }: FetchInvitationProps) => {
  const { t } = useInvitationTranslation()

  const { isError, data, isLoading } = useInvitationQuery(keyParams)

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
      actionComponent={
        <div className={classNames("d-flex", "justify-content-center", "align-items-center", "flex-row")}>
          <InvitationAcceptButton invitationKey={keyParams} />
          <InvitationDeclineButton invitationKey={keyParams} />
        </div>
      }
    />
  )
}