import { YoutubeBuilder } from "./YouTube.builder"

const mostPossibleUrls = [
  "https://www.youtube.com/watch?v=DFYRQ_zQ-gk&feature=featured",
  "https://www.youtube.com/watch?v=DFYRQ_zQ-gk",
  "http://www.youtube.com/watch?v=DFYRQ_zQ-gk",
  "//www.youtube.com/watch?v=DFYRQ_zQ-gk",
  "www.youtube.com/watch?v=DFYRQ_zQ-gk",
  "https://youtube.com/watch?v=DFYRQ_zQ-gk",
  "http://youtube.com/watch?v=DFYRQ_zQ-gk",
  "//youtube.com/watch?v=DFYRQ_zQ-gk",
  "youtube.com/watch?v=DFYRQ_zQ-gk",

  "https://m.youtube.com/watch?v=DFYRQ_zQ-gk",
  "http://m.youtube.com/watch?v=DFYRQ_zQ-gk",
  "//m.youtube.com/watch?v=DFYRQ_zQ-gk",
  "m.youtube.com/watch?v=DFYRQ_zQ-gk",

  "https://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
  "http://www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
  "//www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
  "www.youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",
  "youtube.com/v/DFYRQ_zQ-gk?fs=1&hl=en_US",

  "https://www.youtube.com/embed/DFYRQ_zQ-gk?autoplay=1",
  "https://www.youtube.com/embed/DFYRQ_zQ-gk",
  "http://www.youtube.com/embed/DFYRQ_zQ-gk",
  "//www.youtube.com/embed/DFYRQ_zQ-gk",
  "www.youtube.com/embed/DFYRQ_zQ-gk",
  "https://youtube.com/embed/DFYRQ_zQ-gk",
  "http://youtube.com/embed/DFYRQ_zQ-gk",
  "//youtube.com/embed/DFYRQ_zQ-gk",
  "youtube.com/embed/DFYRQ_zQ-gk",

  "https://www.youtube-nocookie.com/embed/DFYRQ_zQ-gk?autoplay=1",
  "https://www.youtube-nocookie.com/embed/DFYRQ_zQ-gk",
  "http://www.youtube-nocookie.com/embed/DFYRQ_zQ-gk",
  "//www.youtube-nocookie.com/embed/DFYRQ_zQ-gk",
  "www.youtube-nocookie.com/embed/DFYRQ_zQ-gk",
  "https://youtube-nocookie.com/embed/DFYRQ_zQ-gk",
  "http://youtube-nocookie.com/embed/DFYRQ_zQ-gk",
  "//youtube-nocookie.com/embed/DFYRQ_zQ-gk",
  "youtube-nocookie.com/embed/DFYRQ_zQ-gk",

  "https://youtu.be/DFYRQ_zQ-gk?si=ZvNujVQGrV8pLSY1",
  "https://youtu.be/DFYRQ_zQ-gk?t=120",
  "https://youtu.be/DFYRQ_zQ-gk",
  "http://youtu.be/DFYRQ_zQ-gk",
  "//youtu.be/DFYRQ_zQ-gk",
  "youtu.be/DFYRQ_zQ-gk",

  "https://www.youtube.com/HamdiKickProduction?v=DFYRQ_zQ-gk",
]

const getExpectedIframe = (videoId: string, name: string) => {
  return `<div className="embed-container"><iframe src="https://www.youtube.com/embed/${videoId}" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
}

const getMockVideoId = () => "DFYRQ_zQ-gk"

describe("Youtube builder", () => {
  describe("Should return iframe with youtube video", () => {
    mostPossibleUrls.forEach(url => {
      it(`when url is ${url}`, () => {
        const builder = new YoutubeBuilder()
        const videoId = getMockVideoId()
        const name = "name"
        const expectedIframe = getExpectedIframe(videoId, name)
        const iframe = builder.process(url, name)
        expect(iframe).toBe(expectedIframe)
      })
    })
  })
})
