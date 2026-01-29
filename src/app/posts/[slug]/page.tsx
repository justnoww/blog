import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardTableOfContents } from "@/components/toc";
import { PostStats } from "@/components/post-stats";
import { ShareButton } from "@/components/share-button";
import GithubSlugger from "github-slugger";

const components = {
  Button,
};

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 简单的正则提取标题，用于生成 TOC 数据
function getTableOfContents(markdown: string) {
  const slugger = new GithubSlugger();
  const regX = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
  const headings = Array.from(markdown.matchAll(regX)).map(({ groups }) => {
    const flag = groups?.flag;
    const content = groups?.content;
    return {
      depth: flag?.length || 1,
      title: content || "",
      url: `#${slugger.slug(content || "")}`,
    };
  });
  // 只保留 H2 和 H3
  return headings.filter((h) => h.depth >= 2 && h.depth <= 3);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const toc = getTableOfContents(post.content);

  return (
    <div className="container relative max-w-5xl py-6 lg:py-10 lg:gap-10 xl:grid xl:grid-cols-[1fr_240px]">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="flex flex-col items-start gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.meta.date}>{post.meta.date}</time>
            {post.meta.readTime && (
              <>
                <span>•</span>
                <span>{post.meta.readTime}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            {post.meta.title}
          </h1>
          <div className="flex gap-2">
            {post.meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          {post.meta.description && (
            <p className="text-xl text-muted-foreground mt-4">
              {post.meta.description}
            </p>
          )}

          <div className="flex items-center justify-between w-full py-4 border-y mt-6">
             <PostStats slug={slug} />
             <ShareButton title={post.meta.title} url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/posts/${slug}`} />
          </div>
        </div>

        <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [
                  rehypeSlug, // 自动生成 id
                  [
                     rehypeAutolinkHeadings, 
                     { behavior: 'wrap' } 
                  ],
                  rehypeKatex,
                  [rehypeHighlight, { detect: true }],
                ],
              },
            }}
          />
        </div>

        <hr className="my-8" />
        <div className="flex justify-center">
          <a
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to all posts
          </a>
        </div>
      </div>
      
      {/* 桌面端侧边栏 TOC */}
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
          <DashboardTableOfContents items={toc} />
        </div>
      </div>
    </div>
  );
}