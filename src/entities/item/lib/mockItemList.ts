import { ActivityItem } from "./item.schema"
import { mockMarkdown } from "./mockMarkDown"

export const mockItemList: ActivityItem[] = []

for (let i = 0; i < 5; i++) {
  mockItemList.push({
    id: (i * 100 + i).toString(),
    question: mockMarkdown,
    isSkipable: false,
    responseType: "text",
    ordering: i,
  })
}
