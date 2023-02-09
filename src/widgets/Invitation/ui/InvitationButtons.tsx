import classNames from "classnames"

import { useInvitationTranslation } from "../lib"

import Button from "~/shared/ui/Button"

import "./style.scss"

interface InvitationButtonsProps {
  onAcceptInvite: () => void
  onDeclineInvite: () => void
}

export const InvitationButtons = ({ onAcceptInvite, onDeclineInvite }: InvitationButtonsProps) => {
  const { t } = useInvitationTranslation()

  return (
    <div className={classNames("d-flex", "justify-content-center", "align-items-center", "flex-row")}>
      <Button onClick={onAcceptInvite} variant="success" className={classNames("mx-2", "mb-2", "invitation-buttons")}>
        {t("buttons.acceptInvitation")}
      </Button>
      <Button onClick={onDeclineInvite} variant="danger" className={classNames("mx-2", "mb-2", "invitation-buttons")}>
        {t("buttons.declineInvitation")}
      </Button>
    </div>
  )
}
