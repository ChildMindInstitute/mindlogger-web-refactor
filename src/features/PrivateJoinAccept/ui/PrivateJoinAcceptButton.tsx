import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useAcceptPrivateInviteMutation, useInvitationTranslation } from "~/entities/invitation"
import { ROUTES } from "~/shared/constants"
import { useToast } from "~/shared/ui"
import Button from "~/shared/ui/Button"

interface PrivateJoinAcceptButtonProps {
  invitationKey: string
}

export const PrivateJoinAcceptButton = ({ invitationKey }: PrivateJoinAcceptButtonProps) => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()
  const { showSuccessToast } = useToast()

  const { mutate: acceptPrivateInvite, isLoading } = useAcceptPrivateInviteMutation({
    onSuccess() {
      showSuccessToast(t("invitationAccepted"))
      navigate(ROUTES.appletList.path)
    },
  })

  const onPrivateJoinAccept = () => {
    acceptPrivateInvite({ invitationId: invitationKey })
  }

  return (
    <Button
      onClick={onPrivateJoinAccept}
      variant="success"
      className={classNames("mx-2", "mb-2", "invitation-buttons", "color-white")}
      loading={isLoading}>
      {t("buttons.acceptInvitation")}
    </Button>
  )
}
