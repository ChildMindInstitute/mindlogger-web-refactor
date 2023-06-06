import classNames from "classnames"

import { useInvitationTranslation } from "../lib"

interface InvitationContentProps {
  appletName: string
  isUserAuthenticated: boolean
}

export const InvitationContent = ({ appletName, isUserAuthenticated }: InvitationContentProps) => {
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
          <li>
            {t("inviteContent.step2")}
            {!isUserAuthenticated ? t("inviteContent.step2_1") : ""}
          </li>
          <li>
            <div dangerouslySetInnerHTML={{ __html: t("inviteContent.step3", { displayName: appletName }) }} />
          </li>
        </ol>
      </div>
    </div>
  )
}
