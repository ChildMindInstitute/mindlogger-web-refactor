import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import Button from "~/shared/ui/Button"
import { ROUTES, useCustomTranslation } from "~/shared/utils"

interface AuthorizationButtonsProps {
  redirectState?: Record<string, unknown>
}

export const AuthorizationButtons = ({ redirectState }: AuthorizationButtonsProps) => {
  const { t } = useCustomTranslation()
  const navigate = useNavigate()

  const onLoginClick = () => {
    navigate(ROUTES.login.path, { state: redirectState })
  }
  const onSignupClick = () => {
    navigate(ROUTES.signup.path, { state: redirectState })
  }

  return (
    <div className={classNames("d-flex", "justify-content-center")}>
      <div>
        <span>{t("please")}</span>
        <Button type="button" className={classNames("btn", "btn-primary", "mx-1")} onClick={onLoginClick}>
          {t("login")}
        </Button>
      </div>
      <div>
        <span>{t("or")}</span>
        <Button
          type="button"
          className={classNames("btn", "btn-success", "mx-1", "color-white")}
          onClick={onSignupClick}>
          {t("singUp")}
        </Button>
      </div>
    </div>
  )
}
