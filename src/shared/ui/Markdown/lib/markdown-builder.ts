class MarkdownBuilder {
  public extend(markdown: string): string {
    markdown = this.extendUnderline(markdown)
    markdown = this.extendVideo(markdown)
    markdown = this.extendTextAlign(markdown)

    return markdown
  }

  private extendUnderline(markdown: string): string {
    const rule = new RegExp(/\+\+(.*?)\+\+/g)
    const matches = [...markdown.matchAll(rule)]

    if (!matches) {
      return markdown
    }

    matches.forEach(match => {
      markdown = markdown.replace(match[0], `<ins>${match[1].trim()}</ins>`)
    })

    return markdown
  }

  private extendVideo(markdown: string): string {
    const allMediaFilesRule = new RegExp(/!\[[^\]]+\]\([^)]+\)/g)

    const matches = [...markdown.matchAll(allMediaFilesRule)]

    if (!matches) {
      return markdown
    }

    matches.forEach(match => {
      const mp4UrlRule = new RegExp(/\bhttps?:\/\/\S+\.mp4\b/g)
      const nameRule = new RegExp(/\[(\S+\.mp4)]/)

      const linkMatch = match[0].match(mp4UrlRule)?.[0]
      const nameMatch = match[0].match(nameRule)?.[1]

      markdown = markdown.replace(
        match[0],
        `<video controls><source src="${linkMatch}" type="video/mp4">${nameMatch}</video>`,
      )
    })

    return markdown
  }

  private extendTextAlign(markdown: string): string {
    const rule = new RegExp(/::: ([\s\S]*?):::/g)
    const matches = [...markdown.matchAll(rule)]

    if (!matches) {
      return markdown
    }

    const leftAlignRule = "hljs-left"
    const centerAlignRule = "hljs-center"
    const rightAlignRule = "hljs-right"

    matches.forEach(match => {
      const content = match[1]

      if (content.includes(leftAlignRule)) {
        const formatedContent = content.replace(leftAlignRule, "")

        markdown = markdown.replace(match[0], `<div style="text-align: left;">${formatedContent}</div>`)
      }

      if (content.includes(centerAlignRule)) {
        const formatedContent = content.replace(centerAlignRule, "")

        markdown = markdown.replace(match[0], `<div style="text-align: center;">${formatedContent}</div>`)
      }

      if (content.includes(rightAlignRule)) {
        const formatedContent = content.replace(rightAlignRule, "")

        markdown = markdown.replace(match[0], `<div style="text-align: right;">${formatedContent}</div>`)
      }
    })

    return markdown
  }
}

export const markdownBuilder = new MarkdownBuilder()
