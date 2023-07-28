class MarkdownBuilder {
  public extend(markdown: string): string {
    markdown = this.extendUnderline(markdown)

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
}

export const markdownBuilder = new MarkdownBuilder()
