"use client"

import type { CourseFilterQuery } from "@grades/backend/course"
import { Button, cn, Separator } from "@heroui/react"
import { IconX } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { useFormContext, useWatch } from "react-hook-form"
import {
  DEFAULT_COURSE_FILTER_SORT,
  EMPTY_COURSE_FILTER_QUERY,
  findCourseFilterSortOption,
  parseCourseFilterSortValue,
  toCourseFilterSortValue,
} from "../course-filter-parsers"

type ChipFilterKey = Exclude<keyof CourseFilterQuery, "orderBy">
type Chip = { key: string; label: string; onClear: () => void }
type Filters = Partial<CourseFilterQuery>

function removeChips<T extends string>(
  values: T[] | undefined,
  field: string,
  labelOf: (value: T) => string,
  clear: (next: T[]) => void
): Chip[] {
  const list = values ?? []

  return list.map((value) => ({
    key: `${field}-${value}`,
    label: labelOf(value),
    onClear: () => clear(list.filter((v) => v !== value)),
  }))
}

export const CourseFilterChips = () => {
  const t = useTranslations()
  const { control, setValue, reset, getValues } = useFormContext<CourseFilterQuery>()
  const filters = useWatch({ control })

  const chipSources = {
    bySearch: (p) =>
      p.bySearch?.trim()
        ? [{ key: "bySearch", label: `'${p.bySearch}'`, onClear: () => setValue("bySearch", "") }]
        : [],
    bySemester: (p) =>
      removeChips(
        p.bySemester,
        "bySemester",
        (semester) => t(`Enums.Semester.${semester}`),
        (next) => setValue("bySemester", next)
      ),
    byTeachingLanguage: (p) =>
      removeChips(
        p.byTeachingLanguage,
        "byTeachingLanguage",
        (language) => t(`Enums.TeachingLanguage.${language}`),
        (next) => setValue("byTeachingLanguage", next)
      ),
    byCampus: (p) =>
      removeChips(
        p.byCampus,
        "byCampus",
        (campus) => t(`Enums.Campus.${campus}`),
        (next) => setValue("byCampus", next)
      ),
    byMinGrade: (p) =>
      p.byMinGrade
        ? [
            {
              key: "byMinGrade",
              label: t(`CourseFilters.minGradeOptions.${p.byMinGrade}`),
              onClear: () => setValue("byMinGrade", null),
            },
          ]
        : [],
    sortBy: (p) => {
      const value = toCourseFilterSortValue(p.sortBy, p.orderBy)
      if (value === DEFAULT_COURSE_FILTER_SORT) {
        return []
      }

      const option = findCourseFilterSortOption(value)
      const defaults = parseCourseFilterSortValue(DEFAULT_COURSE_FILTER_SORT)
      if (defaults == null) {
        return []
      }

      return [
        {
          key: "sortBy",
          label: t(`CourseListToolbar.sortOptions.${option.labelKey}`),
          onClear: () => reset({ ...getValues(), ...defaults }),
        },
      ]
    },
  } satisfies Record<ChipFilterKey, (p: Filters) => Chip[]>

  const chips = (Object.keys(chipSources) as ChipFilterKey[]).flatMap((key) => chipSources[key](filters))

  if (chips.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 transition duration-500">
      {chips.map((chip) => (
        <FilterChip key={chip.key} onPress={chip.onClear} label={chip.label} />
      ))}

      <Separator orientation="vertical" className="mx-1 h-4 self-center bg-separator" aria-hidden />

      <FilterChip onPress={() => reset(EMPTY_COURSE_FILTER_QUERY)} label={t("CourseFilters.clearAll")} isClearAll />
    </div>
  )
}

type FilterChipProps = {
  onPress: () => void
  label: string
  isClearAll?: boolean
}

const FilterChip = ({ onPress, label, isClearAll = false }: FilterChipProps) => {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      className={cn(
        "group h-6 min-h-6 max-w-full min-w-0 shrink gap-1 rounded-md",
        "px-2 text-xs font-normal whitespace-normal wrap-break-word text-left",
        "bg-default text-neutral-700 hover:bg-default-hover data-[hovered=true]:bg-default-hover",
        "dark:bg-field dark:text-stone-200 dark:hover:bg-default dark:data-[hovered=true]:bg-default"
      )}
    >
      <span className="min-w-0 wrap-break-word">{label}</span>
      {isClearAll === false && <IconX className="size-3 shrink-0 opacity-50 group-hover:opacity-100" aria-hidden />}
    </Button>
  )
}
