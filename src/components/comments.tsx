"use client";

import { useTheme } from "next-themes";
import * as React from "react";

export function Comments() {
  const { theme, systemTheme } = useTheme();
  const ref = React.useRef<HTMLDivElement>(null);

  const REPO = "justnoww/blog"; // 你的仓库名
  const REPO_ID = "R_kgDORDwo_w"; // 你的仓库 ID
  const CATEGORY = "Announcements"; // Discussion 分类
  const CATEGORY_ID = "DIC_kwDORDwo_84C1lXk"; // 分类 ID

  React.useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", REPO);
    script.setAttribute("data-repo-id", REPO_ID);
    script.setAttribute("data-category", CATEGORY);
    script.setAttribute("data-category-id", CATEGORY_ID);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "en");

    ref.current.appendChild(script);
  }, []);

  // 监听主题变化，动态更新 Giscus 主题
  React.useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame",
    );
    if (!iframe) return;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const giscusTheme = currentTheme === "dark" ? "dark" : "light";

    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      "https://giscus.app",
    );
  }, [theme, systemTheme]);

  return (
    <div className="w-full mt-10 pt-10 border-t">
      <div ref={ref} />
    </div>
  );
}
