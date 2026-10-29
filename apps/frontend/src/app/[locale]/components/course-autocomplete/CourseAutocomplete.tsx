"use client"

import { CourseFilterParsers } from "@/app/[locale]/emner/course-filter-parsers"
import { useRouter } from "@/i18n/navigation"
import { useTRPC } from "@/utils/trpc/client"
import type { CourseFilterQuery } from "@grades/backend/course"
import { cn, ComboBox, Input, ListBox } from "@heroui/react"
import { IconArrowRight, IconSearch } from "@tabler/icons-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { createSerializer } from "nuqs"
import { useRef, useState, type FormEvent, type KeyboardEvent, type Key } from "react"
import { useDebounce } from "use-debounce"
import { searchFieldGroupClassName } from "../SearchInput"
import { CourseAutocompleteSuggestionSkeleton } from "./CourseAutocompleteSuggestionSkeleton"
import { CourseAutocompleteSuggestions, suggestionItemClassName } from "./CourseAutocompleteSuggestions"

const serialize = createSerializer(CourseFilterParsers)

const SEE_ALL_RESULTS_KEY = "__see_all__"

interface Props {
  className?: string
  inputClassName?: string
  placeholder?: string
  defaultValues: CourseFilterQuery
}

export const CourseAutocomplete = ({ className, inputClassName, placeholder, defaultValues }: Props) => {
  const trpc = useTRPC()
  const router = useRouter()
  const t = useTranslations("CourseAutocomplete")

  const [searchValue, setSearchValue] = useState(defaultValues.bySearch ?? "")
  const [debouncedSearch] = useDebounce(searchValue.trim(), 200)
  const focusedKeyRef = useRef<Key | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: suggestionsPage, isLoading } = useQuery(
    trpc.course.findCourses.queryOptions(
      {
        filter: {
          bySearch: debouncedSearch,
          sortBy: ["CANDIDATE_COUNT"],
          orderBy: "desc",
        },
        limit: 5,
      },
      {
        placeholderData: keepPreviousData,
      }
    )
  )

  const suggestions = suggestionsPage?.items
  const isShowingSkeleton = isLoading || suggestions === undefined
  const resolvedPlaceholder = placeholder ?? t("placeholder")
  const resultsHref = `/emner${serialize({ bySearch: searchValue.trim() })}`

  // Selection restores focus to the input; with menuTrigger="focus" that would reopen the menu.
  // ComboBox does not support controlled isOpen — blur closes it instead.
  const navigate = (href: string) => {
    router.push(href)
    queueMicrotask(() => {
      inputRef.current?.blur()
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(resultsHref)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") {
      return
    }

    // ComboBox selects the highlighted option itself; only submit search when none is highlighted.
    if (focusedKeyRef.current != null) {
      return
    }

    event.preventDefault()
    navigate(resultsHref)
  }

  const onChange = (key: Key | null) => {
    if (key == null) {
      return
    }

    const selectedKey = String(key)

    if (selectedKey === SEE_ALL_RESULTS_KEY) {
      navigate(resultsHref)
      return
    }

    navigate(`/emner/${encodeURIComponent(selectedKey)}`)
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <ComboBox
        aria-label={resolvedPlaceholder}
        allowsCustomValue
        allowsEmptyCollection
        menuTrigger="focus"
        fullWidth
        inputValue={searchValue}
        onInputChange={setSearchValue}
        value={null}
        onChange={onChange}
        onKeyDown={onKeyDown}
        defaultFilter={() => true}
      >
        <ComboBox.InputGroup
          className={cn(
            searchFieldGroupClassName,
            "h-8 w-full min-w-0 cursor-text overflow-hidden pe-0",
            inputClassName
          )}
          onClick={(event) => {
            const target = event.target
            if (!(target instanceof Node)) {
              return
            }

            const input = event.currentTarget.querySelector("input")
            if (input == null || target === input || input.contains(target)) {
              return
            }

            input.focus()
          }}
        >
          <span className="flex items-center justify-center ps-3 text-field-placeholder" aria-hidden>
            <IconSearch className="size-4 shrink-0" />
          </span>
          <Input
            ref={inputRef}
            placeholder={resolvedPlaceholder}
            autoComplete="off"
            className={cn(
              "h-full min-h-0 min-w-0 flex-1 cursor-text overflow-hidden border-0 bg-transparent pe-3 ps-2 shadow-none",
              "text-ellipsis outline-none",
              "focus:border-0 focus:bg-transparent focus:shadow-none focus:ring-0",
              "data-[focus]:border-0 data-[focus]:bg-transparent data-[focus]:shadow-none"
            )}
          />
          <ComboBox.Trigger className="hidden" />
        </ComboBox.InputGroup>

        <ComboBox.Popover
          placement="bottom start"
          offset={4}
          className={cn(
            "rounded-xl border border-border bg-overlay p-1 shadow-md",
            "w-[calc(100dvw-2rem)] max-sm:left-4! sm:w-96"
          )}
        >
          {isShowingSkeleton ? (
            <CourseAutocompleteSkeleton />
          ) : (
            <ListBox className="gap-0 p-0" renderEmptyState={() => <CourseAutocompleteNoResults />}>
              <CourseAutocompleteSuggestions courses={suggestions} focusedKeyRef={focusedKeyRef} />

              {suggestions.length > 0 && (
                <ListBox.Item
                  id={SEE_ALL_RESULTS_KEY}
                  textValue={t("seeAllResults")}
                  className={cn(
                    suggestionItemClassName,
                    "group flex-row items-center gap-1 rounded-t-none border-t border-border px-2 py-3"
                  )}
                >
                  {({ isFocused }) => {
                    if (isFocused) {
                      focusedKeyRef.current = SEE_ALL_RESULTS_KEY
                    } else if (focusedKeyRef.current === SEE_ALL_RESULTS_KEY) {
                      focusedKeyRef.current = null
                    }

                    return (
                      <>
                        <span className="text-sm leading-none text-muted group-hover:text-foreground group-data-[focused=true]:text-foreground">
                          {t("seeAllResults")}
                        </span>
                        <IconArrowRight
                          size={16}
                          className="text-muted motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-data-[focused=true]:translate-x-1 group-hover:text-foreground group-data-[focused=true]:text-foreground"
                        />
                      </>
                    )
                  }}
                </ListBox.Item>
              )}
            </ListBox>
          )}
        </ComboBox.Popover>
      </ComboBox>
    </form>
  )
}

const CourseAutocompleteSkeleton = () => {
  return (
    <>
      <div className="flex flex-col">
        <CourseAutocompleteSuggestionSkeleton />
        <CourseAutocompleteSuggestionSkeleton />
        <CourseAutocompleteSuggestionSkeleton />
        <CourseAutocompleteSuggestionSkeleton />
        <CourseAutocompleteSuggestionSkeleton />
      </div>
      <div aria-hidden className="flex items-center rounded-b-lg border-t border-border px-2 py-3">
        <div className="h-4 w-36 rounded bg-neutral-200 motion-safe:animate-pulse dark:bg-stone-600" />
      </div>
    </>
  )
}

const CourseAutocompleteNoResults = () => {
  const t = useTranslations("CourseAutocomplete")

  return <p className="p-2 text-sm leading-6 text-muted">{t("noResults")}</p>
}
