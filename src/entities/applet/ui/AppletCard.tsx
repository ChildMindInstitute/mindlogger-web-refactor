import { Applet } from "../lib/applet.schema"

import { CustomCard } from "~/shared/ui"

interface AppletCardProps {
  applet: Applet
}

const AppletCard = ({ applet }: AppletCardProps) => {
  const onAppletCardClick = () => {}

  return (
    <CustomCard
      id={applet.id}
      title={applet.displayName}
      description={applet.description.en}
      imageSrc={applet.image}
      onClick={onAppletCardClick}
    />
  )
}

export default AppletCard
