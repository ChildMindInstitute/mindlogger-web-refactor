import { AppletList } from "~/entities/applet"
import { PageContainer } from "~/shared/ui"

export const DashboardPage = () => {
  return (
    <PageContainer id="applet-list-page" dataTestId="applet-list-page">
      <AppletList />
    </PageContainer>
  )
}
