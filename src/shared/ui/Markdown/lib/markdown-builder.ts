import { validateImage } from "./validate-image"

class MarkdownBuilder {
  public async extend(markdown: string): Promise<string> {
    markdown = this.extendUnderline(markdown)
    markdown = await this.extendMedia(markdown)
    markdown = this.extendTextAlign(markdown)
    markdown = this.extendSuperScript(markdown)

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

  private async extendMedia(markdown: string): Promise<string> {
    const allMediaFilesRule = new RegExp(/!\[[^\]]+\]\([^)]+\)/g)

    const matches = [...markdown.matchAll(allMediaFilesRule)]

    if (!matches) {
      return markdown
    }

    for (const match of matches) {
      const urlRule = new RegExp(/\((.*?)\)/g)
      const nameRule = new RegExp(/\[(.*?)\]/g)

      const urlMatchGroup = [...match[0].matchAll(urlRule)][0]
      const nameMatchGroup = [...match[0].matchAll(nameRule)][0]

      const url = urlMatchGroup?.[1]
      const name = nameMatchGroup?.[1]

      const isImage = await validateImage(url)

      if (isImage) {
        markdown = markdown.replace(match[0], `<img src="${url}" alt="${name}">`)
      } else {
        markdown = markdown.replace(match[0], `<video controls><source src="${url}" type="video/mp4">${name}</video>`)
      }
    }

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

        markdown = markdown.replace(match[0], `<p style="text-align: left;">${formatedContent}</p>`)
      }

      if (content.includes(centerAlignRule)) {
        const formatedContent = content.replace(centerAlignRule, "")

        markdown = markdown.replace(match[0], `<p style="text-align: center;">${formatedContent}</p>`)
      }

      if (content.includes(rightAlignRule)) {
        const formatedContent = content.replace(rightAlignRule, "")

        markdown = markdown.replace(match[0], `<p style="text-align: right;">${formatedContent}</p>`)
      }
    })

    return markdown
  }

  private extendSuperScript(markdown: string): string {
    const superScriptRegexp = new RegExp(/\^([^^]+)\^/gm)

    const matches = [...markdown.matchAll(superScriptRegexp)]

    if (!matches) {
      return markdown
    }

    matches.forEach(match => {
      markdown = markdown.replace(match[0], `<sup>${match[1].trim()}</sup>`)
    })

    return markdown
  }
}

export const markdownBuilder = new MarkdownBuilder()
