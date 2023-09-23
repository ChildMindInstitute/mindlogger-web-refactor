import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

export const notificationCenterSelector = (state: RootState) => state.notificationCenter
export const notificationsSelector = createSelector(
  notificationCenterSelector,
  notificationCenter => notificationCenter.notifications,
)
