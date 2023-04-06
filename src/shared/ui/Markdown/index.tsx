import MDEditor from "@uiw/react-md-editor"

import "./style.scss"

interface MarkdownProps {
  markdown: string
}

export const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <div>
      <MDEditor.Markdown source={markdown} className="markdown" />
    </div>
  )
}
