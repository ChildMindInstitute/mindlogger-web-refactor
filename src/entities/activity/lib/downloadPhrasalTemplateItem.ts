import html2canvas from 'html2canvas';

type GetDocumentImageDataUrisOptions = {
  documentId: string;
  single: boolean;
};

type DocumentImageDataUrisGetter = (options: GetDocumentImageDataUrisOptions) => Promise<string[]>;

export const getDocumentImageDataUris: DocumentImageDataUrisGetter = async (options) => {
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
      // Convert canvas to a Blob and create an object URL
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg'),
      );
      if (!blob) {
        throw new Error('Canvas toBlob failed');
      }
      return URL.createObjectURL(blob);
    }),
  );
};

export const objectUrlToFile = async (objectUrl: string, filename: string): Promise<File> => {
  const response = await fetch(objectUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
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
      const file = await objectUrlToFile(dataUris[dataUriIndex], getFilename(dataUriIndex));
      imageFiles.push(file);
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
