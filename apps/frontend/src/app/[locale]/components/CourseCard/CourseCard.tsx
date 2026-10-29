"use client"

import { buildCourseMetaItems } from "@/app/[locale]/emner/[id]/utils"
import { roundPassRate } from "@/app/lib/format-stats"
import { Link } from "@/i18n/navigation"
import { cn } from "@heroui/react"
import { useFormatter, useLocale, useTranslations } from "next-intl"
import { type CourseListItem, getCourseLocalizedName, mapAverageGradeToLetterGrade } from "@grades/backend/course"

interface Props {
  course: CourseListItem
  className?: string
}

export const CourseCard = ({ course, className }: Props) => {
  const t = useTranslations()
  const locale = useLocale()
  const format = useFormatter()

  const isDeprecated = course.lastYearTaught !== null
  const isLetterGrade = course.gradeType === "LETTER"

  const metaItems = buildCourseMetaItems(course, t, format)

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
        "rounded-xl shadow-sm p-4 sm:p-6 grid grid-cols-[1fr_auto] gap-4 sm:gap-8 w-full border",
        "border-border bg-overlay text-neutral-950 dark:text-stone-200",
        "motion-safe:transition-all motion-safe:duration-200",
        "hover:shadow-md hover:border-neutral-400 hover:bg-neutral-50",
        "dark:hover:bg-default dark:hover:border-stone-600",
        isDeprecated && "border-dashed border-neutral-300 dark:border-border",
        className
      )}
    >
      <div className="flex flex-col gap-6 h-full min-h-0 min-w-0">
        <div className="flex flex-col gap-1">
          <span className="text-lg sm:text-xl font-normal line-clamp-2 wrap-break-word hyphens-auto" lang={locale}>
            {getCourseLocalizedName(course, locale)}
          </span>
          <span className="text-sm sm:text-base font-bold text-muted">{course.code}</span>
        </div>

        <div className="flex max-h-5 flex-wrap items-center gap-x-2.5 overflow-hidden">
          {metaItems.map((item, index) => (
            <div key={item} className="flex shrink-0 items-center gap-x-2.5 whitespace-nowrap">
              {index > 0 && <span className="size-1 rounded-full bg-neutral-400 dark:bg-stone-500" aria-hidden />}
              <span className="text-sm leading-6 text-neutral-600 dark:text-stone-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="min-h-4 flex items-center">
          <span className="text-xs leading-5 font-medium text-muted h-7 flex items-end">
            {isLetterGrade ? t("CourseCard.passRate", { rate: passRateDisplay }) : t("CourseCard.passFail")}
          </span>
        </div>

        <span className="text-5xl font-bold leading-none tracking-tight tabular-nums text-foreground">
          {isLetterGrade
            ? mapAverageGradeToLetterGrade(course.averageGradeLastThreeYears)
            : passRateParts.map((part) =>
                part.type === "percentSign" || part.type === "literal" ? (
                  <span
                    key={part.type + part.value}
                    className="text-3xl font-medium text-neutral-400 dark:text-stone-500"
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
