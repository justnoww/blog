"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

export function HighlightRemover() {
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    // 检查 URL 是否包含 Text Fragment标识 ":~:text="
    if (typeof window !== "undefined" && window.location.hash.includes(":~:text=")) {
      const timer = setTimeout(() => {
        // 方法 A: 清除 hash，这通常会移除高亮
        // 使用 replaceState 修改 URL 而不刷新页面
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        
        // 某些浏览器可能需要强制移除选区
        if (window.getSelection) {
           window.getSelection()?.empty();
        }
      }, 2500); // 2.5秒后移除

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null; // 这个组件不渲染任何 UI
}
