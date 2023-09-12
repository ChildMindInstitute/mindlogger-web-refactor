import Box from "@mui/material/Box"

import { useAppletListQuery } from "../api"
import { appletBuilder } from "../model"
import AppletCard from "./AppletCard"

import { userModel } from "~/entities/user"
import { Loader, Text } from "~/shared/ui"

const AppletList = () => {
  const { user } = userModel.hooks.useUserState()
  const { data, isLoading, isError, error } = useAppletListQuery({ userId: user.id! })

  const applets = appletBuilder.convertToAppletList(data?.data?.result)
  const isAppletsEmpty = !applets.length

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <Box display="flex" flex={1} alignItems="center" justifyContent="center">
        <span>{error.evaluatedMessage}</span>
      </Box>
    )
  }

  if (isAppletsEmpty) {
    return (
      <Box display="flex" flex={1} alignItems="center" justifyContent="center">
        <Text>No applets</Text>
      </Box>
    )
  }

  return (
    <Box display="flex" flex={1} flexWrap="wrap" justifyContent="center">
      {applets.map(value => (
        <AppletCard key={value.id} applet={value} />
      ))}
    </Box>
  )
}

export default AppletList
