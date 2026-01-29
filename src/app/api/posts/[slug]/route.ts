import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// 这是一个 helper，用于处理本地开发没有 KV 的情况
const isKvEnabled = !!process.env.KV_REST_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  if (!isKvEnabled) {
    // 本地开发回退
    return NextResponse.json({ views: 0, likes: 0 });
  }

  try {
    const views = await kv.get<number>(`post:${slug}:views`) || 0;
    const likes = await kv.get<number>(`post:${slug}:likes`) || 0;
    return NextResponse.json({ views, likes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ views: 0, likes: 0 }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();
  const type = body.type; // 'view' or 'like'

  if (!isKvEnabled) {
    return NextResponse.json({ views: 1, likes: 1 });
  }

  try {
    let value = 0;
    if (type === "view") {
      value = await kv.incr(`post:${slug}:views`);
    } else if (type === "like") {
      value = await kv.incr(`post:${slug}:likes`);
    }
    return NextResponse.json({ value });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
