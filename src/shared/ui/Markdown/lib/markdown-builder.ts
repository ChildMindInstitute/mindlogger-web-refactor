import { validateImage } from './validate-image';
import { VimeoBuilder } from './Vimeo.builder';
import { YoutubeBuilder } from './YouTube.builder';

class MarkdownBuilder {
  public async extend(markdown: string): Promise<string> {
    markdown = this.extendStrikeThrough(markdown);
    markdown = this.extendUnderline(markdown);
    markdown = this.extendTextAlign(markdown);
    markdown = this.extendSubScript(markdown);
    markdown = this.extendHighlight(markdown);
    markdown = await this.extendMedia(markdown);

    return markdown;
  }

  private extendUnderline(markdown: string): string {
    const rule = new RegExp(/\+\+(.*?)\+\+/g);
    const matches = [...markdown.matchAll(rule)];

    if (!matches) {
      return markdown;
    }

    matches.forEach((match) => {
      markdown = markdown.replace(match[0], `<ins>${match[1].trim()}</ins>`);
    });

    return markdown;
  }

  private async extendMedia(markdown: string): Promise<string> {
    const allMediaFilesRule = new RegExp(/!\[[^\]]*\]\([^)]+\)/g);

    const mediaItems = [...markdown.matchAll(allMediaFilesRule)];

    if (!mediaItems) {
      return markdown;
    }

    // Take first element of the match group - it's the whole match
    for (const [item] of mediaItems) {
      const urlRule = new RegExp(/\((.*?)\)/g);
      const nameRule = new RegExp(/\[(.*?)\]/g);

      const urlMatchGroup = item.match(urlRule);
      const nameMatchGroup = item.match(nameRule);

      if (!urlMatchGroup || !nameMatchGroup) {
        continue;
      }

      const url = urlMatchGroup.map((el) => el.slice(1, -1))[0];
      const name = nameMatchGroup.map((el) => el.slice(1, -1))[0];

      const youtubeBuilder = new YoutubeBuilder();

      const youtubeIframe = youtubeBuilder.process(url, name);

      if (youtubeIframe) {
        markdown = markdown.replace(item, youtubeIframe);
        continue;
      }

      const vimeoBuilder = new VimeoBuilder();

      const vimeoIframe = vimeoBuilder.process(url, name);

      if (vimeoIframe) {
        markdown = markdown.replace(item, vimeoIframe);
        continue;
      }

      const isImage = await validateImage(url);

      if (isImage) {
        markdown = markdown.replace(item, `<img src="${url}" alt="${name}">`);
      } else {
        markdown = markdown.replace(
          item,
          `<video controls><source src="${url}" type="video/mp4">${name}</video>`,
        );
      }
    }

    return markdown;
  }

  private extendTextAlign(markdown: string): string {
    const rule = new RegExp(/::: ([\s\S]*?):::/g);
    const matches = [...markdown.matchAll(rule)];

    if (!matches) {
      return markdown;
    }

    const leftAlignRule = 'hljs-left';
    const centerAlignRule = 'hljs-center';
    const rightAlignRule = 'hljs-right';

    matches.forEach((match) => {
      const content = match[1];

      if (content.includes(leftAlignRule)) {
        const formatedContent = content.replace(leftAlignRule, '');

        markdown = markdown.replace(
          match[0],
          `<p style="text-align: left;">${formatedContent}</p>`,
        );
      }

      if (content.includes(centerAlignRule)) {
        const formatedContent = content.replace(centerAlignRule, '');

        markdown = markdown.replace(
          match[0],
          `<p style="text-align: center;">${formatedContent}</p>`,
        );
      }

      if (content.includes(rightAlignRule)) {
        const formatedContent = content.replace(rightAlignRule, '');

        markdown = markdown.replace(
          match[0],
          `<p style="text-align: right;">${formatedContent}</p>`,
        );
      }
    });

    return markdown;
  }

  private extendSubScript(markdown: string): string {
    const subScriptRegexp = new RegExp(/~([^~]+)~/gm);

    const matches = [...markdown.matchAll(subScriptRegexp)];

    if (!matches) {
      return markdown;
    }

    matches.forEach((match) => {
      markdown = markdown.replace(match[0], `<sub>${match[1].trim()}</sub>`);
    });

    return markdown;
  }

  private extendStrikeThrough(markdown: string): string {
    const strikeThroughRegexp = new RegExp(/~~([^~]+)~~/gm);

    const matches = [...markdown.matchAll(strikeThroughRegexp)];

    if (!matches) {
      return markdown;
    }

    matches.forEach((match) => {
      markdown = markdown.replace(match[0], `<s>${match[1].trim()}</s>`);
    });

    return markdown;
  }

  private extendHighlight(markdown: string): string {
    const highlightRegexp = new RegExp(/==([^=]+)==/gm);

    const matches = [...markdown.matchAll(highlightRegexp)];

    if (!matches) {
      return markdown;
    }

    matches.forEach((match) => {
      markdown = markdown.replace(match[0], `<mark>${match[1].trim()}</mark>`);
    });

    return markdown;
  }
}

export const markdownBuilder = new MarkdownBuilder();
