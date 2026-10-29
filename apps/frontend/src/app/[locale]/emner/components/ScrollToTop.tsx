"use client"

import { Button, cn } from "@heroui/react"
import { IconArrowUp } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { useLayoutEffect, useState } from "react"

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations("ScrollToTop")

  useLayoutEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) {
        return
      }

      ticking = true

      requestAnimationFrame(() => {
        setIsVisible(window.scrollY >= window.innerHeight)
        ticking = false
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <Button
      isIconOnly
      variant="outline"
      className={cn(
        "fixed bottom-6 z-50 right-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:right-[max(3rem,calc((100vw-80rem)/2+3rem))]",
        "transition motion-safe:duration-200",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}
      onPress={() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "instant" : "smooth" })
      }}
      aria-label={t("ariaLabel")}
    >
      <IconArrowUp className="size-4" />
    </Button>
  )
}
