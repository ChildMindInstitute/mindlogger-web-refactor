import { useNavigate } from "react-router-dom"

import { useNavbarTranslation } from "../lib/useNavbarTranslation"

import { NavbarButton } from "~/shared/ui"
import { ROUTES } from "~/shared/utils"

export interface LoginButtonProps {
  onClickExtended?: () => void
}

const LoginButton = ({ onClickExtended }: LoginButtonProps) => {
  const { t } = useNavbarTranslation()
  const navigate = useNavigate()

  const onLoginButtonClickHandler = () => {
    navigate(ROUTES.login.path)

    if (onClickExtended) {
      onClickExtended()
    }
  }

  return <NavbarButton label={t("logIn")} onClick={onLoginButtonClickHandler} />
}

export default LoginButton
