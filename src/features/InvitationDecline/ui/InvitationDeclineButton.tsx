import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useDeclineInviteMutation, useInvitationTranslation } from "~/entities/invitation"
import { ROUTES } from "~/shared/constants"
import { useNotification } from "~/shared/ui"
import Button from "~/shared/ui/Button"

interface InvitationDeclineButtonProps {
  invitationKey: string
}

export const InvitationDeclineButton = ({ invitationKey }: InvitationDeclineButtonProps) => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()

  const { showErrorNotification } = useNotification()

  const { mutate: declineInvite, isLoading: isDeclineLoading } = useDeclineInviteMutation({
    onSuccess() {
      showErrorNotification(t("invitationDeclined"))
      navigate(ROUTES.appletList.path)
    },
  })

  const onInviteDecline = () => {
    declineInvite({ invitationId: invitationKey })
  }

  return (
    <Button
      onClick={onInviteDecline}
      variant="danger"
      className={classNames("mx-2", "mb-2", "invitation-buttons", "color-white")}
      loading={isDeclineLoading}>
      {t("buttons.declineInvitation")}
    </Button>
  )
}
