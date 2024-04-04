type Return = {
  url: string;
  name: string;
};

export const extractDataFromMediaLink = (link: string): Return | null => {
  const pattern = new RegExp(/!\[(.*?)\]\((.*?)\)/);

  const data = link.match(pattern);

  if (!data) {
    return null;
  }

  const name = data[1];
  const url = data[2];

  return {
    url,
    name,
  };
};
