import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

export const userSelector = (state: RootState) => state.user
export const userIdSelector = createSelector(userSelector, user => user.id)
export const userEmailSelector = createSelector(userSelector, user => user.email)
export const userFirstnameSelector = createSelector(userSelector, user => user.firstName)
export const userLastnameSelector = createSelector(userSelector, user => user.lastName)
