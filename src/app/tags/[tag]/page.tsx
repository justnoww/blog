import Link from "next/link";
import { getPostsByTag, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  // 提取所有标签并去重
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag.toLowerCase()));
  });

  return Array.from(tags).map((tag) => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodeTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodeTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tag: {decodeTag}</h1>
        <p className="text-muted-foreground">
          Found {posts.length} post{posts.length > 1 ? "s" : ""} tagged with "
          {decodeTag}".
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.slug} className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{post.date}</span>
                {post.readTime && (
                  <span className="text-sm text-muted-foreground">
                    {post.readTime}
                  </span>
                )}
              </div>
              <Link href={`/posts/${post.slug}`}>
                <CardTitle className="text-xl mt-2 hover:underline decoration-primary underline-offset-4">
                  {post.title}
                </CardTitle>
              </Link>
              <div className="flex gap-2 mt-2">
                {post.tags.map((t) => (
                  <Link key={t} href={`/tags/${t.toLowerCase()}`}>
                    <Badge variant="outline" className="text-xs font-normal">
                      {t}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{post.description}</p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/posts/${post.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
