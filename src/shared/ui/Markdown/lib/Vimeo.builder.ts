export class VimeoBuilder {
  private readonly VIMEO_URL_REGEX = new RegExp(
    /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/gim,
  );

  private extractVideoDetails(url: string): RegExpMatchArray | null {
    const details = [...url.matchAll(this.VIMEO_URL_REGEX)];

    return details[0] ?? null;
  }

  private getEmbedUrl(videoId: string): string {
    return `https://player.vimeo.com/video/${videoId}`;
  }

  private getVideoId(details: RegExpMatchArray): string {
    return details[4];
  }

  private getIframe(embedUrl: string, name: string): string {
    // className="embed-container" is a hack to make the iframe responsive
    return `<div className="embed-container"><iframe src="${embedUrl}" name="${name}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
  }

  public process(url: string, name: string): string | null {
    const details = this.extractVideoDetails(url);

    if (!details) return null;

    const videoId = this.getVideoId(details);

    const embedUrl = this.getEmbedUrl(videoId);

    const iframe = this.getIframe(embedUrl, name);

    return iframe;
  }
}
