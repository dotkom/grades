"use client"

import { cn } from "@heroui/react"
import { IconArrowDownRight, IconArrowRight, IconArrowUpRight } from "@tabler/icons-react"
import { useFormatter, useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"
import { mapAverageGradeToLetterGrade, type GradeType } from "@grades/backend/course"
import type { GradeDistribution } from "@grades/backend/grade-distribution"
import { roundAverageGrade, roundPassRate } from "@/app/lib/format-stats"
import { toAggregatedGradeDistribution } from "../../utils"
import { GradeRangeBar } from "./GradeRangeBar"
import { getCourseSemesterExtremes } from "./kpi-extremes"

type Props = {
  allGradeDistributions: GradeDistribution[]
  selectedGradeDistributions: GradeDistribution[]
  comparisonGradeDistributions: GradeDistribution[]
  className?: string
  format: (n: number) => string
  mode: GradeType
  comparisonLabel: string
  showDelta: boolean
  showRangeBarComparisonTick: boolean
}

export function KpiMetric({
  allGradeDistributions,
  selectedGradeDistributions,
  comparisonGradeDistributions,
  className,
  format,
  mode,
  comparisonLabel,
  showDelta,
  showRangeBarComparisonTick,
}: Props) {
  const t = useTranslations()
  const formatter = useFormatter()
  const locale = useLocale()

  const aggregatedGradeDistribution = useMemo(
    () => toAggregatedGradeDistribution(selectedGradeDistributions),
    [selectedGradeDistributions]
  )
  const comparisonAggregatedGradeDistribution = useMemo(
    () => toAggregatedGradeDistribution(comparisonGradeDistributions),
    [comparisonGradeDistributions]
  )

  const selectedAverage = aggregatedGradeDistribution.averageGrade
  const comparisonAverage = comparisonAggregatedGradeDistribution.averageGrade

  const selectedAverageDisplay = selectedAverage == null ? null : roundAverageGrade(selectedAverage)
  const comparisonAverageDisplay = comparisonAverage == null ? null : roundAverageGrade(comparisonAverage)
  const selectedPassRateDisplay = roundPassRate(aggregatedGradeDistribution.passRate)
  const comparisonPassRateDisplay = roundPassRate(comparisonAggregatedGradeDistribution.passRate)

  const mainValue =
    mode === "LETTER"
      ? selectedAverage == null
        ? "—"
        : mapAverageGradeToLetterGrade(selectedAverage)
      : selectedPassRateDisplay

  const secondaryValue =
    selectedAverageDisplay == null
      ? null
      : formatter.number(selectedAverageDisplay, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })

  const parts = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).formatToParts(selectedPassRateDisplay / 100)

  const selectedValue = mode === "PASS_FAIL" ? selectedPassRateDisplay : selectedAverageDisplay
  const comparisonMean = mode === "PASS_FAIL" ? comparisonPassRateDisplay : comparisonAverageDisplay

  const canDiff = selectedValue != null && comparisonMean != null
  const diff = canDiff ? selectedValue - comparisonMean : 0
  const absDiff = Math.abs(diff)
  const diffIsNeutral = !canDiff || diff === 0
  const diffIsPositive = canDiff && !diffIsNeutral && diff > 0
  const diffIsNegative = canDiff && !diffIsNeutral && diff < 0

  const diffValueLabel = diffIsNeutral
    ? t("CoursePage.kpiCard.diffEqual")
    : mode === "PASS_FAIL"
      ? t("CoursePage.kpiCard.passRateDiff", { count: absDiff })
      : format(absDiff)

  const extremes = useMemo(() => getCourseSemesterExtremes(allGradeDistributions, mode), [allGradeDistributions, mode])

  return (
    <div className={cn("flex flex-col gap-5 sm:gap-6", className)}>
      <div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium leading-6 text-muted">
            {mode === "PASS_FAIL" ? t("CoursePage.kpiCard.passRate") : t("CoursePage.kpiCard.averageGrade")}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-baseline">
              <span className="font-heading text-[54px] sm:text-[66px] font-bold leading-none tracking-tight text-foreground tabular-nums">
                {mode === "PASS_FAIL"
                  ? parts.map((part) =>
                      part.type === "percentSign" || part.type === "literal" ? (
                        <span
                          key={part.type + part.value}
                          className="text-[28px] font-medium text-neutral-400 dark:text-stone-500"
                        >
                          {part.value}
                        </span>
                      ) : (
                        <span key={part.type + part.value}>{part.value}</span>
                      )
                    )
                  : mainValue}
              </span>
              {mode === "LETTER" && secondaryValue != null && (
                <span className="text-xl sm:text-2xl font-medium tabular-nums text-muted">{secondaryValue}</span>
              )}
            </div>
            <div className="flex min-h-5 min-w-0 items-center gap-1">
              {showDelta ? (
                <>
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
                    {diffIsPositive ? (
                      <IconArrowUpRight className="size-4 text-green-700 dark:text-green-400" />
                    ) : diffIsNegative ? (
                      <IconArrowDownRight className="size-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <IconArrowRight className="size-4 text-neutral-400 dark:text-stone-500" />
                    )}
                    <span
                      className={cn(
                        "text-sm leading-6",
                        diffIsPositive && "tabular-nums text-green-700 dark:text-green-400",
                        diffIsNegative && "tabular-nums text-red-600 dark:text-red-400",
                        diffIsNeutral && "text-neutral-400 dark:text-stone-500"
                      )}
                    >
                      {diffValueLabel}
                    </span>
                  </span>
                  <span className="hidden text-sm leading-6 text-muted sm:inline">{comparisonLabel}</span>
                </>
              ) : (
                <span className="text-sm leading-6 text-neutral-400 dark:text-stone-500">
                  {t("CoursePage.kpiCard.comparisonNotComparable")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {extremes && selectedValue != null && (
        <div className="hidden sm:block">
          <GradeRangeBar
            min={extremes.min}
            max={extremes.max}
            mean={comparisonMean ?? selectedValue}
            value={selectedValue}
            format={format}
            mode={mode}
            showComparisonTick={showRangeBarComparisonTick && comparisonMean != null}
            diff={diffIsPositive ? "positive" : diffIsNegative ? "negative" : "neutral"}
          />
        </div>
      )}
    </div>
  )
}
