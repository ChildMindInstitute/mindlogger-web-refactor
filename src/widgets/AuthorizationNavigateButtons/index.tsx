import classNames from "classnames"

import { LoginNavigateButton } from "~/features/Login"
import { SignupNavigateButton } from "~/features/Signup"
import { useCustomTranslation } from "~/shared/utils"

interface AuthorizationButtonsProps {
  redirectState?: Record<string, unknown>
}

export const AuthorizationButtons = ({ redirectState }: AuthorizationButtonsProps) => {
  const { t } = useCustomTranslation()

  return (
    <div className={classNames("d-flex", "justify-content-center")}>
      <div>
        <span>{t("please")}</span>
        <LoginNavigateButton redirectState={redirectState} />
      </div>
      <div>
        <span>{t("or")}</span>
        <SignupNavigateButton redirectState={redirectState} />
      </div>
    </div>
  )
}
