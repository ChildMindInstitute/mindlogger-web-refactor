import { useNavigate } from "react-router-dom"

import { Applet } from "../lib/applet.schema"

import { CustomCard } from "~/shared/ui"
import { ROUTES } from "~/shared/utils"

interface AppletCardProps {
  applet: Applet
}

const AppletCard = ({ applet }: AppletCardProps) => {
  const navigate = useNavigate()

  const onAppletCardClick = () => {
    navigate(ROUTES.activityList.navigateTo(applet.id))
  }

  return (
    <CustomCard
      type="link"
      id={applet.id}
      title={applet.displayName}
      description={applet.description.en}
      imageSrc={applet.image}
      onClick={onAppletCardClick}
    />
  )
}

export default AppletCard
