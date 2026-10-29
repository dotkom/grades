import { getCourseLocalizedName, type CourseListItem, type Locale } from "@grades/backend/course"
import { cn, ListBox } from "@heroui/react"
import { useLocale } from "next-intl"
import type { Key, MutableRefObject } from "react"
import { CourseAutocompleteSuggestionItem } from "./CourseAutocompleteSuggestionItem"

export const suggestionItemClassName = cn(
  "group h-auto cursor-pointer flex-col items-start gap-0 rounded-lg p-2",
  "text-neutral-950 dark:text-stone-200",
  // HeroUI list-box-item applies status-focused (ring-focus) + a box-shadow transition;
  // that flashes a primary ring on the previous item when arrowing. Background only.
  "transition-none!",
  "outline-none! outline-transparent!",
  "shadow-none! ring-0! ring-transparent! ring-offset-0!",
  "data-[pressed=true]:scale-100!",
  "focus-visible:outline-none! focus-visible:shadow-none! focus-visible:ring-0!",
  "data-[focus-visible=true]:outline-none! data-[focus-visible=true]:shadow-none!",
  "data-[focus-visible=true]:ring-0! data-[focus-visible=true]:ring-transparent!",
  "hover:bg-default data-[hovered=true]:bg-default",
  "data-[focused=true]:bg-default data-[focus-visible=true]:bg-default"
)

interface Props {
  courses: CourseListItem[]
  focusedKeyRef: MutableRefObject<Key | null>
}

export const CourseAutocompleteSuggestions = ({ courses, focusedKeyRef }: Props) => {
  const locale = useLocale() as Locale

  return (
    <>
      {courses.map((course, index) => (
        <ListBox.Item
          key={course.id}
          id={course.code}
          textValue={`${course.code} ${getCourseLocalizedName(course, locale)}`}
          className={cn(suggestionItemClassName, index === courses.length - 1 && "rounded-b-none")}
        >
          {({ isFocused }) => {
            if (isFocused) {
              focusedKeyRef.current = course.code
            } else if (focusedKeyRef.current === course.code) {
              focusedKeyRef.current = null
            }

            return <CourseAutocompleteSuggestionItem course={course} />
          }}
        </ListBox.Item>
      ))}
    </>
  )
}
