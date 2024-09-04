import ReactMarkdown from 'react-markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { useMarkdownExtender } from './lib/useMarkdownExtender';

import './style.css';
import { useCustomTranslation } from '~/shared/utils';

type MarkdownProps = Omit<ReactMarkdownOptions, 'children'> & {
  markdown: string;
};

export const Markdown = ({ markdown: markdownProp, ...rest }: MarkdownProps) => {
  const { t } = useCustomTranslation();
  const { isLoading, markdown } = useMarkdownExtender(markdownProp);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div id="markdown-wrapper" data-testid="markdown">
      <ReactMarkdown rehypePlugins={[rehypeRaw, remarkGfm]} {...rest}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
