export function validateAudio(url: string): boolean {
  const regex = new RegExp(/(?:((?:https|http):\/\/)|(?:\/)).+(?:.mp3)/gm);

  return regex.test(url);
}
