import classNames from "classnames"

import { useInvitationTranslation } from "../lib"

interface InvitationContentProps {
  appletName: string
}

export const InvitationContent = ({ appletName }: InvitationContentProps) => {
  const { t } = useInvitationTranslation()

  return (
    <div>
      <div
        className="invitationBody"
        dangerouslySetInnerHTML={{ __html: t("inviteContent.description", { displayName: appletName }) }}
      />
      <div className={classNames("mb-3")}>
        <ol>
          <li>{t("inviteContent.step1")}</li>
          <li>{t("inviteContent.step2")}</li>
          <li>
            <div dangerouslySetInnerHTML={{ __html: t("inviteContent.step3", { displayName: appletName }) }} />
          </li>
        </ol>
      </div>
    </div>
  )
}
