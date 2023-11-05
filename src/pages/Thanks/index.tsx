import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

import { BasicButton } from "~/shared/ui"
import { ROUTES, booleanStringToBoolean, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

import "./style.scss"

export const ThanksPage = () => {
  const { appletId, isPublic } = useParams()
  const navigator = useCustomNavigation()
  const { t } = useCustomTranslation()

  const onClick = () => {
    if (!appletId) {
      return
    }

    if (!isPublic) {
      return
    }

    return navigator.navigate(
      booleanStringToBoolean(isPublic)
        ? ROUTES.publicJoin.navigateTo(appletId)
        : ROUTES.activityList.navigateTo(appletId),
    )
  }

  return (
    <Container fluid>
      <div className="mt-3 pt-3 container">
        <div className="saved-answer">
          <span>{t("additional.thanks")}</span>
          <span>{t("additional.saved_answers")}</span>
        </div>

        <div className="actions">
          <BasicButton onClick={onClick}>{t("additional.close")}</BasicButton>
        </div>
      </div>
    </Container>
  )
}
