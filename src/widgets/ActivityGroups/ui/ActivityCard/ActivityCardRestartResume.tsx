import { useState } from "react"

import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"

import { ActivityStatus } from "~/abstract/lib/GroupBuilder"
import ActivityRestartIcon from "~/assets/activity-restart-icon.svg"
import { Theme } from "~/shared/constants"
import { BaseButton, MuiModal, Text } from "~/shared/ui"
import { useCustomMediaQuery, useCustomTranslation } from "~/shared/utils"

type Props = {
  activityStatus: ActivityStatus
  activityName: string
  onResumeClick: () => void
  onRestartClick: () => void
  isDisabled: boolean
}

export const ActivityCardRestartResume = ({
  activityStatus,
  onRestartClick,
  onResumeClick,
  activityName,
  isDisabled,
}: Props) => {
  const [isRestartConfirmationModalOpen, setIsRestartConfirmationModalOpen] = useState(false)
  const { lessThanSM } = useCustomMediaQuery()
  const { t } = useCustomTranslation()
  const closeModal = () => setIsRestartConfirmationModalOpen(false)
  const openModal = () => setIsRestartConfirmationModalOpen(true)

  return (
    <>
      {activityStatus === ActivityStatus.InProgress ? (
        <Box
          marginTop={lessThanSM ? 3 : 0}
          alignSelf="center"
          data-testid="assessment-buttons"
          flexDirection={lessThanSM ? "row" : "column"}
          flexWrap="nowrap"
          display="flex"
          flex={1}
          justifyContent="center"
          alignItems="flex-end"
          gap="8px">
          <BaseButton
            data-testid="assessment-resume-button"
            disabled={isDisabled}
            sx={{
              width: "120px",
            }}
            type="button"
            variant="contained"
            onClick={onResumeClick}
            text={t("additional.resume")}
          />
          <ButtonBase
            disabled={isDisabled}
            onClick={openModal}
            data-testid="assessment-restart-button"
            sx={{
              borderRadius: "100px",
              padding: "10px 10px",
              transition: "all 0.2s",
              minWidth: "120px",
            }}>
            <Box display="flex" flex={1} flexDirection="row" mt={2}>
              <img src={ActivityRestartIcon} alt="Activity Restart Icon" />

              <Text sx={{ marginLeft: 1 }} variant="body1" fontSize="16px">
                {t("additional.restart")}
              </Text>
            </Box>
          </ButtonBase>
        </Box>
      ) : (
        <Box data-testid="assessment-buttons" alignSelf="center" width="120px">
          <BaseButton
            disabled={isDisabled}
            type="button"
            variant="contained"
            onClick={onResumeClick}
            text={t("start")}
            data-testid="assessment-start-button"
          />
        </Box>
      )}

      <MuiModal
        testId="assessment-restart-modal"
        isOpen={isRestartConfirmationModalOpen}
        onHide={closeModal}
        title={t("additional.restart_activity")}
        footerPrimaryButton={t("additional.restart")}
        onPrimaryButtonClick={onRestartClick}
        footerSecondaryButton={t("additional.cancel")}
        onSecondaryButtonClick={closeModal}
        showCloseIcon
        titleProps={{
          fontWeight: "400",
          marginY: 2,
        }}
        labelComponent={
          <Typography
            fontFamily="Atkinson"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="24px"
            letterSpacing="0.15px"
            textTransform="none"
            color={Theme.colors.light.onSurface}>
            {t("additional.activity_resume_restart")} <b>{activityName}</b>?
          </Typography>
        }
        footerWrapperSXProps={{
          marginLeft: "auto",
          marginTop: 2,
        }}
        maxWidth="sm"
      />
    </>
  )
}
