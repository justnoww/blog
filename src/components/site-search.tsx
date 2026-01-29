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
  content: string
}

// 辅助组件：高亮文本片段
function HighlightedSnippet({ content, query }: { content: string, query: string }) {
  if (!query) return null;
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) return null;

  const start = Math.max(0, index - 20); 
  const end = Math.min(content.length, index + query.length + 60);
  
  const snippetText = content.slice(start, end);
  
  // 在片段中再次查找关键词位置（注意大小写不敏感匹配）
  const parts = snippetText.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span className="text-xs text-muted-foreground truncate block">
      {start > 0 && "..."}
      {parts.map((part, i) => 
        part.toLowerCase() === lowerQuery ? (
          <span key={i} className="text-primary font-bold bg-yellow-100 dark:bg-yellow-900/50 px-0.5 rounded-sm">
            {part}
          </span>
        ) : (
          part
        )
      )}
      {end < content.length && "..."}
    </span>
  );
}

export function SiteSearch({ posts }: { posts: PostMetaForSearch[] }) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("") 
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
        <CommandInput 
          placeholder="Type a command or search..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Posts">
            {posts.map((post) => (
              <CommandItem
                key={post.slug}
                value={`${post.title} ${post.tags.join(" ")} ${post.content.slice(0, 5000)}`}
                onSelect={() => {
                  runCommand(() => {
                    const targetUrl = query.length > 1
                      ? `/posts/${post.slug}#:~:text=${encodeURIComponent(query.trim())}`
                      : `/posts/${post.slug}`;
                    
                    // 强制使用 window.location 跳转以触发浏览器的 Text Fragment 高亮
                    // 虽然这会造成一次全页刷新，但能保证高亮功能生效
                    window.location.href = targetUrl;
                  })
                }}
              >
                <FileText className="mr-2 h-4 w-4 shrink-0 mt-1" />
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="font-medium truncate">{post.title}</span>
                  <HighlightedSnippet content={post.content} query={query} />
                </div>
                {post.tags.length > 0 && (
                   <span className="ml-auto flex gap-1 pl-2">
                     {post.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[10px] text-muted-foreground bg-secondary px-1 rounded hidden sm:inline-block whitespace-nowrap">{tag}</span>
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