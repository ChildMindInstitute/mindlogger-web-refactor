import { useCallback, useEffect, useState } from 'react';

import { markdownBuilder } from './markdown-builder';

export const useMarkdownExtender = (markdown: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const [extendedMarkdown, setExtendedMarkdown] = useState(markdown);

  const extendMarkdown = useCallback(async (): Promise<string> => {
    setIsLoading(true);
    const processedMarkdown = await markdownBuilder.extend(markdown);
    setIsLoading(false);
    return processedMarkdown;
  }, [markdown]);

  useEffect(() => {
    extendMarkdown().then(setExtendedMarkdown);
  }, [extendMarkdown]);

  return {
    isLoading,
    markdown: extendedMarkdown,
  };
};
