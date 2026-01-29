"use client"

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Heart, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostStats({ slug }: { slug: string }) {
  const { data, mutate } = useSWR(`/api/posts/${slug}`, fetcher);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // 1. 自动增加浏览量 (仅在挂载时执行一次)
  useEffect(() => {
    // 防止开发环境 React Strict Mode 导致重复计数，可以使用 ref 或者忽略
    // 在这里简单起见，直接发请求
    fetch(`/api/posts/${slug}`, {
      method: "POST",
      body: JSON.stringify({ type: "view" }),
      headers: { "Content-Type": "application/json" },
    });
    // 本地存储记录是否点赞过
    const liked = localStorage.getItem(`liked:${slug}`);
    if (liked) setHasLiked(true);
  }, [slug]);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);

    // 乐观更新 UI
    mutate(
      { ...data, likes: (data?.likes || 0) + 1 },
      false // 不重新验证
    );
    setHasLiked(true);
    localStorage.setItem(`liked:${slug}`, "true");

    try {
      await fetch(`/api/posts/${slug}`, {
        method: "POST",
        body: JSON.stringify({ type: "like" }),
        headers: { "Content-Type": "application/json" },
      });
      setIsLiking(false);
      mutate(); // 重新获取准确数据
    } catch (error) {
      console.error(error);
      setIsLiking(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 浏览量 */}
      <div className="flex items-center gap-1 text-muted-foreground text-sm" title="Views">
        <Eye className="h-4 w-4" />
        <span>{data?.views ? data.views.toLocaleString() : "..."}</span>
      </div>

      {/* 点赞按钮 */}
      <Button
        variant="ghost"
        size="sm"
        className={cn("gap-1 transition-colors", hasLiked && "text-red-500 hover:text-red-600")}
        onClick={handleLike}
        disabled={hasLiked || isLiking}
      >
        <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
        <span>{data?.likes ? data.likes.toLocaleString() : hasLiked ? 1 : 0}</span>
      </Button>
    </div>
  );
}
