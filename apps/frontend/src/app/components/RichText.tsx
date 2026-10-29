"use client"

import { cn, Typography } from "@heroui/react"
import DOMPurify from "isomorphic-dompurify"

interface RichTextProps {
  content: string
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  const sanitizedHTML = DOMPurify.sanitize(content)

  return (
    <Typography.Prose className={cn(className)}>
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized HTML */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    </Typography.Prose>
  )
}
