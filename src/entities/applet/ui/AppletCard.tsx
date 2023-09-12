import Box from "@mui/material/Box"
import { useNavigate } from "react-router-dom"

import { AppletListItem } from "../lib"

import { ROUTES } from "~/shared/constants"
import { CustomCard } from "~/shared/ui"

interface AppletCardProps {
  applet: AppletListItem
}

const AppletCard = ({ applet }: AppletCardProps) => {
  const navigate = useNavigate()

  const onAppletCardClick = () => {
    navigate(ROUTES.appletDetails.navigateTo(applet.id))
  }

  return (
    <Box>
      <CustomCard
        type="link"
        id={applet.id}
        title={applet.displayName}
        description={applet.description}
        imageSrc={applet.image}
        onClick={onAppletCardClick}
      />
    </Box>
  )
}

export default AppletCard
