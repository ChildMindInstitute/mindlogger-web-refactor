import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import Button from "~/shared/ui/Button"
import { useCustomTranslation, ROUTES } from "~/shared/utils"

interface LoginNavigateButtonProps {
  redirectState?: Record<string, unknown>
}

export const LoginNavigateButton = ({ redirectState }: LoginNavigateButtonProps) => {
  const { t } = useCustomTranslation()
  const navigate = useNavigate()

  const onLoginClick = () => {
    navigate(ROUTES.login.path, { state: redirectState })
  }

  return (
    <Button type="button" className={classNames("btn", "btn-primary", "mx-1", "color-white")} onClick={onLoginClick}>
      {t("login")}
    </Button>
  )
}
