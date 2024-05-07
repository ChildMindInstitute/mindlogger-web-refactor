import { VimeoBuilder } from './Vimeo.builder';

const mostPossibleUrls = [
  'https://vimeo.com/187038213',
  'https://vimeo.com/187038213',
  'http://vimeo.com/187038213',
  'https://www.vimeo.com/187038213',
  'https://vimeo.com/channels/documentaryfilm/187038213',
  'https://vimeo.com/groups/musicvideo/videos/187038213',
  'https://vimeo.com/187038213?query=foo',
];

const wrongUrls = [
  'https://vimeo.com.omomom/187038213?query=foo',
  'http://vimeo.com/groups/musicvideo/vid/187038213',
  'https://vimeo.com/channels/foo-barr/documentaryfilm/187038213',
  'http://vimeo/187038213',
  'http://vimeo.com/foo/',
];

const getExpectedIframe = (videoId: string, name: string) => {
  return `<div className="embed-container"><iframe src="https://player.vimeo.com/video/${videoId}" name="${name}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
};

const getMockVideoId = () => '187038213';

describe('Vimeo builder', () => {
  describe('Should return iframe with vimeo video', () => {
    mostPossibleUrls.forEach((url) => {
      it(`when url is ${url}`, () => {
        const builder = new VimeoBuilder();
        const videoId = getMockVideoId();
        const name = 'name';
        const expectedIframe = getExpectedIframe(videoId, name);
        const iframe = builder.process(url, name);
        expect(iframe).toBe(expectedIframe);
      });
    });
  });

  describe('Should return null', () => {
    wrongUrls.forEach((url) => {
      it(`when url is ${url}`, () => {
        const builder = new VimeoBuilder();
        const iframe = builder.process(url, 'name');
        expect(iframe).toBeNull();
      });
    });
  });
});
