import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { Invitation, useInvitationQuery, useInvitationTranslation } from "~/entities/invitation"
import { PageMessage } from "~/shared/ui"

import "./style.scss"

interface InvitationWidgetProps {
  keyParams: string
}

const InvitationWidget = ({ keyParams }: InvitationWidgetProps) => {
  const { t } = useInvitationTranslation()

  const { isError, data, isLoading } = useInvitationQuery(keyParams)

  if (isError) {
    return <PageMessage message={t("invitationAlreadyRemoved")} />
  }

  if (isLoading) {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <div className="loading">{t("loadingInvitation")}</div>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return <Invitation invite={data?.data?.result} />
}

export default InvitationWidget
