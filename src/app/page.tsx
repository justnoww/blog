import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/posts";

// 1. 定义 GitHub 用户接口
interface GithubProfile {
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
  html_url: string;
  location?: string;
}

// 2. 获取 GitHub 数据 (Next.js 会自动缓存)
async function getGithubProfile(username: string): Promise<GithubProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 }, // 每小时更新一次缓存
    });
    
    if (!res.ok) {
      console.error("Failed to fetch GitHub profile");
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Home() {
  const posts = getAllPosts();
  
  // 3. 调用数据
  const githubUser = await getGithubProfile("justnoww");
  
  // 默认回退数据（如果 API 失败）
  const profile = githubUser || {
    name: "Gemini Blogger",
    login: "gemini",
    avatar_url: "",
    bio: "AI Researcher & Engineer",
    html_url: "https://github.com",
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      {/* 侧边栏：个人简介 */}
      <aside className="w-full md:w-1/3 lg:w-1/4 space-y-6">
        <Card>
          <CardHeader>
            <div className="w-full flex justify-center mb-4">
               {/* 头像显示 */}
               {profile.avatar_url ? (
                 <img 
                   src={profile.avatar_url} 
                   alt={profile.name} 
                   className="w-24 h-24 rounded-full border-2 border-border"
                 />
               ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  AI
                </div>
               )}
            </div>
            <CardTitle className="text-center">{profile.name || profile.login}</CardTitle>
            <CardDescription className="text-center">
              @{profile.login}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground text-center">
            {profile.bio || "Sharing insights on Technology."}
            {profile.location && (
               <div className="mt-2 text-xs flex items-center justify-center gap-1 opacity-80">
                 📍 {profile.location}
               </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={profile.html_url} target="_blank">GitHub</Link>
            </Button>
            {/* 你可以在这里加其他的社交链接 */}
          </CardFooter>
        </Card>

        {/* 热门标签 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Topics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["Machine Learning", "Next.js", "System Design", "Algorithms", "Python"].map((tag) => (
              <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  {tag}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </aside>

      {/* 主内容区：文章列表 */}
      <section className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
          <Button variant="ghost" asChild>
            <Link href="/posts">View all →</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.slug} className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                  {post.readTime && <span className="text-sm text-muted-foreground">{post.readTime}</span>}
                </div>
                <Link href={`/posts/${post.slug}`}>
                  <CardTitle className="text-xl mt-2 hover:underline decoration-primary underline-offset-4">
                    {post.title}
                  </CardTitle>
                </Link>
                <div className="flex gap-2 mt-2">
                  {post.tags?.map((tag) => (
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
                <Link href={`/posts/${post.slug}`} className="text-sm font-medium text-primary hover:underline">
                  Read more
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
