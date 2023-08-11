import { format } from "date-fns"

import { ActivityEventProgressRecord } from "../model/types"
import { Answer, Answers } from "./types"

type TimeRangeAnswer = {
  from: {
    hour: number
    minute: number
  }
  to: {
    hour: number
    minute: number
  }
}

type DateAnswer = {
  year: number
  month: number
  day: number
}

export class MarkdownVariableReplacer {
  private readonly activityItems: ActivityEventProgressRecord[]
  private readonly answers: Answers

  constructor(activityItems: ActivityEventProgressRecord[], answers: Answers) {
    this.activityItems = activityItems
    this.answers = answers
  }

  private extractVariables = (markdown: string): string[] => {
    const regEx = /\[\[(.*?)]]/g
    const matches = []
    let found
    while ((found = regEx.exec(markdown))) {
      matches.push(found[1])
    }
    return matches
  }

  private updateMarkdown = (variableName: string, replaceValue: string, markdown: string) => {
    const reg = new RegExp(`\\[\\[${variableName}\\]\\]`, "gi")
    return markdown.replace(reg, replaceValue)
  }

  private formatTime = (timeObject: TimeRangeAnswer["to"] | undefined): string => {
    if (!timeObject) {
      return ""
    }
    const { hour, minute } = timeObject
    return format(new Date(0, 0, 0, hour, minute), "HH:mm")
  }

  private formatDate = (dateObject: undefined | DateAnswer): string => {
    if (!dateObject) {
      return ""
    }
    const { year, month, day } = dateObject
    return format(new Date(year, month, day), "y-MM-dd")
  }

  public process = (markdown: string): string => {
    const variableNames = this.extractVariables(markdown)
    if (!Object.values(this.answers)?.length || !variableNames?.length) {
      return markdown
    }

    try {
      variableNames.forEach(variableName => {
        const updated = this.getReplaceValue(variableName)
        markdown = this.updateMarkdown(variableName, updated, markdown)
      })
    } catch (error) {
      console.warn(error)
    }

    return this.process(markdown)
  }

  private escapeSpecialChars = (value: Answer) => {
    return value.toString().replace(/(?=[$&])/g, "\\")
  }

  private getReplaceValue = (variableName: string) => {
    const foundIndex = this.activityItems.findIndex(item => item.name === variableName)
    const answerNotFound = foundIndex < 0 || !this.answers[foundIndex]

    if (answerNotFound) {
      return `[[${variableName}]]`
    }

    const activityItem = this.activityItems[foundIndex]
    let updated = ""
    const answer = this.answers[foundIndex]

    switch (activityItem.responseType) {
      case "slider":
      case "numberSelect":
      case "text":
        updated = this.escapeSpecialChars(answer)
        break
      case "singleSelect":
        const filteredItem = activityItem.responseValues.options.find(({ value }) => answer.includes(String(value)))

        if (filteredItem) {
          updated = filteredItem.text
        }
        break
      case "multiSelect":
        const filteredItems = activityItem.responseValues.options
          .filter(({ value }) => answer.includes(String(value)))
          .map(({ text }) => text)

        if (filteredItems) {
          updated = filteredItems.toString()
        }
        break
    }
    return updated
  }
}
