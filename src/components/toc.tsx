"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  title: string
  url: string
  depth: number
}

interface TocProps {
  items: TocItem[]
}

export function DashboardTableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.url.substring(1))
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.url.substring(1))
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [items])

  if (!items?.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className="m-0 list-none">
        {items.map((item) => (
          <li key={item.url} className="mt-0 pt-2">
            <a
              href={item.url}
              className={cn(
                "inline-block no-underline transition-colors hover:text-foreground",
                item.url === `#${activeId}`
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
              style={{ paddingLeft: `${(item.depth - 2) * 16}px` }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
