import { getCourseLocalizedName, type CourseListItem, type Locale } from "@grades/backend/course"
import { useLocale } from "next-intl"

interface Props {
  course: CourseListItem
}

export const CourseAutocompleteSuggestionItem = ({ course }: Props) => {
  const locale = useLocale() as Locale

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[15px] leading-5 font-normal text-wrap text-neutral-950 dark:text-stone-200">
        {getCourseLocalizedName(course, locale)}
      </span>
      <span className="text-sm leading-6 font-medium tabular-nums text-muted">{course.code}</span>
    </div>
  )
}
