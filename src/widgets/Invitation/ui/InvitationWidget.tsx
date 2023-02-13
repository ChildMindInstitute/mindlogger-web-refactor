import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import {
  Invitation,
  InvitationDetails,
  InvitationMessage,
  useInvitationQuery,
  useInvitationTranslation,
} from "~/entities/invitation"

import "./style.scss"

interface InvitationWidgetProps {
  keyParams: string
}

const InvitationWidget = ({ keyParams }: InvitationWidgetProps) => {
  const { t } = useInvitationTranslation()

  const { isLoading, isError, data } = useInvitationQuery(keyParams)

  const invitationDetails = data?.data?.result as InvitationDetails

  if (isLoading) {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className="loading">{t("loadingInvitation")}</div>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (isError) {
    return <InvitationMessage message={t("invitationAlreadyRemoved")} />
  }

  return <Invitation invite={invitationDetails} />
}

export default InvitationWidget
