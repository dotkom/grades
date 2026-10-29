"use client"

import { cn } from "@heroui/react"
import { useFormatter, useTranslations } from "next-intl"
import { calculateCourseStatistics, type GradeDistribution } from "@grades/backend/grade-distribution"
import { roundAverageGrade } from "@/app/lib/format-stats"
import { useCoursePeriodView } from "../../useCoursePeriodView"
import { useFormatComparePeriodLabel } from "../../usePeriodLabel"
import { getPeriodCompareFlags } from "../../utils"
import { CourseSectionCard } from "../CourseSectionCard"
import { KpiMetric } from "./KpiMetric"

type Props = {
  gradeDistributions: GradeDistribution[]
  className?: string
}

export const CourseKpiCard = ({ gradeDistributions, className }: Props) => {
  const { comparisonPeriodSelection, selectedRows, comparisonRows } = useCoursePeriodView(gradeDistributions)

  const t = useTranslations()
  const format = useFormatter()
  const formatComparePeriodLabel = useFormatComparePeriodLabel()

  const formatNumber = (n: number) =>
    format.number(roundAverageGrade(n), { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const { showLetterKpi, showLetterDelta } = getPeriodCompareFlags(selectedRows, comparisonRows)

  return (
    <CourseSectionCard
      className={className}
      title={<span className="text-sm font-medium dark:text-stone-200">{t("CoursePage.kpiCard.title")}</span>}
      action={
        <span className="mr-3 text-sm leading-6 tabular-nums dark:text-stone-200">
          {t("CoursePage.kpiCard.candidateCount", { count: calculateCourseStatistics(selectedRows).candidateCount })}
        </span>
      }
    >
      <div className={cn("grid divide-border", showLetterKpi ? "grid-cols-2 divide-x" : "grid-cols-1")}>
        {showLetterKpi && (
          <KpiMetric
            allGradeDistributions={gradeDistributions}
            selectedGradeDistributions={selectedRows}
            comparisonGradeDistributions={comparisonRows}
            className="pr-4 sm:pr-6"
            format={formatNumber}
            mode="LETTER"
            comparisonLabel={formatComparePeriodLabel(comparisonPeriodSelection, "inline")}
            showDelta={showLetterDelta}
            showRangeBarComparisonTick={showLetterDelta}
          />
        )}
        <KpiMetric
          allGradeDistributions={gradeDistributions}
          selectedGradeDistributions={selectedRows}
          comparisonGradeDistributions={comparisonRows}
          className={cn(showLetterKpi && "pl-4 sm:pl-6")}
          format={formatNumber}
          mode="PASS_FAIL"
          comparisonLabel={formatComparePeriodLabel(comparisonPeriodSelection, "inline")}
          showDelta={true}
          showRangeBarComparisonTick={true}
        />
      </div>
    </CourseSectionCard>
  )
}
