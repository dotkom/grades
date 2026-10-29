"use client"

import type { GradeDistribution } from "@grades/backend/grade-distribution"
import { Button, Tooltip } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { Layers2Icon } from "@/app/[locale]/components/icons/Layers2Icon"
import { useCoursePeriodView } from "../../useCoursePeriodView"
import { useFormatComparePeriodLabel, usePeriodLabel } from "../../usePeriodLabel"
import { getPeriodCompareFlags, sameSemesters, toAggregatedGradeDistribution } from "../../utils"
import { CourseSectionCard } from "../CourseSectionCard"
import { GradeDistributionBarChart } from "./GradeDistributionBarChart"

type Props = {
  gradeDistributions: GradeDistribution[]
  className?: string
}

export const CourseBarChartCard = ({ gradeDistributions, className }: Props) => {
  const tBar = useTranslations("CoursePage.barChart")
  const periodLabel = usePeriodLabel()
  const formatComparePeriodLabel = useFormatComparePeriodLabel()
  const { params, setOverlay, periodSelection, comparisonPeriodSelection, selectedRows, comparisonRows } =
    useCoursePeriodView(gradeDistributions)

  const primary = useMemo(() => toAggregatedGradeDistribution(selectedRows), [selectedRows])
  const comparison = useMemo(() => {
    if (comparisonRows.length === 0 || sameSemesters(selectedRows, comparisonRows)) {
      return null
    }

    return toAggregatedGradeDistribution(comparisonRows)
  }, [selectedRows, comparisonRows])

  const primaryPeriodLabel = periodLabel(periodSelection)
  const comparisonPeriodLabel = formatComparePeriodLabel(comparisonPeriodSelection)

  const { canGhostCompare } = getPeriodCompareFlags(selectedRows, comparisonRows)
  const canCompare = comparison !== null && canGhostCompare
  const isComparisonEnabled = params.overlay === true && canCompare

  const comparisonDisabledReason =
    comparison === null ? tBar("compareDisabledReason") : tBar("compareDisabledNotComparable")

  return (
    <CourseSectionCard
      className={className}
      title={tBar("title")}
      action={
        <Tooltip delay={100}>
          <Tooltip.Trigger className="inline-flex">
            <Button
              variant={isComparisonEnabled ? "tertiary" : "ghost"}
              size="sm"
              isDisabled={!canCompare}
              onPress={() => setOverlay(!params.overlay)}
              aria-label={tBar("showComparison")}
              className="h-8! font-normal [&_svg]:size-4! [&_svg]:my-0!"
            >
              <Layers2Icon className="size-4 transition-colors" />
              <span className="hidden xs:inline">{tBar("showComparison")}</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content
            showArrow
            className="rounded-lg border border-border/50 bg-overlay px-3 py-1.5 text-sm text-neutral-950 dark:text-stone-200"
            placement="top"
            shouldFlip={false}
          >
            <Tooltip.Arrow className="fill-overlay" />
            <span className="text-sm">{canCompare ? tBar("showComparison") : comparisonDisabledReason}</span>
          </Tooltip.Content>
        </Tooltip>
      }
    >
      <GradeDistributionBarChart
        primary={primary}
        comparison={comparison}
        ghostEnabled={isComparisonEnabled}
        primaryPeriodLabel={primaryPeriodLabel}
        comparisonPeriodLabel={comparisonPeriodLabel}
      />
    </CourseSectionCard>
  )
}
