import { useState } from "react"

import classNames from "classnames"

import { useInvitationTranslation } from "../lib"
import { InvitationDetails } from "../lib/types"
import { InvitationButtons } from "./InvitationButtons"

interface InvitationProps {
  invite: InvitationDetails
}

export const Invitation = ({ invite }: InvitationProps) => {
  const { t } = useInvitationTranslation()

  const [inviteOnActionStatus, setInviteStatus] = useState<"ACCEPTED" | "DECLINED" | null>(null)

  const onInviteAccept = () => {
    setInviteStatus("ACCEPTED")
  }
  const onInviteDecline = () => {
    setInviteStatus("DECLINED")
  }

  if (invite.status === "ALREADY_ACCEPTED") {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className={classNames("invitationMessage")}>{t("invitationAlreadyAccepted")}</div>
      </div>
    )
  }

  if (inviteOnActionStatus === "ACCEPTED") {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className={classNames("invitationMessage")}>{t("invitationAccepted")}</div>
      </div>
    )
  }

  if (inviteOnActionStatus === "DECLINED") {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className={classNames("invitationMessage")}>{t("invitationRemoved")}</div>
      </div>
    )
  }

  return (
    <>
      <div className={"invitationBody"}>{invite.title}</div>
      <InvitationButtons onAcceptInvite={onInviteAccept} onDeclineInvite={onInviteDecline} />
      <div className={"invitationBody"}>{invite.body}</div>
    </>
  )
}
