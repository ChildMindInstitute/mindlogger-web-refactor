import { ActivityItem } from "./item.schema"
import { mockMarkdown } from "./mockMarkDown"

const mockItem1option: ActivityItem = {
  id: "mockitem1",
  question: "Question number 1: How are you?",
  responseType: "text",
  timer: 0,
  isSkippable: false,
  isRandom: false,
  isAbleToMoveToPrevious: false,
  hasTextResponse: false,
  ordering: 0,
}
const mockItem2option: ActivityItem = {
  id: "mockitem2",
  question: mockMarkdown,
  responseType: "text",
  timer: 0,
  isSkippable: true,
  isRandom: false,
  isAbleToMoveToPrevious: true,
  hasTextResponse: false,
  ordering: 1,
}
const mockItem3option: ActivityItem = {
  id: "mockitem3",
  question: mockMarkdown,
  responseType: "text",
  timer: 0,
  isSkippable: true,
  isRandom: false,
  isAbleToMoveToPrevious: false,
  hasTextResponse: true,
  ordering: 2,
}

export const mockItemList: ActivityItem[] = [mockItem1option, mockItem2option, mockItem3option]
