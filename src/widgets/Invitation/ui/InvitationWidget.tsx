import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { useInvitationTranslation } from "../lib"
import { InvitationDetails } from "../lib/types"
import { Invitation } from "./Invitation"

import "./style.scss"

interface InvitationWidgetProps {
  keyParams: string
}

const InvitationWidget = ({ keyParams }: InvitationWidgetProps) => {
  const { t } = useInvitationTranslation()

  const isLoading = false
  const isError = true
  const mockInvitation: InvitationDetails = {
    key: "key123",
    status: "ALREADY_ACCEPTED",
    title: "Invitation title",
    body: "Invitation body",
    email: "vriabkov@scnsoft.com",
  }

  if (isLoading) {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className="loading">{t("loadingInvitation")}</div>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className={"invitationMessage"}>{t("invitationAlreadyRemoved")}</div>
      </div>
    )
  }

  return <Invitation invite={mockInvitation} />
}

export default InvitationWidget
