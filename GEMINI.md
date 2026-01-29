# Gemini Project Context: AI Technical Blog

## Project Overview

This project is a modern **AI Technical Blog** designed to share articles on Artificial Intelligence, Machine Learning, and Deep Learning.
It is built using **Next.js 15+ (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

The goal is to provide a high-performance, aesthetically pleasing, and easy-to-maintain platform for technical writing, with strong support for code highlighting and mathematical formulas (LaTeX).

## Architecture & Tech Stack

### Current Stack (Initialized)

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (PostCSS)
- **Package Manager:** npm (inferred)

### Planned/Required Stack (To Be Implemented)

- **UI Components:** Shadcn/ui (Radix UI)
- **Content:** MDX (Markdown + React)
- **Syntax Highlighting:** `rehype-highlight`
- **Math Rendering:** `rehype-katex` / `remark-math`
- **Theming:** `next-themes` (Dark/Light mode)

## Directory Structure

```text
.
├── src/
│   └── app/          # Next.js App Router directory
├── public/           # Static assets
├── REQUIREMENTS.md   # Project Requirements Document (PRD)
├── next.config.ts    # Next.js configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Dependencies and scripts
```

## Development Workflow

### Key Commands

- **Start Development Server:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Start Production Server:**
  ```bash
  npm start
  ```
- **Lint Code:**
  ```bash
  npm run lint
  ```

### Conventions

- **Path Aliases:** Use `@/*` to import from the `src/` directory (e.g., `import Button from "@/components/ui/button"`).
- **Styling:** Use Tailwind CSS utility classes.
- **File Naming:** Follow Next.js App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.).

## Implementation Roadmap (Next Steps)

1. **Dependency Installation:** Install `shadcn-ui`, MDX packages, and plugins.
2. **Configuration:**
   - Configure `next.config.ts` for MDX support.
   - Setup `rehype` and `remark` plugins.
3. **Core Features:**
   - Implement the content layer (reading MDX files).
   - Build the global Layout and Home page.
   - Create the Post Detail page with code and math rendering.

## 当需要执行命令时，如npx，npm等 发送完整的命令，让用户自己执行
