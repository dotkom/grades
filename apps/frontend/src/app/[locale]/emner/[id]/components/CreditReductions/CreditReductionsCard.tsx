import type { Course, CreditReductionDetail } from "@grades/backend/course"
import { cn } from "@heroui/react"
import { getFormatter, getTranslations } from "next-intl/server"
import { CreditReductionsList } from "./CreditReductionsList"

const TITLE_ID = "credit-reductions-title"

interface Props {
  creditReductions: CreditReductionDetail[]
  course: Course
  className?: string
}

export const CreditReductionsCard = async ({ creditReductions, course, className }: Props) => {
  if (creditReductions.length === 0) {
    return null
  }

  const format = await getFormatter()
  const t = await getTranslations("CoursePage.CourseAbout.CreditReductions")

  return (
    <aside
      aria-labelledby={TITLE_ID}
      className={cn(
        "flex h-fit flex-col gap-3 rounded-lg border border-border bg-neutral-50 dark:bg-overlay",
        className
      )}
    >
      <div className="flex flex-col gap-2 border-b border-border p-4 sm:p-6 pb-2!">
        <h3 id={TITLE_ID} className="text-sm font-medium text-neutral-600 dark:text-stone-300">
          {t("title")}
        </h3>
        <p className="text-[13px] leading-4 text-pretty text-muted">
          {course.credits !== null
            ? t("description", {
                code: course.code,
                credits: format.number(course.credits, { maximumFractionDigits: 1 }),
              })
            : t("descriptionWithoutCredits", { code: course.code })}
        </p>
      </div>

      <CreditReductionsList creditReductions={creditReductions} />
    </aside>
  )
}
