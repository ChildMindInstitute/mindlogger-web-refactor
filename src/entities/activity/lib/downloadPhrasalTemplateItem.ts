import html2canvas from 'html2canvas';

type GetDocumentImageDataUrisOptions = {
  documentId: string;
  single: boolean;
};

type DocumentImageDataUrisGetter = (options: GetDocumentImageDataUrisOptions) => Promise<string[]>;

const getDocumentImageDataUris: DocumentImageDataUrisGetter = async (options) => {
  let nodes: HTMLElement[];
  if (options.single) {
    const documentNode = document.querySelector<HTMLElement>(
      [
        '[data-phrasal-template-document]',
        `[data-phrasal-template-document-id="${options.documentId}"]`,
      ].join(''),
    );
    nodes = documentNode ? [documentNode] : [];
  } else {
    nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        [
          '[data-phrasal-template-page]',
          `[data-phrasal-template-document-id="${options.documentId}"]`,
        ].join(''),
      ),
    );
  }

  return Promise.all(
    nodes.map(async (node) => {
      const canvas = await html2canvas(node, {
        useCORS: true,

        // This value overrides `html2canvas`'s dpi scaling value.
        // So, this is NOT saying "3x of whatever is rendered on screen", but instead this is
        // saying "3x the normal dpi". So if the screen is already 2x (i.e. with OS-level UI
        // scaling), then this would only make the image 50% larger.
        scale: 3,
      });
      return canvas.toDataURL('image/jpeg');
    }),
  );
};

const dataUriToFile = (dataURI: string, filename: string): File => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  const byteBuffer = new ArrayBuffer(byteString.length);
  const byteArray = new Uint8Array(byteBuffer);

  for (let byteIndex = 0; byteIndex < byteString.length; byteIndex++) {
    // Convert each character in the data-uti string to the character's byte value.
    byteArray[byteIndex] = byteString.charCodeAt(byteIndex);
  }

  return new File([byteArray], filename, { type: mimeString });
};

type CardImageDownloaderOptions = {
  documentId: string;
  filename: string;
  single: boolean;
  share: boolean;
};

type CardImageDownloader = (options: CardImageDownloaderOptions) => Promise<void>;

export const downloadPhrasalTemplateItem: CardImageDownloader = async (options) => {
  const dataUris = await getDocumentImageDataUris({
    documentId: options.documentId,
    single: options.single,
  });

  const getFilename = (index: number) => {
    const filename =
      dataUris.length <= 1
        ? options.filename
        : `${options.filename}_${index + 1}of${dataUris.length}`;
    return `${filename}.jpg`;
  };

  if (options.share) {
    const imageFiles: File[] = [];
    for (let dataUriIndex = 0; dataUriIndex < dataUris.length; dataUriIndex++) {
      imageFiles.push(dataUriToFile(dataUris[dataUriIndex], getFilename(dataUriIndex)));
    }

    if (imageFiles.length > 0) {
      await navigator.share({ files: imageFiles });
    }
  } else {
    for (let dataUriIndex = 0; dataUriIndex < dataUris.length; dataUriIndex++) {
      const dataUri = dataUris[dataUriIndex];
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataUri);
      downloadLink.setAttribute('download', getFilename(dataUriIndex));

      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Add some delay before removing the link so Safari wouldn't end up skipping items.
      await new Promise((resolve) => setTimeout(resolve, 500));
      document.body.removeChild(downloadLink);

      if (dataUriIndex < dataUris.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }
};
