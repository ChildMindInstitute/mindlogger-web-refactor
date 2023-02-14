import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { useInvitationQuery } from "../api"
import { useInvitationTranslation } from "../lib"
import { InvitationContent } from "./InvitationContent"
import { InvitationHeader } from "./InvitationHeader"

import { Logo, PageMessage } from "~/shared/ui"

interface InvitationProps {
  keyParams: string
  actionComponent: JSX.Element
}

export const Invitation = ({ keyParams, actionComponent }: InvitationProps) => {
  const { t } = useInvitationTranslation()

  const { isError, data, isLoading } = useInvitationQuery(keyParams)

  const invite = data?.data?.result

  if (invite?.status === "approved") {
    return <PageMessage message={t("invitationAlreadyAccepted")} />
  }

  if (invite?.status === "declined") {
    return <PageMessage message={t("invitationAlreadyDeclined")} />
  }

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
    <div className={classNames("invitationBody")}>
      {invite && (
        <>
          <InvitationHeader appletName={invite.appletName} />
          <div className={classNames("mb-3")}>{actionComponent}</div>
          <InvitationContent appletName={invite.appletName} />

          <div>
            <div>
              <Logo size={{ width: 200, height: 80 }} />
            </div>
            <small>{t("inviteContent.footer")}</small>
          </div>
        </>
      )}
    </div>
  )
}
