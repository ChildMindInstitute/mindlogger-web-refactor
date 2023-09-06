class MarkdownBuilder {
  public extend(markdown: string): string {
    markdown = this.extendUnderline(markdown)
    markdown = this.exendVideo(markdown)

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

  private exendVideo(markdown: string): string {
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
}

export const markdownBuilder = new MarkdownBuilder()
