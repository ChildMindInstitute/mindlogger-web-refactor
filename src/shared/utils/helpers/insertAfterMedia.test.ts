import { insertAfterMedia } from './insertAfterMedia';

describe('insertAfterMedia', () => {
  it('should insert the string after the first line containing content that does not contain solely media', () => {
    const markdown = `![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>
This line does not contain media.
This line also does not contain media.`;
    const inserted = 'Inserted string';

    const result = insertAfterMedia(markdown, inserted);

    expect(result).toBe(`![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>
Inserted string
This line does not contain media.
This line also does not contain media.`);
  });

  it('should append the string to the end if there is no line containing content that does not contain solely media', () => {
    const markdown = `![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>`;
    const inserted = 'Inserted string';

    const result = insertAfterMedia(markdown, inserted);

    expect(result).toBe(`![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>
Inserted string`);
  });

  it('should insert the string before a line containing both media and text content', () => {
    const markdown = `![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>
![Image](image.jpg) This line contains text and media.
This line does not contain media.`;
    const inserted = 'Inserted string';

    const result = insertAfterMedia(markdown, inserted);

    expect(result).toBe(`![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>
Inserted string
![Image](image.jpg) This line contains text and media.
This line does not contain media.`);
  });

  it('should insert the string after a line that contains media wrapped in an alignment block', () => {
    const markdown = `::: hljs-center
![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>
:::
::: hljs-center <img src="image.jpg" alt="Image"> :::
::: hljs-right This line does not contain media. :::
This line also does not contain media.`;
    const inserted = 'Inserted string';

    const result = insertAfterMedia(markdown, inserted);

    expect(result).toBe(`::: hljs-center
![Image](image.jpg)
<img src="image.jpg" alt="Image">
<video src="video.mp4"></video>
<audio src="audio.mp3"></audio>
:::
::: hljs-center <img src="image.jpg" alt="Image"> :::
Inserted string
::: hljs-right This line does not contain media. :::
This line also does not contain media.`);
  });
});
