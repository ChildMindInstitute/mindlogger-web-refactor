import { useParams, useSearchParams } from "react-router-dom"

type FlowReturn = {
  isFlow: true
  flowId: string
}

type RegularReturn = {
  isFlow: false
}

type Return = FlowReturn | RegularReturn

export const useFlowType = (): Return => {
  const { entityType } = useParams()
  const [searchParams] = useSearchParams()

  const flowId = searchParams.get("flowId")

  const isFlow = entityType === "flow"

  if (isFlow && flowId) {
    return {
      isFlow,
      flowId,
    }
  }

  return { isFlow: false }
}
