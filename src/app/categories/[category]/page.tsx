import Link from "next/link";
import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = getPostsByCategory(decodedCategory);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-3xl tracking-tight lg:text-4xl">
            {decodedCategory}
          </h1>
          <p className="text-xl text-muted-foreground">
            {posts.length} post{posts.length > 1 ? "s" : ""} in this category.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      <div className="grid gap-10 sm:grid-cols-1">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col space-y-2"
          >
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                   {post.readTime}
                </span>
            </div>
           
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-2xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-muted-foreground">
                {post.description}
            </p>
            
            <div className="flex gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
            </div>
            <Link
              href={`/posts/${post.slug}`}
              className="absolute inset-0"
            >
              <span className="sr-only">View Article</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
