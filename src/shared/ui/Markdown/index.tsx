import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

import { markdownBuilder } from "./lib/markdown-builder"

import "./style.scss"

interface MarkdownProps {
  markdown: string
}

export const Markdown = ({ markdown }: MarkdownProps) => {
  const processedMarkdown = markdownBuilder.extend(markdown)

  return (
    <div>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{processedMarkdown}</ReactMarkdown>
    </div>
  )
}
