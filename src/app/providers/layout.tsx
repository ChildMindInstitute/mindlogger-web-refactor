import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import Header from "../../shared/header"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <div>Translations: {t("Landing.title")}</div>
      <div>{props.children}</div>
      <div>Some footer</div>
    </>
  )
}

export default Layout
