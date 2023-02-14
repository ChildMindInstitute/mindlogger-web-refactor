import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useAcceptInviteMutation, useDeclineInviteMutation, useInvitationTranslation } from "~/entities/invitation"
import Button from "~/shared/ui/Button"
import { ROUTES } from "~/shared/utils"

import "./style.scss"

interface InvitationButtonsProps {
  inviteKey: string
}

export const InvitationButtons = ({ inviteKey }: InvitationButtonsProps) => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()

  const { mutate: acceptInvite, isLoading: isAcceptLoading } = useAcceptInviteMutation({
    onSuccess() {
      navigate(ROUTES.invitationAccept.path)
    },
  })

  const { mutate: declineInvite, isLoading: isDeclineLoading } = useDeclineInviteMutation({
    onSuccess() {
      navigate(ROUTES.invitationDecline.path)
    },
  })

  const onInviteAccept = () => {
    acceptInvite({ invitationId: inviteKey })
  }
  const onInviteDecline = () => {
    declineInvite({ invitationId: inviteKey })
  }

  return (
    <div className={classNames("d-flex", "justify-content-center", "align-items-center", "flex-row")}>
      <Button
        onClick={onInviteAccept}
        variant="success"
        className={classNames("mx-2", "mb-2", "invitation-buttons")}
        loading={isAcceptLoading}>
        {t("buttons.acceptInvitation")}
      </Button>
      <Button
        onClick={onInviteDecline}
        variant="danger"
        className={classNames("mx-2", "mb-2", "invitation-buttons")}
        loading={isDeclineLoading}>
        {t("buttons.declineInvitation")}
      </Button>
    </div>
  )
}
