import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

import { markdownBuilder } from "./lib/markdown-builder"

import "./style.scss"

interface MarkdownProps {
  markdown: string
}

export const Markdown = ({ markdown }: MarkdownProps) => {
  const processedMarkdown = markdownBuilder.extend(markdown)

  return (
    <div id="markdown-wrapper">
      <ReactMarkdown rehypePlugins={[rehypeRaw, remarkGfm]}>{processedMarkdown}</ReactMarkdown>
    </div>
  )
}
