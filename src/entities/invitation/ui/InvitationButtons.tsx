import classNames from "classnames"

import { useInvitationTranslation } from "../lib"

import Button from "~/shared/ui/Button"

import "./style.scss"

interface InvitationButtonsProps {
  onAcceptInvite: () => void
  onDeclineInvite: () => void
  isAcceptLoading: boolean
  isDeclineLoading: boolean
}

export const InvitationButtons = ({
  onAcceptInvite,
  onDeclineInvite,
  isAcceptLoading,
  isDeclineLoading,
}: InvitationButtonsProps) => {
  const { t } = useInvitationTranslation()

  return (
    <div className={classNames("d-flex", "justify-content-center", "align-items-center", "flex-row")}>
      <Button
        onClick={onAcceptInvite}
        variant="success"
        className={classNames("mx-2", "mb-2", "invitation-buttons")}
        loading={isAcceptLoading}>
        {t("buttons.acceptInvitation")}
      </Button>
      <Button
        onClick={onDeclineInvite}
        variant="danger"
        className={classNames("mx-2", "mb-2", "invitation-buttons")}
        loading={isDeclineLoading}>
        {t("buttons.declineInvitation")}
      </Button>
    </div>
  )
}
