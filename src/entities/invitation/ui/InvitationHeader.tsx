import classNames from "classnames"

import { useInvitationTranslation } from "../lib"

interface InvitationHeaderProps {
  appletName: string
  role: string
}

export const InvitationHeader = ({ appletName, role }: InvitationHeaderProps) => {
  const { t } = useInvitationTranslation()

  return (
    <div>
      <h3 className={classNames("mb-2")}>
        {t("inviteContent.welcome")}
        <strong>{` ${appletName}`}</strong>
      </h3>
      <p>{`${t("inviteContent.title", { role })} ${appletName}. ${t("inviteContent.toAccept")}`}</p>
    </div>
  )
}
