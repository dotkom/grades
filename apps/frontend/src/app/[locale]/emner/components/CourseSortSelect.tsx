"use client"

import type { CourseFilterQuery } from "@grades/backend/course"
import { cn, ListBox, Select } from "@heroui/react"
import { IconChevronDown } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { useFormContext, useWatch } from "react-hook-form"
import {
  COURSE_FILTER_SORT_OPTIONS,
  findCourseFilterSortOption,
  parseCourseFilterSortValue,
  toCourseFilterSortValue,
} from "../course-filter-parsers"

/** Layout only — field colors/borders come from HeroUI --field-* tokens. */
export const COURSE_FILTER_FIELD_TRIGGER_CLASS = cn(
  "h-9 w-full min-w-0 justify-between gap-1.5 px-3 py-1.5 text-sm whitespace-nowrap"
)

export const COURSE_FILTER_SELECT_ITEM_CLASS = cn(
  "cursor-pointer rounded-lg p-2 gap-0 text-sm text-neutral-950 dark:text-stone-200",
  "hover:bg-default data-[hovered=true]:bg-default data-[focused=true]:bg-default"
)

export const COURSE_FILTER_SELECT_POPOVER_CLASS =
  "max-h-60! min-w-(--trigger-width) overflow-y-auto rounded-xl border border-border bg-overlay"

type Props = {
  id?: string
  className?: string
}

export function CourseSortSelect({ id, className }: Props) {
  const t = useTranslations()
  const { control, getValues, reset } = useFormContext<CourseFilterQuery>()

  const sortBy = useWatch({ control, name: "sortBy" })
  const orderBy = useWatch({ control, name: "orderBy" })
  const value = toCourseFilterSortValue(sortBy, orderBy)
  const selected = findCourseFilterSortOption(value)
  const selectedLabel = t(`CourseListToolbar.sortOptions.${selected.labelKey}`)

  return (
    <Select
      aria-label={t("CourseFilters.sortBy")}
      value={value}
      onChange={(next) => {
        if (next == null || Array.isArray(next)) {
          return
        }

        const parsed = parseCourseFilterSortValue(String(next))
        if (parsed == null) {
          return
        }

        reset({
          ...getValues(),
          ...parsed,
        })
      }}
    >
      <Select.Trigger id={id} className={cn(COURSE_FILTER_FIELD_TRIGGER_CLASS, className)}>
        <Select.Value className="text-sm">{selectedLabel}</Select.Value>
        <Select.Indicator className="end-1.5 size-3.5 text-muted sm:end-2">
          <IconChevronDown className="pointer-events-none size-3.5!" stroke={1.75} />
        </Select.Indicator>
      </Select.Trigger>

      <Select.Popover className={COURSE_FILTER_SELECT_POPOVER_CLASS}>
        <ListBox className="p-1">
          {COURSE_FILTER_SORT_OPTIONS.map((option) => {
            const label = t(`CourseListToolbar.sortOptions.${option.labelKey}`)

            return (
              <ListBox.Item
                key={option.value}
                id={option.value}
                textValue={label}
                className={COURSE_FILTER_SELECT_ITEM_CLASS}
              >
                {label}
              </ListBox.Item>
            )
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
