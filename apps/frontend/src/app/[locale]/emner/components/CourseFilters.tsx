"use client"

import { useTranslations } from "next-intl"

import { CourseFiltersForm } from "./CourseFiltersForm"

export function CourseFilters() {
  const t = useTranslations("CourseFilters")

  return (
    <div className="hidden md:block md:w-64 md:shrink-0">
      <section
        aria-label={t("ariaLabel")}
        className="h-fit w-full rounded-lg border border-border bg-overlay p-6 shadow-b-sm"
      >
        <CourseFiltersForm idPrefix="desktop" />
      </section>
    </div>
  )
}
