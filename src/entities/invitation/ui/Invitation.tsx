import { useState } from "react"

import classNames from "classnames"

import { useAcceptInviteMutation, useDeclineInviteMutation } from "../api"
import { useInvitationTranslation } from "../lib"
import { InvitationDetails } from "../lib/types"
import { InvitationButtons } from "./InvitationButtons"
import { InvitationMessage } from "./InvitationMessage"

import { Logo } from "~/shared/ui"

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
    return <InvitationMessage message={t("invitationAlreadyAccepted")} />
  }

  if (invite.status === "declined") {
    return <InvitationMessage message={t("invitationAlreadyDeclined")} />
  }

  if (inviteOnActionStatus === "ACCEPTED") {
    return <InvitationMessage message={t("invitationAccepted")} />
  }

  if (inviteOnActionStatus === "DECLINED") {
    return <InvitationMessage message={t("invitationRemoved")} />
  }

  return (
    <div className={classNames("invitationBody")}>
      <h3 className={classNames("mb-2")}>
        {t("inviteContent.welcome")}
        <strong>{` ${invite.appletName}!`}</strong>
      </h3>
      <p>{`${t("inviteContent.title")} ${invite.appletName}. ${t("inviteContent.toAccept")}`}</p>

      <div className={classNames("mb-3")}>
        <InvitationButtons
          onAcceptInvite={onInviteAccept}
          onDeclineInvite={onInviteDecline}
          isAcceptLoading={isAcceptLoading}
          isDeclineLoading={isDeclineLoading}
        />
      </div>

      <div
        className="invitationBody"
        dangerouslySetInnerHTML={{ __html: t("inviteContent.description", { displayName: invite.appletName }) }}
      />
      <div className={classNames("mb-3")}>
        <ol>
          <li>{t("inviteContent.step1")}</li>
          <li>{t("inviteContent.step2")}</li>
          <li>
            <div dangerouslySetInnerHTML={{ __html: t("inviteContent.step3", { displayName: invite.appletName }) }} />
          </li>
        </ol>
      </div>

      <div>
        <div>
          <Logo size={{ width: 200, height: 80 }} />
        </div>
        <small>{t("inviteContent.footer")}</small>
      </div>
    </div>
  )
}
