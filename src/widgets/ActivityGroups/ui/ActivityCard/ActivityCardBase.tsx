import { PropsWithChildren } from "react"

import Button from "@mui/material/Button"

import { Theme } from "~/shared/constants"

type Props = PropsWithChildren<{
  isFlow: boolean
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
}>

export const ActivityCardBase = (props: Props) => {
  return (
    <Button
      data-testid={props.isFlow ? "flow-card" : "activity-card"}
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
        minHeight: "122px",
        flex: 1,
        opacity: props.isDisabled ? 0.65 : 1,
      }}>
      {props.children}
    </Button>
  )
}
