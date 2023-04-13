import classNames from "classnames"

import { InvitationDetails, useInvitationTranslation } from "../lib"
import { InvitationContent } from "./InvitationContent"
import { InvitationHeader } from "./InvitationHeader"

import { Logo, PageMessage } from "~/shared/ui"

interface InvitationProps {
  actionComponent: JSX.Element
  invite?: InvitationDetails
}

export const Invitation = ({ invite, actionComponent }: InvitationProps) => {
  const { t } = useInvitationTranslation()

  if (invite?.status === "approved") {
    return <PageMessage message={t("invitationAlreadyAccepted")} />
  }

  if (invite?.status === "declined") {
    return <PageMessage message={t("invitationAlreadyDeclined")} />
  }

  return (
    <div className={classNames("invitationBody")}>
      {invite && (
        <>
          <InvitationHeader appletName={invite.appletName} role={invite.role} />
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
