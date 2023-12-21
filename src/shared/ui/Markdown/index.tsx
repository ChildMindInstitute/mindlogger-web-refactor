import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

import { useMarkdownExtender } from "./lib/useMarkdownExtender"

import "./style.css"

interface MarkdownProps {
  markdown: string
}

export const Markdown = (props: MarkdownProps) => {
  const { isLoading, markdown } = useMarkdownExtender(props.markdown)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div id="markdown-wrapper">
      <ReactMarkdown rehypePlugins={[rehypeRaw, remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}
