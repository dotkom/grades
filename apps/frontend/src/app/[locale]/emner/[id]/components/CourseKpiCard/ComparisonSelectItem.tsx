"use client"

import { cn, ListBox } from "@heroui/react"
import type { ReactNode } from "react"

const selectItemClassName = cn(
  "rounded-lg p-2 gap-0 text-neutral-950 dark:text-stone-200",
  "cursor-pointer hover:bg-default data-[hovered=true]:bg-default data-[focused=true]:bg-default"
)

type Props = {
  value: string
  children: ReactNode
}

export function ComparisonSelectItem({ value, children }: Props) {
  const textValue = typeof children === "string" ? children : value

  return (
    <ListBox.Item id={value} textValue={textValue} className={selectItemClassName}>
      {children}
    </ListBox.Item>
  )
}
