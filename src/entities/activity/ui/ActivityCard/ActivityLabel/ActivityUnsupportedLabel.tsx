import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { isIOS } from "react-device-detect"

import ExclamationIcon from "~/assets/exclamation-circle.svg"
import { APPSTORE_LINK, GOOGLEPLAY_LINK, Theme } from "~/shared/constants"
import { useCustomMediaQuery, useCustomTranslation } from "~/shared/utils"

export const ActivityUnsupportedLabel = () => {
  const { t } = useCustomTranslation()
  const { lessThanSM } = useCustomMediaQuery()

  const storeLink = isIOS ? APPSTORE_LINK : GOOGLEPLAY_LINK

  if (lessThanSM) {
    return (
      <Box display="flex" gap="8px" flexDirection="column" textAlign="left">
        <Box
          display="flex"
          alignItems="center"
          gap="8px"
          sx={{
            padding: "4px 8px",
            borderRadius: "8px",
            backgroundColor: Theme.colors.light.accentOrange30,
          }}>
          <Avatar src={ExclamationIcon} sx={{ width: "18px", height: "18px" }} />
          <Typography
            color={Theme.colors.light.onSurface}
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              fontFamily: "Atkinson",
              lineHeight: "20px",
              letterSpacing: " 0.1px",
            }}>
            {t("mustBeCompletedUsingMobileApp")}
          </Typography>
        </Box>

        <a href={storeLink} target="_blank" rel="noreferrer">
          <Typography
            color={Theme.colors.light.primary}
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              fontFamily: "Atkinson",
              lineHeight: "20px",
              letterSpacing: " 0.1px",
              textDecoration: "underline",
            }}>
            {` ${t("completeUsingAppNow")}.`}
          </Typography>
        </a>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="8px"
      sx={{
        padding: "4px 8px",
        borderRadius: "8px",
        backgroundColor: Theme.colors.light.accentOrange30,
      }}>
      <Avatar src={ExclamationIcon} sx={{ width: "18px", height: "18px" }} />
      <Typography
        color={Theme.colors.light.onSurface}
        sx={{ fontSize: "14px", fontWeight: 400, fontFamily: "Atkinson", lineHeight: "20px", letterSpacing: " 0.1px" }}>
        {t("pleaseCompleteOnThe")}
      </Typography>
      <a href={storeLink} target="_blank" rel="noreferrer">
        <Typography
          color={Theme.colors.light.primary}
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "Atkinson",
            lineHeight: "20px",
            letterSpacing: " 0.1px",
            textDecoration: "underline",
          }}>
          {` ${t("mindloggerMobileApp")}.`}
        </Typography>
      </a>
    </Box>
  )
}
