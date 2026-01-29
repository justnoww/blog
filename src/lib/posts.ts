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

// 新增：专为搜索优化的数据获取函数
export function getAllPostsForSearch() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));

  return files.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // 简单的 Markdown 去除逻辑
    const plainText = content
      .replace(/!.*\[.*\]\(.*\[.*\]\)/g, '') // 移除图片
      .replace(/.*\[(.*)\]\(.*\[(.*)\]\)/g, '$1') // 保留链接文本
      .replace(/#{1,6}\s/g, '') // 移除标题符号
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
      .replace(/(\*|_)(.*?)\1/g, '$2') // 移除斜体
      .replace(/`{3}[\s\S]*?`{3}/g, (match) => match.replace(/`/g, '')) // 保留代码块内容但移除反引号
      .replace(/`/g, '') // 移除行内代码反引号
      .replace(/\n/g, ' ') // 换行变空格
      .trim();

    return {
      slug,
      title: data.title || slug,
      tags: data.tags || [],
      content: plainText, // 包含正文
    };
  });
}