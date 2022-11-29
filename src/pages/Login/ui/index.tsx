import { useLoginTranslation } from "../lib/useLoginTranslation"
import "./login.scss"

const LoginPage = () => {
  const { t } = useLoginTranslation()

  return (
    <div className="demo mp-3 align-self-center w-100">
      <div id="login" className="text-center my-2 px-3">
        <h1>{t("title")}</h1>
      </div>
    </div>
  )
}

export default LoginPage
