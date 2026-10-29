import { Card, cn } from "@heroui/react"
import type { ReactNode } from "react"

type Props = {
  title: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function CourseSectionCard({ title, action, children, className }: Props) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-4 sm:gap-6 rounded-lg! border border-border bg-overlay p-0 shadow-none",
        className
      )}
    >
      <Card.Header className="flex min-h-11 sm:min-h-14 flex-row items-center border-b border-border pl-4 pr-1.5 sm:pl-6 sm:pr-3 py-0!">
        <Card.Title className="text-sm font-medium">{title}</Card.Title>
        {action != null && <div className="self-center ml-auto">{action}</div>}
      </Card.Header>
      <Card.Content className="flex min-h-0 flex-1 flex-col gap-0 overflow-visible px-4 sm:px-6 pb-6">
        {children}
      </Card.Content>
    </Card>
  )
}
