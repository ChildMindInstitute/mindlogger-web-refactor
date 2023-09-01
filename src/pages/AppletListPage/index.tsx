import { AppletList } from "~/entities/applet"
import { PageContainer } from "~/shared/ui"

export const AppletListPage = () => {
  return (
    <PageContainer id="applet-list-page" dataTestId="applet-list-page">
      <AppletList />
    </PageContainer>
  )
}
