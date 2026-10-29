"use client"

import { Typography } from "@heroui/react"
import { IconChartBarOff } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

export const CourseNoGradesState = () => {
  const t = useTranslations("CoursePage.noGrades")

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg px-6 text-center" role="status">
      <div className="flex size-11 items-center justify-center rounded-full bg-border">
        <IconChartBarOff className="size-5 text-neutral-400 dark:text-stone-400" stroke={1.75} aria-hidden />
      </div>

      <div className="flex max-w-sm flex-col gap-1">
        <Typography type="body" className="text-base font-medium text-neutral-800 dark:text-stone-100">
          {t("title")}
        </Typography>
        <Typography type="body-sm" className="text-muted">
          {t("hint")}
        </Typography>
      </div>
    </div>
  )
}
