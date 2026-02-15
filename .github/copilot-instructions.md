# GitHub Copilot 使用说明 - AI 技术博客

## 项目概述

这是一个现代化的 AI 技术博客，使用 Next.js 16 (App Router)、TypeScript 和 Tailwind CSS v4 构建。专注于分享人工智能、机器学习和深度学习相关文章，具有强大的代码高亮和 LaTeX 数学公式渲染支持。

## 构建、测试和代码检查命令

```bash
# 开发环境
npm run dev          # 启动开发服务器，监听 0.0.0.0:3000

# 生产环境
npm run build        # 构建生产版本（standalone 输出模式）
npm start            # 启动生产服务器

# 代码质量
npm run lint         # 运行 ESLint（暂无测试套件）
```

**注意：** 用户偏好接收完整的命令字符串（如 `npx`、`npm`）供手动执行，而非自动执行命令。

## 架构设计

### 内容层（基于文件系统的 MDX）

- **内容源：** `/content/posts/*.mdx` - 所有博客文章均为 MDX 文件
- **元数据：** 每个 MDX 文件的 Frontmatter（title、description、publishDate、category、tags、author、readTime）
- **内容 API：** `src/lib/posts.ts` 提供文件系统工具函数：
  - `getAllPosts()` - 读取所有 MDX 文件，使用 gray-matter 提取 frontmatter，计算阅读时间
  - `getPostBySlug(slug)` - 返回文章元数据 + 原始内容供 MDX 渲染
  - `getPostsByTag(tag)` / `getPostsByCategory(category)` - 筛选函数
  - `getAllPostsForSearch()` - 去除 Markdown 标记用于搜索索引

**核心特点：** 文章在构建/请求时从磁盘静态读取，无需数据库或 CMS。

### 渲染管道（MDX → HTML）

1. **纯服务端渲染：** MDX 渲染通过 `next-mdx-remote/rsc` 在 React Server Components 中完成
2. **MDX 插件配置（`src/app/posts/[slug]/page.tsx`）：**
   - `remark-math` → 检测 LaTeX 语法（`$行内$`、`$$块级$$`）
   - `rehype-katex` → 将 LaTeX 渲染为 HTML（需要在 layout 中导入 `katex/dist/katex.min.css`）
   - `rehype-highlight` → 代码语法高亮（需要在 layout 中导入 `highlight.js/styles/*.css`）
   - `rehype-slug` + `rehype-autolink-headings` → 为标题生成可链接的 ID 用于目录
3. **目录生成：** 使用自定义正则表达式提取（`getTableOfContents()`），非基于 MDX AST

**关键：** 必须在 `src/app/layout.tsx` 中导入 KaTeX 和 Highlight.js 的 CSS 样式才能正常显示。

### 路由结构

- **App Router 约定：**
  - `/` → `src/app/page.tsx`（首页：文章列表 + GitHub 个人资料卡）
  - `/posts/[slug]` → `src/app/posts/[slug]/page.tsx`（文章详情，包含 MDX 渲染）
  - `/categories/[category]` → 分类筛选的文章列表
  - `/tags/[tag]` → 标签筛选的文章列表
  - `/about` → 关于页面（来自 `content/about.mdx`）
  - `/api/posts/[slug]` → API 路由用于文章统计/浏览量（使用 Vercel KV）

**静态生成：** 通过 `generateStaticParams()` 在构建时预渲染所有文章页面。

### 组件架构

- **Shadcn/ui 配置：** 使用 "new-york" 风格，基于 Radix UI 原语
  - 配置文件：`components.json`
  - 组件位置：`src/components/ui/`（badge、button、card、command、dialog 等）
  - 路径别名：`@/components/ui/*`
- **自定义组件：**
  - `theme-provider.tsx` - `next-themes` 包装器（系统/深色/浅色模式）
  - `toc.tsx` - 客户端粘性目录，带滚动监听（IntersectionObserver）
  - `post-stats.tsx` - 浏览量计数器（使用 SWR 从 `/api/posts/[slug]` 获取）
  - `share-button.tsx` - Web Share API 集成
  - `comments.tsx` - Giscus/Utterances 占位符（未来功能）
  - `highlight-remover.tsx` - 客户端脚本，移除 `hljs-ln` 副作用

**样式系统：** Tailwind CSS v4 通过 PostCSS（`@tailwindcss/postcss`）。使用 `@tailwindcss/typography` 处理文章排版。

## 核心约定

### 路径别名

```typescript
// 始终使用 @ 前缀导入 src/ 目录下的模块
import { getAllPosts } from "@/lib/posts"
import { Button } from "@/components/ui/button"
```

在 `tsconfig.json`（`paths: { "@/*": ["./src/*"] }`）和 `components.json` 中配置。

### MDX Frontmatter 模式

```yaml
---
title: "文章标题"                       # 必需
description: "文章描述"                 # 必需
publishDate: "YYYY-MM-DD"              # 必需（ISO 日期格式）
category: "分类名称"                    # 必需（用于筛选）
tags: ["标签1", "标签2"]                # 必需（字符串数组）
author: "作者名"                        # 可选
readTime: "X 分钟阅读"                  # 可选（如缺失则自动计算）
---
```

**日期处理：** 文章按 `publishDate`（或回退到 `date` 字段）降序排序。

### MDX 中导入组件

MDX 文件可以导入 React 组件：

```mdx
import { Button } from "@/components/ui/button"

<Button variant="default">点击我</Button>
```

**注册位置：** `src/mdx-components.tsx`（当前为最小配置，按需扩展）

### 样式模式

- **深色模式：** 使用 Tailwind 的 `dark:` 变体（如 `dark:bg-slate-900`）
- **排版：** 使用 `prose prose-slate dark:prose-invert` 类包裹 MDX 输出
- **响应式：** 移动优先工具类（如 `md:flex-row`、`lg:text-4xl`）
- **图标：** Lucide React（`lucide-react` 包）

### API 路由与 Vercel KV

文章浏览量使用 `@vercel/kv`（类 Redis 的键值存储）：

```typescript
// src/app/api/posts/[slug]/route.ts
import { kv } from "@vercel/kv"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const views = await kv.incr(`views:posts:${slug}`)
  return Response.json({ views })
}
```

**注意：** 需要在 Vercel 上配置 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 环境变量。

### Docker 部署

```bash
# 通过 docker-compose 构建和运行
docker-compose up --build

# 或单独运行
docker build -t ai-blog .
docker run -p 3000:3000 ai-blog
```

**配置：** 在 `next.config.mjs` 中使用 `output: 'standalone'` 以优化容器构建。

## GitHub 个人资料集成

首页（`src/app/page.tsx`）动态获取 GitHub 用户数据：

```typescript
async function getGithubProfile(username: string): Promise<GithubProfile | null> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    next: { revalidate: 3600 }, // 缓存 1 小时
  });
  // ...
}
```

**当前用户名：** `"justnoww"`（硬编码在 `page.tsx` 第 47 行 - 按需修改）

## 站点配置

在 `src/lib/constants.ts` 中更新全站常量：

```typescript
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
export const SITE_TITLE = "AI Tech Blog";
export const SITE_DESCRIPTION = "A modern blog for AI, Machine Learning, and Deep Learning.";
```

**SEO：** `src/app/layout.tsx` 中的元数据模板使用这些常量生成 OpenGraph、RSS 等。

## 内容工作流

1. 在 `content/posts/my-post.mdx` 创建新的 MDX 文件
2. 添加必需的 frontmatter（title、description、publishDate、category、tags）
3. 使用 Markdown + JSX 组件编写内容
4. 运行 `npm run build` 生成静态页面
5. 部署到 Vercel 或通过 Docker

**MDX 无热重载：** 在 `npm run dev` 运行时添加新文章需要重启开发服务器。

## 已知限制

- 尚未实现测试套件
- 评论系统（Giscus）尚未集成（占位符已存在）
- 搜索功能已规划但尚未构建（参见 `getAllPostsForSearch()`）
- 对于包含大量 LaTeX/代码的内容，阅读时间自动计算可能不准确

## 故障排查

### 数学公式无法渲染
- 确保 `src/app/layout.tsx` 中存在 `import "katex/dist/katex.min.css"`
- 检查 MDX 插件链中包含 `remark-math` 和 `rehype-katex`

### 代码高亮无法工作
- 确保 `src/app/layout.tsx` 中存在 `import "highlight.js/styles/github-dark.css"`
- 验证 `rehype-highlight` 配置了 `{ detect: true }`

### 构建失败："Cannot find module '@/...'"
- 检查 `tsconfig.json` 中的 paths 配置
- 在编辑器中重启 TypeScript 服务器
