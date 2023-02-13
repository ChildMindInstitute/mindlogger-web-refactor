import { useState } from "react"

import classNames from "classnames"

import { useAcceptInviteMutation, useDeclineInviteMutation } from "../api"
import { useInvitationTranslation } from "../lib"
import { InvitationDetails } from "../lib/types"
import { InvitationButtons } from "./InvitationButtons"
import { InvitationContent } from "./InvitationContent"
import { InvitationHeader } from "./InvitationHeader"

import { Logo, PageMessage } from "~/shared/ui"

interface InvitationProps {
  invite: InvitationDetails
}

export const Invitation = ({ invite }: InvitationProps) => {
  const { t } = useInvitationTranslation()

  const [inviteOnActionStatus, setInviteStatus] = useState<"ACCEPTED" | "DECLINED" | null>(null)

  const { mutate: acceptInvite, isLoading: isAcceptLoading } = useAcceptInviteMutation({
    onSuccess() {
      setInviteStatus("ACCEPTED")
    },
  })
  const { mutate: declineInvite, isLoading: isDeclineLoading } = useDeclineInviteMutation({
    onSuccess() {
      setInviteStatus("DECLINED")
    },
  })

  const onInviteAccept = () => {
    acceptInvite({ invitationId: invite.key })
  }
  const onInviteDecline = () => {
    declineInvite({ invitationId: invite.key })
  }

  if (invite.status === "approved") {
    return <PageMessage message={t("invitationAlreadyAccepted")} />
  }

  if (invite.status === "declined") {
    return <PageMessage message={t("invitationAlreadyDeclined")} />
  }

  if (inviteOnActionStatus === "ACCEPTED") {
    return <PageMessage message={t("invitationAccepted")} />
  }

  if (inviteOnActionStatus === "DECLINED") {
    return <PageMessage message={t("invitationRemoved")} />
  }

  return (
    <div className={classNames("invitationBody")}>
      <InvitationHeader appletName={invite.appletName} />

      <div className={classNames("mb-3")}>
        <InvitationButtons
          onAcceptInvite={onInviteAccept}
          onDeclineInvite={onInviteDecline}
          isAcceptLoading={isAcceptLoading}
          isDeclineLoading={isDeclineLoading}
        />
      </div>

      <InvitationContent appletName={invite.appletName} />

      <div>
        <div>
          <Logo size={{ width: 200, height: 80 }} />
        </div>
        <small>{t("inviteContent.footer")}</small>
      </div>
    </div>
  )
}
