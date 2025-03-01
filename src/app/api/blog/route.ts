import { getBlogPosts } from "@/data/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const language = request.nextUrl.searchParams.get("lang") || "en";
  
  try {
    const posts = await getBlogPosts(language as string);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
} 