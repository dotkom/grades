"use client"

import { parseSemesterKey, serializeSemesterKey, type SemesterKey } from "@grades/backend/course"
import { sortGradeDistributionsByYearAndSemester, type GradeDistribution } from "@grades/backend/grade-distribution"
import { Button, cn, ListBox, Select, Separator } from "@heroui/react"
import { IconChevronDown } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useRef } from "react"
import type { PeriodPreset } from "../course-page-params"
import { useCoursePeriodView } from "../useCoursePeriodView"
import { usePeriodLabel } from "../usePeriodLabel"

const SELECT_ITEM_CLASS = cn(
  "cursor-pointer rounded-lg p-2 gap-0 text-sm text-neutral-950 dark:text-stone-200",
  "hover:bg-default data-[hovered=true]:bg-default data-[focused=true]:bg-default"
)

const tabClassName =
  "h-auto shrink-0 px-2 py-1.5 text-xs font-medium focus-visible:ring-inset sm:px-3 sm:py-2 sm:text-sm"

type Props = {
  gradeDistributions: GradeDistribution[]
}

export const SemesterTabs = ({ gradeDistributions }: Props) => {
  const { setPeriod, periodSelection } = useCoursePeriodView(gradeDistributions)
  const t = useTranslations()
  const periodLabel = usePeriodLabel()

  const selectedTabRef = useRef<HTMLButtonElement>(null)

  // Scroll to selected tab on mount on mobile
  useEffect(() => {
    if (!window.matchMedia("(max-width: 639px)").matches) {
      return
    }

    selectedTabRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    })
  }, [])

  const refIfSelected = (isSelected: boolean) => (isSelected ? selectedTabRef : undefined)

  const semestersNewestFirst = useMemo(
    () =>
      sortGradeDistributionsByYearAndSemester(gradeDistributions).map((gd) => ({
        year: gd.year,
        semester: gd.semester,
      })),
    [gradeDistributions]
  )

  const recentSemesters = semestersNewestFirst.slice(0, 3)
  const olderSemesters = semestersNewestFirst.slice(3)

  const latestYear = semestersNewestFirst.at(0)?.year ?? 0
  const threeYearsCutoff = latestYear - 2
  const showLastThreeYears = semestersNewestFirst.some((semester) => semester.year < threeYearsCutoff)
  const showAllYears = semestersNewestFirst.length > 1

  const presets: PeriodPreset[] = []

  if (showLastThreeYears) {
    presets.push("LAST_THREE_YEARS")
  }

  if (showAllYears) {
    presets.push("ALL_YEARS")
  }

  const selectSemester = (semester: SemesterKey) => {
    setPeriod({
      kind: "semester",
      semester,
    })
  }

  const selectPreset = (preset: PeriodPreset) => {
    setPeriod({
      kind: "preset",
      preset,
    })
  }

  const isSemesterSelected = (semester: SemesterKey) => {
    if (periodSelection.kind === "preset" || periodSelection.semester === null) {
      return false
    }

    return periodSelection.semester.year === semester.year && periodSelection.semester.semester === semester.semester
  }

  const olderSelection = olderSemesters.find((semester) => isSemesterSelected(semester)) ?? null
  const isOlderSelected = olderSelection !== null

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto sm:gap-3",
        "scrollbar-none [&::-webkit-scrollbar]:hidden",
        "mask-[linear-gradient(to_right,black_calc(100%-0.5rem),transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,black_calc(100%-0.5rem),transparent)]"
      )}
    >
      {recentSemesters.map((semester) => {
        const isSelected = isSemesterSelected(semester)

        return (
          <Button
            key={serializeSemesterKey(semester)}
            ref={refIfSelected(isSelected)}
            variant={isSelected ? "primary" : "outline"}
            className={tabClassName}
            onPress={() => selectSemester(semester)}
          >
            {periodLabel({ kind: "semester", semester })}
          </Button>
        )
      })}

      {olderSemesters.length > 0 && (
        <Select
          aria-label={t("CoursePage.semesterTabs.olderSemesters")}
          className="w-fit shrink-0"
          value={olderSelection != null ? serializeSemesterKey(olderSelection) : null}
          onChange={(value) => {
            if (value == null || Array.isArray(value)) {
              return
            }

            const semester = parseSemesterKey(String(value))
            if (semester != null) {
              selectSemester(semester)
            }
          }}
        >
          <Select.Trigger
            ref={refIfSelected(isOlderSelected)}
            className={cn(
              "w-max min-h-0! items-center whitespace-nowrap pe-7! sm:pe-8!",
              tabClassName,
              isOlderSelected &&
                "border-transparent bg-accent text-accent-foreground hover:border-transparent hover:bg-accent-hover data-[hovered=true]:bg-accent-hover"
            )}
          >
            <Select.Value className="min-w-max flex-none whitespace-nowrap wrap-normal text-xs! leading-normal text-current sm:text-sm! data-[placeholder=true]:text-current">
              {olderSelection != null
                ? periodLabel({ kind: "semester", semester: olderSelection })
                : t("CoursePage.semesterTabs.olderSemesters")}
            </Select.Value>
            <Select.Indicator className="end-1.5 size-4 text-current sm:end-2">
              <IconChevronDown
                className="pointer-events-none size-4! motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out"
                stroke={1.75}
              />
            </Select.Indicator>
          </Select.Trigger>

          <Select.Popover className="max-h-60! w-(--trigger-width) min-w-(--trigger-width) max-w-(--trigger-width) overflow-y-auto rounded-xl border border-border bg-overlay">
            <ListBox className="p-1">
              {olderSemesters.map((semester) => {
                const value = serializeSemesterKey(semester)
                const label = periodLabel({ kind: "semester", semester })

                return (
                  <ListBox.Item key={value} id={value} textValue={label} className={SELECT_ITEM_CLASS}>
                    {label}
                  </ListBox.Item>
                )
              })}
            </ListBox>
          </Select.Popover>
        </Select>
      )}

      {presets.length > 0 && (
        <>
          <Separator orientation="vertical" className="bg-separator" />

          {presets.map((preset) => {
            const isSelected = periodSelection.kind === "preset" && periodSelection.preset === preset

            return (
              <Button
                key={preset}
                variant={isSelected ? "primary" : "outline"}
                className={tabClassName}
                onPress={() => selectPreset(preset)}
                ref={refIfSelected(isSelected)}
              >
                {t(`Enums.PeriodPreset.${preset}`)}
              </Button>
            )
          })}
        </>
      )}
    </div>
  )
}
