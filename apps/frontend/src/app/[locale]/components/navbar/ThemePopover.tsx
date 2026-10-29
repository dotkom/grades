"use client"

import { Button, Dropdown } from "@heroui/react"
import { IconCheck, IconDeviceDesktop, IconDeviceMobile, IconMoon, IconSun } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

export const ThemePopover = () => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("ThemePopover")

  const onChange = (newTheme: string) => {
    if (newTheme === theme) {
      return
    }

    setTheme(newTheme)
  }

  return (
    <Dropdown>
      <Button aria-label={t("ariaLabel")} variant="ghost" isIconOnly>
        <IconSun stroke={1.8} className="size-5 dark:hidden" />
        <IconMoon stroke={1.8} className="size-5 hidden dark:block" />
      </Button>
      <Dropdown.Popover className="min-w-28 rounded-xl border border-border" placement="bottom">
        <Dropdown.Menu selectedKeys={[theme ?? ""]} selectionMode="single" onAction={(key) => onChange(key as string)}>
          <Dropdown.Item
            id="light"
            textValue={t("light")}
            className="rounded-lg gap-2 hover:bg-default data-[hovered=true]:bg-default"
          >
            <IconSun className="size-4" stroke={1.8} />
            {t("light")}
            {theme === "light" && <IconCheck className="size-4 ms-auto" stroke={1.8} />}
          </Dropdown.Item>

          <Dropdown.Item
            id="dark"
            textValue={t("dark")}
            className="rounded-lg gap-2 hover:bg-default data-[hovered=true]:bg-default"
          >
            <IconMoon className="size-4" stroke={1.8} />
            {t("dark")}
            {theme === "dark" && <IconCheck className="size-4 ms-auto" stroke={1.8} />}
          </Dropdown.Item>

          <Dropdown.Item
            id="system"
            textValue={t("system")}
            className="rounded-lg gap-2 hover:bg-default data-[hovered=true]:bg-default"
          >
            <IconDeviceDesktop className="size-4 max-xs:hidden" />
            <IconDeviceMobile className="size-4 xs:hidden" stroke={1.8} />
            {t("system")}
            {theme === "system" && <IconCheck className="size-4 ms-auto" stroke={1.8} />}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
