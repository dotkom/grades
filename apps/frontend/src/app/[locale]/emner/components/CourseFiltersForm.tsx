"use client"

import {
  CourseCampusSchema,
  MinLetterGradeFilterSchema,
  SemesterSchema,
  TeachingLanguageSchema,
  type CourseFilterQuery,
} from "@grades/backend/course"
import { Checkbox, cn, Label, ListBox, Select } from "@heroui/react"
import { IconChevronDown } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import type { PropsWithChildren } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  COURSE_FILTER_FIELD_TRIGGER_CLASS,
  COURSE_FILTER_SELECT_ITEM_CLASS,
  COURSE_FILTER_SELECT_POPOVER_CLASS,
  CourseSortSelect,
} from "./CourseSortSelect"

const MIN_GRADE_OPTIONS_ALL = "ALL"

const semesterOptions = SemesterSchema.options.filter((s) => s !== "SUMMER")

const FIELD_LABEL_CLASS = "font-body text-sm leading-none font-medium select-none text-neutral-600 dark:text-stone-300"

type Props = {
  idPrefix: string
  showSort?: boolean
  className?: string
}

export function CourseFiltersForm({ idPrefix, showSort = false, className }: Props) {
  const t = useTranslations()
  const { control, setValue } = useFormContext<CourseFilterQuery>()

  const bySemester = useWatch({ control, name: "bySemester" }) ?? []
  const byTeachingLanguage = useWatch({ control, name: "byTeachingLanguage" }) ?? []
  const byCampus = useWatch({ control, name: "byCampus" }) ?? []
  const byMinGrade = useWatch({ control, name: "byMinGrade" })

  const fieldId = (name: string) => `${idPrefix}-${name}`
  const minGradeValue = byMinGrade ?? MIN_GRADE_OPTIONS_ALL
  const minGradeLabel = byMinGrade
    ? t(`CourseFilters.minGradeOptions.${byMinGrade}`)
    : t("CourseFilters.minGradeOptions.ALL")

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {showSort === true && (
        <Field label={t("CourseFilters.sortBy")} labelFor={fieldId("sortBy")}>
          <CourseSortSelect id={fieldId("sortBy")} className="w-full" />
        </Field>
      )}

      <Field label={t("Common.Semester")}>
        <div className="flex flex-col gap-2">
          {semesterOptions.map((semester) => (
            <MultiSelectCheckboxRow
              key={semester}
              id={fieldId(semester)}
              value={bySemester}
              option={semester}
              onChange={(next) => setValue("bySemester", next)}
              label={t(`Enums.Semester.${semester}`)}
            />
          ))}
        </div>
      </Field>

      <Field label={t("CourseFilters.teachingLanguage")}>
        <div className="flex flex-col gap-2">
          {TeachingLanguageSchema.options.map((language) => (
            <MultiSelectCheckboxRow
              key={language}
              id={fieldId(language)}
              value={byTeachingLanguage}
              option={language}
              onChange={(next) => setValue("byTeachingLanguage", next)}
              label={t(`Enums.TeachingLanguage.${language}`)}
            />
          ))}
        </div>
      </Field>

      <Field label={t("CourseFilters.campus")}>
        <div className="flex flex-col gap-2">
          {CourseCampusSchema.options.map((campus) => (
            <MultiSelectCheckboxRow
              key={campus}
              id={fieldId(campus)}
              value={byCampus}
              option={campus}
              onChange={(next) => setValue("byCampus", next)}
              label={t(`Enums.Campus.${campus}`)}
            />
          ))}
        </div>
      </Field>

      <Field label={t("CourseFilters.minGrade")} labelFor={fieldId("byMinGrade")}>
        <Select
          aria-label={t("CourseFilters.minGrade")}
          value={minGradeValue}
          onChange={(next) => {
            if (next == null || Array.isArray(next)) {
              return
            }

            const value = String(next)
            if (value === MIN_GRADE_OPTIONS_ALL) {
              setValue("byMinGrade", null)
              return
            }

            setValue("byMinGrade", value as NonNullable<CourseFilterQuery["byMinGrade"]>)
          }}
        >
          <Select.Trigger id={fieldId("byMinGrade")} className={COURSE_FILTER_FIELD_TRIGGER_CLASS}>
            <Select.Value className="text-sm">{minGradeLabel}</Select.Value>
            <Select.Indicator className="end-1.5 size-3.5 text-muted sm:end-2">
              <IconChevronDown className="pointer-events-none size-3.5!" stroke={1.75} />
            </Select.Indicator>
          </Select.Trigger>

          <Select.Popover className={COURSE_FILTER_SELECT_POPOVER_CLASS}>
            <ListBox className="p-1">
              <ListBox.Item
                id={MIN_GRADE_OPTIONS_ALL}
                textValue={t("CourseFilters.minGradeOptions.ALL")}
                className={COURSE_FILTER_SELECT_ITEM_CLASS}
              >
                {t("CourseFilters.minGradeOptions.ALL")}
              </ListBox.Item>

              {MinLetterGradeFilterSchema.options.map((option) => {
                const label = t(`CourseFilters.minGradeOptions.${option}`)

                return (
                  <ListBox.Item key={option} id={option} textValue={label} className={COURSE_FILTER_SELECT_ITEM_CLASS}>
                    {label}
                  </ListBox.Item>
                )
              })}
            </ListBox>
          </Select.Popover>
        </Select>
      </Field>
    </div>
  )
}

type FieldProps = PropsWithChildren<{
  label: string
  labelFor?: string
}>

function Field({ label, labelFor, children }: FieldProps) {
  if (labelFor != null && labelFor !== "") {
    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor={labelFor} className={FIELD_LABEL_CLASS}>
          {label}
        </Label>
        {children}
      </div>
    )
  }

  return (
    <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
      <legend className={cn(FIELD_LABEL_CLASS, "mb-3 p-0")}>{label}</legend>
      {children}
    </fieldset>
  )
}

type MultiSelectCheckboxRowProps<T extends string> = {
  id: string
  label: string
  value: T[]
  option: T
  onChange: (next: T[]) => void
}

function MultiSelectCheckboxRow<T extends string>({
  id,
  label,
  value,
  option,
  onChange,
}: MultiSelectCheckboxRowProps<T>) {
  const isSelected = value.includes(option)

  return (
    <Checkbox
      id={id}
      className="group w-full"
      isSelected={isSelected}
      onChange={(checked) => {
        if (checked === true) {
          onChange(isSelected ? value : [...value, option])
          return
        }

        onChange(value.filter((v) => v !== option))
      }}
    >
      <Checkbox.Content className="w-full">
        <Checkbox.Control
          className={cn(
            "border-field-border bg-field shadow-none before:hidden",
            // Unchecked hover only — selected keeps an accent border so a gray outline doesn't pop in
            "group-hover:group-not-data-[selected=true]:border-field-border-hover",
            "group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent",
            "group-data-[selected=true]:text-accent-foreground",
            "group-data-[selected=true]:group-hover:border-accent-hover group-data-[selected=true]:group-hover:bg-accent-hover"
          )}
        >
          <Checkbox.Indicator />
        </Checkbox.Control>
        <span className="flex-1 text-sm font-normal text-neutral-700 select-none group-hover:text-neutral-900 dark:text-stone-200 dark:group-hover:text-stone-100">
          {label}
        </span>
      </Checkbox.Content>
    </Checkbox>
  )
}
