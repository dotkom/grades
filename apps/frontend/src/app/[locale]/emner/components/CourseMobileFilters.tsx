"use client"

import { Button, Drawer } from "@heroui/react"
import { IconFilter2, IconX } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { CourseFiltersForm } from "./CourseFiltersForm"

export const MobileCourseFilters = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const t = useTranslations("CourseFilters")

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const onChange = () => {
      if (mediaQuery.matches) {
        setIsDrawerOpen(false)
      }
    }
    onChange()
    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return (
    <div className="md:hidden shrink-0">
      <Drawer>
        <Button variant="outline" aria-label={t("openAriaLabel")} onPress={() => setIsDrawerOpen(true)}>
          {t("filterButton")}
          <IconFilter2 className="size-4" stroke={1.8} />
        </Button>

        <Drawer.Backdrop isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <Drawer.Content placement="bottom">
            <Drawer.Dialog className="bg-overlay">
              <Drawer.Handle />
              <Drawer.Header className="pt-0 flex flex-row items-center justify-between gap-4">
                <Drawer.Heading>{t("drawerTitle")}</Drawer.Heading>
                <Button slot="close" isIconOnly variant="ghost" aria-label={t("closeAriaLabel")}>
                  <IconX className="size-5" stroke={1.8} />
                </Button>
              </Drawer.Header>
              <Drawer.Body className="">
                <CourseFiltersForm idPrefix="mobile" showSort />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  )
}
