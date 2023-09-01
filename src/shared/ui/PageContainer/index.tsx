import { PropsWithChildren } from "react"

import Container from "@mui/material/Container"

type Props = PropsWithChildren<{
  id: string
  dataTestId: string
}>

export const PageContainer = (props: Props) => {
  return (
    <Container id={props.id} data-testid={props.dataTestId}>
      {props.children}
    </Container>
  )
}
