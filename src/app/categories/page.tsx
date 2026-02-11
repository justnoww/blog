import Link from "next/link";
import { getAllCategories, getAllPosts } from "@/lib/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Categories",
  description: "Browse posts by category.",
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  const allPosts = getAllPosts();

  // Calculate count for each category
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = allPosts.filter(
      (post) => post.category === category
    ).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Categories
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore posts by topic.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/categories/${category}`}
            className="transition-colors hover:text-foreground/80"
          >
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category}
                  <Badge variant="secondary" className="ml-2">
                    {categoryCounts[category]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View all posts in {category}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
