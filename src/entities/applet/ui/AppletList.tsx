import Box from "@mui/material/Box"
import classNames from "classnames"
import { Container } from "react-bootstrap"

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
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <span>{error.evaluatedMessage}</span>
      </Container>
    )
  }

  if (isAppletsEmpty) {
    return (
      <Box display="flex" height="100%" alignItems="center" justifyContent="center">
        <Text>No applets</Text>
      </Box>
    )
  }

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      {!isAppletsEmpty && applets.map(value => <AppletCard key={value.id} applet={value} />)}
    </Box>
  )
}

export default AppletList
