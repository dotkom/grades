"use client"

import { serializeSemesterKey } from "@grades/backend/course"
import { sortGradeDistributionsByYearAndSemester, type GradeDistribution } from "@grades/backend/grade-distribution"
import { cn, ListBox, Select, Separator } from "@heroui/react"
import { IconChevronDown } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { parseAsPeriodSelection, type PeriodSelection } from "../course-page-params"
import { useCoursePeriodView } from "../useCoursePeriodView"
import { useFormatComparePeriodLabel, usePeriodLabel } from "../usePeriodLabel"
import { ComparisonSelectItem } from "./CourseKpiCard/ComparisonSelectItem"

type Props = {
  gradeDistributions: GradeDistribution[]
}

function periodSelectionKey(selection: PeriodSelection): string | null {
  if (selection.kind === "preset") {
    return selection.preset
  }

  if (selection.semester != null) {
    return serializeSemesterKey(selection.semester)
  }

  return null
}

export function ComparisonSelect({ gradeDistributions }: Props) {
  const { periodSelection, comparisonPeriodSelection, setCompare } = useCoursePeriodView(gradeDistributions)

  const t = useTranslations()
  const periodLabel = usePeriodLabel()
  const formatComparePeriodLabel = useFormatComparePeriodLabel()

  const comparisonValue = periodSelectionKey(comparisonPeriodSelection)
  const disabledKey = periodSelectionKey(periodSelection)
  const disabledKeys = disabledKey != null ? [disabledKey] : []

  return (
    <Select
      aria-label={t("CoursePage.kpiCard.compareSelectAriaLabel")}
      value={comparisonValue}
      disabledKeys={disabledKeys}
      onChange={(value) => {
        if (value == null || Array.isArray(value)) {
          return
        }

        const selection = parseAsPeriodSelection.parse(String(value))
        if (selection == null) {
          return
        }

        setCompare(selection)
      }}
      className="w-fit"
    >
      <Select.Trigger
        className={cn(
          "h-7 w-fit min-h-0! items-center rounded-lg border-none ps-2 pe-7! text-xs font-medium shadow-none sm:h-8 sm:ps-3 sm:pe-8! sm:text-sm",
          "bg-default text-neutral-950 hover:bg-neutral-200/80 dark:text-stone-200 dark:hover:bg-stone-600",
          "data-[focus-visible=true]:ring-0 data-[focus-visible=true]:outline-none"
        )}
      >
        <Select.Value className="min-w-max flex-none whitespace-nowrap wrap-normal text-xs! leading-normal text-current sm:text-sm!">
          <span className="sm:hidden">{formatComparePeriodLabel(comparisonPeriodSelection, "compact")}</span>
          <span className="hidden sm:inline">{formatComparePeriodLabel(comparisonPeriodSelection)}</span>
        </Select.Value>
        <Select.Indicator className="end-1.5 size-3.5 text-muted sm:end-2">
          <IconChevronDown className="pointer-events-none size-3.5!" stroke={1.75} />
        </Select.Indicator>
      </Select.Trigger>

      <Select.Popover className="max-h-60! min-w-(--trigger-width) overflow-y-auto rounded-xl border border-border bg-overlay">
        <ListBox className="p-1">
          <ComparisonSelectItem value="LAST_THREE_YEARS">
            {t("Enums.PeriodPreset.LAST_THREE_YEARS")}
          </ComparisonSelectItem>

          <ComparisonSelectItem value="ALL_YEARS">{t("Enums.PeriodPreset.ALL_YEARS")}</ComparisonSelectItem>

          <Separator className="my-1 bg-separator" />

          {sortGradeDistributionsByYearAndSemester(gradeDistributions).map((ref) => {
            const semester = { year: ref.year, semester: ref.semester }
            const value = serializeSemesterKey(semester)

            return (
              <ComparisonSelectItem key={value} value={value}>
                {periodLabel({ kind: "semester", semester })}
              </ComparisonSelectItem>
            )
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
