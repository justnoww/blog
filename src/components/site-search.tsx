"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Search, FileText, Hash } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PostMetaForSearch {
  slug: string
  title: string
  tags: string[]
  content: string // 新增：包含正文内容
}

export function SiteSearch({ posts }: { posts: PostMetaForSearch[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search posts...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Posts">
            {posts.map((post) => (
              <CommandItem
                key={post.slug}
                // 关键修改：将 content 加入 value，这样 cmdk 就会搜索正文了
                // 我们截取前 5000 个字符以防性能问题，通常足够
                value={`${post.title} ${post.tags.join(" ")} ${post.content.slice(0, 5000)}`}
                onSelect={() => {
                  runCommand(() => router.push(`/posts/${post.slug}`))
                }}
              >
                <FileText className="mr-2 h-4 w-4 shrink-0" />
                <div className="flex flex-col">
                  <span>{post.title}</span>
                  {/* 可选：显示一小段匹配内容的摘要，但实现起来比较复杂，这里先保持简洁 */}
                </div>
                {post.tags.length > 0 && (
                   <span className="ml-auto flex gap-1">
                     {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] text-muted-foreground bg-secondary px-1 rounded hidden sm:inline-block">{tag}</span>
                     ))}
                   </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
              <Smile className="mr-2 h-4 w-4" />
              <span>About Me</span>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => window.open("https://github.com/justnoww", "_blank"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>GitHub Profile</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}