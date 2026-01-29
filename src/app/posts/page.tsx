import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Blog - All Posts",
  description: "Archive of all posts.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog Archive</h1>
        <p className="text-muted-foreground">
          Showing all {posts.length} posts.
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
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                    <Badge variant="outline" className="text-xs font-normal cursor-pointer hover:bg-secondary">
                      {tag}
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
