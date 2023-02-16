import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useDeclinePrivateInviteMutation, useInvitationTranslation } from "~/entities/invitation"
import Button from "~/shared/ui/Button"
import { ROUTES } from "~/shared/utils"

interface PrivateJoinDeclineButtonProps {
  invitationKey: string
}
export const PrivateJoinDeclineButton = ({ invitationKey }: PrivateJoinDeclineButtonProps) => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()

  const { mutate: declineInvite, isLoading: isDeclineLoading } = useDeclinePrivateInviteMutation({
    onSuccess() {
      navigate(ROUTES.invitationDecline.path)
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
