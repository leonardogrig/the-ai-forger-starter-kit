import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/auth";
import { calculateTokensUsed, generateBlogImage, generateBlogPost } from "@/lib/openai";
import prisma from "@/lib/prisma";
import { checkUserAccess, getUserTokens } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hasAccess } = await checkUserAccess(session.user.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      );
    }

    const { originalText } = await req.json();
    if (!originalText || typeof originalText !== "string") {
      return NextResponse.json(
        { error: "Original text is required" },
        { status: 400 }
      );
    }

    const tokensRequired = calculateTokensUsed(originalText);
    const tokenInfo = await getUserTokens(session.user.id);

    if (tokenInfo.tokens < tokensRequired) {
      return NextResponse.json(
        {
          error: "Insufficient tokens",
          required: tokensRequired,
          available: tokenInfo.tokens,
        },
        { status: 402 }
      );
    }

    const blogData = await generateBlogPost(originalText);
    
    let imageUrl = null;
    if (blogData.imagePrompt) {
      try {
        imageUrl = await generateBlogImage(blogData.imagePrompt);
      } catch (error) {
        console.error("Failed to generate image:", error);
      }
    }

    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    const blogPost = await prisma.blogPost.create({
      data: {
        userId: session.user.id,
        title: blogData.title,
        content: blogData.content,
        originalText,
        imageUrl,
        imagePrompt: blogData.imagePrompt,
        tokensUsed: tokensRequired,
        characterCount: originalText.length,
        slug: slug + '-' + Date.now(),
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        tokens: tokenInfo.tokens - tokensRequired,
      },
    });

    return NextResponse.json({
      success: true,
      blogPost,
      tokensUsed: tokensRequired,
      remainingTokens: tokenInfo.tokens - tokensRequired,
    });

  } catch (error) {
    console.error("Error generating blog post:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}