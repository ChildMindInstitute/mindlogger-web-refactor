import { Box, SxProps } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { useMarkdownExtender } from './lib/useMarkdownExtender';

import './style.css';
import { useCustomTranslation } from '~/shared/utils';

export type MarkdownProps = Omit<ReactMarkdownOptions, 'children'> & {
  markdown: string;
  sx?: SxProps;
};

export const Markdown = ({ markdown: markdownProp, sx, ...rest }: MarkdownProps) => {
  const { t } = useCustomTranslation();
  const { isLoading, markdown } = useMarkdownExtender(markdownProp);

  if (isLoading) {
    return <Box>{t('loading')}</Box>;
  }

  return (
    <Box id="markdown-wrapper" data-testid="markdown" sx={sx}>
      <ReactMarkdown rehypePlugins={[rehypeRaw, remarkGfm]} {...rest}>
        {markdown}
      </ReactMarkdown>
    </Box>
  );
};
