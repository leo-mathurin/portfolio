import { getPost } from "@/data/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const language = request.nextUrl.searchParams.get("lang") || "en";

  try {
    const post = await getPost(slug, language as string);
    return NextResponse.json(post);
  } catch (error) {
    // If post not found in specified language, try English as fallback
    if (language !== "en") {
      try {
        const englishPost = await getPost(slug, "en");
        return NextResponse.json(englishPost);
      } catch (fallbackError) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }
} 