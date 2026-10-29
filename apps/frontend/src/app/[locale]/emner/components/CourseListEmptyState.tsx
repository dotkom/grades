"use client"

import type { CourseFilterQuery } from "@grades/backend/course"
import { Button, Typography } from "@heroui/react"
import { IconSearchOff } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { EMPTY_COURSE_FILTER_QUERY } from "../course-filter-parsers"

export const CourseListEmptyState = () => {
  const t = useTranslations()
  const { reset } = useFormContext<CourseFilterQuery>()

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg px-6 py-10 text-center" role="status">
      <div className="flex size-11 items-center justify-center rounded-full bg-border">
        <IconSearchOff className="size-5 text-neutral-400 dark:text-stone-400" stroke={1.75} aria-hidden />
      </div>

      <div className="flex max-w-xs flex-col gap-1">
        <Typography type="body" className="text-base font-medium text-neutral-800 dark:text-stone-100">
          {t("CourseList.empty.title")}
        </Typography>
        <Typography type="body-sm" className="text-muted">
          {t("CourseList.empty.hint")}
        </Typography>
      </div>

      <Button variant="outline" size="sm" onPress={() => reset(EMPTY_COURSE_FILTER_QUERY)}>
        {t("CourseList.empty.clearFilters")}
      </Button>
    </div>
  )
}
