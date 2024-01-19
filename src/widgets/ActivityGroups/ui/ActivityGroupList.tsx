import { useContext, useState } from "react"

import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { subMonths } from "date-fns"

import { ActivityGroup } from "./ActivityGroup"
import { CustomModal } from "../../Modal"
import { AppletDetailsContext } from "../lib"
import { useActivityGroups, useEntitiesSync } from "../model/hooks"

import AppletDefaultIcon from "~/assets/AppletDefaultIcon.svg"
import { useCompletedEntitiesQuery } from "~/entities/activity"
import { AvatarBase } from "~/shared/ui"
import Loader from "~/shared/ui/Loader"
import { formatToDtoDate, useCustomTranslation } from "~/shared/utils"

export const ActivityGroupList = () => {
  const { t } = useCustomTranslation()

  const { applet, events, isPublic } = useContext(AppletDetailsContext)

  const { data: completedEntities, isFetching: isCompletedEntitiesFetching } = useCompletedEntitiesQuery(
    {
      appletId: applet.id,
      version: applet.version,
      fromDate: formatToDtoDate(subMonths(new Date(), 1)),
    },
    { select: data => data.data.result, enabled: !isPublic },
  )

  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const isAppletAboutExist = Boolean(applet?.about)
  const isAppletImageExist = Boolean(applet?.image)

  const { groups } = useActivityGroups({ applet, events })

  const onCardAboutClick = () => {
    if (!isAppletAboutExist) return

    setIsAboutOpen(true)
  }

  useEntitiesSync({ completedEntities })

  if (isCompletedEntitiesFetching) {
    return <Loader />
  }

  return (
    <Container sx={{ flex: "1" }}>
      <Box display="flex" gap="16px" marginTop="24px" alignItems="center">
        <AvatarBase
          src={isAppletImageExist ? applet.image : AppletDefaultIcon}
          name={applet.displayName}
          width="48px"
          height="48px"
          variant="rounded"
          testid="applet-image"
        />
        <Typography
          variant="h4"
          onClick={onCardAboutClick}
          data-testid="applet-name"
          sx={{
            fontFamily: "Atkinson",
            fontSize: "22px",
            fontWeight: 400,
            lineHeight: "28px",
            fontStyle: "normal",
            cursor: isAppletAboutExist ? "pointer" : "default",
          }}>
          {applet.displayName}
        </Typography>
      </Box>

      <Box>
        {groups
          .filter(g => g.activities.length)
          .map(g => (
            <ActivityGroup group={g} key={g.name} />
          ))}
      </Box>
      <CustomModal
        show={isAboutOpen}
        onHide={() => setIsAboutOpen(false)}
        title={t("about")}
        label={applet.about ? applet.about : t("no_markdown")}
      />
    </Container>
  )
}
