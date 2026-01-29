import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function AboutPage() {
  const filePath = path.join(process.cwd(), "content/about.mdx");
  const source = fs.readFileSync(filePath, "utf8");

  return (
    <div className="container max-w-3xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          About
        </h1>
        <p className="text-xl text-muted-foreground">
          A bit more about me and my technical journey.
        </p>
      </div>
      <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none">
        <MDXRemote source={source} />
      </div>
    </div>
  );
}
