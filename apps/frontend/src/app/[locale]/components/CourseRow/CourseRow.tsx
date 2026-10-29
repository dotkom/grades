"use client"

import { Link } from "@/i18n/navigation"
import { cn } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { getCourseLocalizedName, mapAverageGradeToLetterGrade, type CourseListItem } from "@grades/backend/course"
import { roundPassRate } from "../../../lib/format-stats"

interface Props {
  course: CourseListItem
  className?: string
}

export const CourseRow = ({ course, className }: Props) => {
  const t = useTranslations()
  const locale = useLocale()

  const isLetterGrade = course.gradeType === "LETTER"
  const name = getCourseLocalizedName(course, locale)

  const passRateDisplay = roundPassRate(course.passRateLastThreeYears)
  const passRateParts = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).formatToParts(passRateDisplay / 100)

  return (
    <Link
      prefetch={false}
      href={`/emner/${encodeURIComponent(course.code)}`}
      className={cn(
        "flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-4 sm:py-3.5",
        "bg-overlay text-neutral-950 dark:text-stone-200",
        "hover:bg-neutral-50 dark:hover:bg-default/80",
        "focus-visible:outline-none focus-visible:bg-default",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <span className="shrink-0 text-xs sm:w-24 sm:text-sm font-bold tabular-nums text-muted">{course.code}</span>

        <span
          className="min-w-0 text-sm sm:max-w-2xl sm:text-base font-normal line-clamp-2 sm:line-clamp-1 wrap-break-word hyphens-auto"
          lang={locale}
          title={name}
        >
          {name}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3 self-center">
        {isLetterGrade ? (
          <span className="shrink-0 whitespace-nowrap text-xs font-medium text-muted sm:text-sm">
            {t("CourseCard.passRate", { rate: passRateDisplay })}
          </span>
        ) : (
          <span className="hidden sm:inline shrink-0 whitespace-nowrap text-xs font-medium text-muted sm:text-sm">
            {t("CourseCard.passFail")}
          </span>
        )}

        <span
          className={cn(
            "min-w-7 sm:min-w-8 text-right leading-none tracking-tight tabular-nums text-foreground",
            isLetterGrade ? "text-lg sm:text-xl font-bold" : "text-base sm:text-lg font-semibold"
          )}
        >
          {isLetterGrade
            ? mapAverageGradeToLetterGrade(course.averageGradeLastThreeYears)
            : passRateParts.map((part) =>
                part.type === "percentSign" || part.type === "literal" ? (
                  <span
                    key={part.type + part.value}
                    className="text-xs sm:text-sm font-medium text-neutral-400 dark:text-stone-500"
                  >
                    {part.value}
                  </span>
                ) : (
                  <span key={part.type + part.value}>{part.value}</span>
                )
              )}
        </span>
      </div>
    </Link>
  )
}
