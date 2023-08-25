import { PropsWithChildren } from "react"

import Button from "@mui/material/Button"

import { Theme } from "~/shared/constants"

type Props = PropsWithChildren<{
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
}>

export const ActivityCardBase = (props: Props) => {
  return (
    <Button
      data-testid="activity-card"
      disabled={props.isDisabled}
      onClick={props.onClick}
      sx={{
        backgroundColor: Theme.colors.light.surface,
        padding: "24px",
        marginBottom: "36px",
        border: `1px solid ${Theme.colors.light.surfaceVariant}`,
        borderRadius: "16px",
        minWidth: "343px",
        maxWidth: "1200px",
        display: "flex",
        flex: 1,
      }}>
      {props.children}
    </Button>
  )
}
