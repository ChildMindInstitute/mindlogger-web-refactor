import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

import "./style.scss"
import { markdownBuilder } from "./lib/markdown-builder"

interface MarkdownProps {
  markdown: string
}

export const Markdown = ({ markdown }: MarkdownProps) => {
  const processedMarkdown = markdownBuilder.extend(markdown)

  return (
    <div>
      <ReactMarkdown className="table-override" rehypePlugins={[rehypeRaw, remarkGfm]}>
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  )
}
