import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { useAcceptTransferOwnershipQuery } from "../api"

import { PageMessage } from "~/shared/ui"
import { Mixpanel, useCustomTranslation } from "~/shared/utils"

type TransferOwnershipProps = {
  appletId: string
  keyParam: string
}

export const TransferOwnershipAccept = ({ appletId, keyParam }: TransferOwnershipProps) => {
  const { t } = useCustomTranslation()

  const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_HOST

  const { isLoading, isError } = useAcceptTransferOwnershipQuery(
    { appletId, key: keyParam },
    {
      onSuccess() {
        Mixpanel.track("Transfer Ownership Accepted")
      },
    },
  )

  if (isLoading) {
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (isError) {
    return <PageMessage message={t("transferOwnership.notFound")} />
  }

  return (
    <div
      className={classNames(
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center",
        "text-center",
        "gap-3",
      )}>
      <h2>{t("transferOwnership.accepted.title")}</h2>
      <h5>
        {t("transferOwnership.accepted.message")}{" "}
        <a href={adminPanelUrl} target="_blank" rel="noreferrer">
          {t("adminPanel")}
        </a>
        .
      </h5>
    </div>
  )
}
