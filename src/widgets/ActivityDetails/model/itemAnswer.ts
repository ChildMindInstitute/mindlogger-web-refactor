import { AnswerTypesPayload } from "~/shared/api"

export type ItemAnswer = {
  answer: AnswerTypesPayload | null
  itemId: string
}
