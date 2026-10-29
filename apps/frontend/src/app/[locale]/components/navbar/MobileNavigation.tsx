"use client"

import { setLocalePreferenceCookie } from "@/i18n/locale-preference"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { Button, cn, Popover, Separator } from "@heroui/react"
import { IconDeviceMobile, IconMenu2, IconMoon, IconPalette, IconSun, IconWorld } from "@tabler/icons-react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useState } from "react"

const navLinkClassName = (isActive: boolean) =>
  cn(
    "group relative flex items-center justify-between gap-2",
    "rounded-md px-3 py-2.5 text-[15px] font-medium",
    "transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-focus/20 ring-inset",
    isActive ? "bg-default text-default-foreground hover:bg-default-hover" : "text-foreground hover:bg-default"
  )

export const MobileNavigation = () => {
  const t = useTranslations("Navbar")
  const tTheme = useTranslations("ThemePopover")
  const tLocale = useTranslations("LocalePopover")
  const pathname = usePathname()
  const locale = useLocale()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const isHomePageRoute = pathname === "/"
  const isCourseListPageRoute = pathname === "/emner"

  const onThemeChange = (newTheme: "light" | "dark" | "system") => {
    if (newTheme === theme) {
      return
    }

    setTheme(newTheme)
  }

  const onLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      return
    }

    setLocalePreferenceCookie(newLocale)
    router.replace({ pathname }, { locale: newLocale, scroll: false })
  }

  return (
    <div className="sm:hidden">
      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button isIconOnly variant="ghost" aria-label={isOpen ? t("closeNavigation") : t("openNavigation")}>
          <IconMenu2 className="size-6" />
        </Button>

        <Popover.Content
          placement="bottom"
          offset={8}
          containerPadding={0}
          className={cn(
            "sm:hidden w-[calc(100dvw-2rem)]",
            "mx-4 mt-3",
            "rounded-2xl border border-border/80",
            "bg-overlay/90 backdrop-blur-lg",
            "shadow-lg",
            "p-3"
          )}
        >
          <Popover.Dialog className="p-0 outline-none">
            <nav className="max-h-[calc(100dvh-8rem)] overflow-y-auto">
              <div className="space-y-4">
                <section>
                  <div className="flex flex-col gap-1">
                    <Link href="/" onClick={() => setIsOpen(false)} className={navLinkClassName(isHomePageRoute)}>
                      <span>{t("home")}</span>
                    </Link>

                    <Link
                      href="/emner"
                      onClick={() => setIsOpen(false)}
                      className={navLinkClassName(isCourseListPageRoute)}
                    >
                      <span>{t("courses")}</span>
                    </Link>
                  </div>

                  <Separator className="my-3 w-full bg-separator/80" />
                </section>

                <section className="flex flex-col gap-6 px-1">
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:text-stone-300">
                      <IconPalette size={16} />
                      {t("theme")}
                    </span>

                    <div className="flex flex-row gap-2">
                      <Button
                        isIconOnly
                        variant={theme === "light" ? "tertiary" : "ghost"}
                        aria-label={tTheme("light")}
                        onPress={() => onThemeChange("light")}
                      >
                        <IconSun size={16} stroke={1.8} />
                      </Button>
                      <Button
                        isIconOnly
                        variant={theme === "dark" ? "tertiary" : "ghost"}
                        aria-label={tTheme("dark")}
                        onPress={() => onThemeChange("dark")}
                      >
                        <IconMoon size={16} stroke={1.8} />
                      </Button>
                      <Button
                        isIconOnly
                        variant={theme === "system" ? "tertiary" : "ghost"}
                        aria-label={tTheme("system")}
                        onPress={() => onThemeChange("system")}
                      >
                        <IconDeviceMobile size={16} stroke={1.8} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:text-stone-300">
                      <IconWorld size={16} />
                      {t("language")}
                    </span>
                    <div className="flex flex-row gap-2 pb-0.5">
                      <Button
                        variant={locale === "no" ? "tertiary" : "ghost"}
                        className="rounded-full"
                        onPress={() => onLocaleChange("no")}
                      >
                        {tLocale("norwegian")}
                      </Button>
                      <Button
                        variant={locale === "en" ? "tertiary" : "ghost"}
                        className="rounded-full"
                        onPress={() => onLocaleChange("en")}
                      >
                        {tLocale("english")}
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </nav>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  )
}
