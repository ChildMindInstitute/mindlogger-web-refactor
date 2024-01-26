export class YoutubeBuilder {
  private readonly YOUTUBE_URL_REGEX = new RegExp(
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/gim,
  )

  private extractVideoDetails(url: string): RegExpMatchArray | null {
    const details = [...url.matchAll(this.YOUTUBE_URL_REGEX)]

    return details[0] ?? null
  }

  private getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`
  }

  private getVideoId(details: RegExpMatchArray): string {
    return details[6]
  }

  private getIframe(embedUrl: string, name: string): string {
    return `<iframe width="560" height="315" src="${embedUrl}" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
  }

  public process(url: string, name: string): string | null {
    const details = this.extractVideoDetails(url)

    if (!details) return null

    const videoId = this.getVideoId(details)

    const embedUrl = this.getEmbedUrl(videoId)

    const iframe = this.getIframe(embedUrl, name)

    return iframe
  }
}
