"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useSelectedLayoutSegments } from "next/navigation"
import { CourseAutocomplete } from "../course-autocomplete/CourseAutocomplete"
import { LocalePopover } from "./LocalePopover"
import { MobileNavigation } from "./MobileNavigation"
import { ThemePopover } from "./ThemePopover"

export const Navbar = () => {
  const t = useTranslations("Navbar")
  const pathname = usePathname()

  const segments = useSelectedLayoutSegments()
  const isCourseListPageRoute = pathname === "/emner"
  const showCourseSearch = segments?.[0] === "emner" && segments?.[1] != null

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b border-border/80",
        "bg-overlay/85 dark:bg-overlay/75 backdrop-blur-md"
      )}
    >
      <div className={cn("flex h-16 w-full items-center justify-between", "mx-auto max-w-7xl", "gap-6 px-4 lg:px-12")}>
        <div className="flex items-center gap-4 sm:gap-6 w-full min-w-0">
          <Link
            href="/"
            className="group inline-flex items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-focus/20 py-0.5 px-2 -ml-2"
          >
            <span className="font-heading text-xl font-semibold sm:text-2xl text-foreground">Grades</span>
          </Link>

          <Link
            href="/emner"
            className={cn(
              "hidden sm:inline-flex items-center rounded-lg px-2.5 py-1.5 font-medium transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-focus/20",
              isCourseListPageRoute
                ? "bg-default text-default-foreground"
                : "text-muted hover:bg-default hover:text-default-foreground"
            )}
          >
            {t("courses")}
          </Link>

          {showCourseSearch && (
            <div className="min-w-0 flex-1 max-w-96">
              <CourseAutocomplete defaultValues={{}} />
            </div>
          )}
        </div>

        <div className="items-center gap-3 hidden sm:flex">
          <LocalePopover />
          <ThemePopover />
        </div>

        <MobileNavigation />
      </div>
    </header>
  )
}
