import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Post } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const readStats = readingTime(content);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.publishDate || data.date || new Date().toISOString(),
      tags: data.tags || [],
      author: data.author,
      readTime: data.readTime || readStats.text,
    } as Post;
  });

  return posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const readStats = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.publishDate || data.date || new Date().toISOString(),
      tags: data.tags || [],
      author: data.author,
      readTime: data.readTime || readStats.text,
    } as Post,
    content,
  };
}
