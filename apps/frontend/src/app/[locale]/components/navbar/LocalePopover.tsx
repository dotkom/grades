"use client"

import { setLocalePreferenceCookie } from "@/i18n/locale-preference"
import { usePathname, useRouter } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { Button, Dropdown } from "@heroui/react"
import { IconCheck, IconWorld } from "@tabler/icons-react"
import { useLocale, useTranslations } from "next-intl"

export const LocalePopover = () => {
  const locale = useLocale()
  const t = useTranslations("LocalePopover")

  const router = useRouter()
  const pathname = usePathname()

  const onChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      return
    }

    setLocalePreferenceCookie(newLocale)
    router.replace({ pathname }, { locale: newLocale, scroll: false })
  }

  const currentLanguage = locale === "no" ? t("norwegian") : t("english")

  return (
    <Dropdown>
      <Button aria-label={t("ariaLabel", { language: currentLanguage })} variant="ghost">
        <IconWorld stroke={1.8} className="size-5" />
        {currentLanguage}
      </Button>
      <Dropdown.Popover className="min-w-28 rounded-xl border border-border">
        <Dropdown.Menu
          selectedKeys={new Set([locale])}
          selectionMode="single"
          onAction={(key) => onChange(key as Locale)}
        >
          <Dropdown.Item
            id="no"
            textValue={t("norwegian")}
            className="rounded-lg gap-2 hover:bg-default data-[hovered=true]:bg-default"
          >
            {t("norwegian")}
            {locale === "no" && <IconCheck className="size-4 ms-auto" stroke={1.8} />}
          </Dropdown.Item>

          <Dropdown.Item
            id="en"
            textValue={t("english")}
            className="rounded-lg gap-2 hover:bg-default data-[hovered=true]:bg-default"
          >
            {t("english")}
            {locale === "en" && <IconCheck className="size-4 ms-auto" stroke={1.8} />}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
