import { AlertDTO, AnswerTypesPayload } from "~/shared/api"

export type ItemAnswer = {
  answer: AnswerTypesPayload | null
  itemId: string
  alert: Array<AlertDTO>
}
