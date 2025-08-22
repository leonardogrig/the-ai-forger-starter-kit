import { notFound, redirect } from "next/navigation";
import getSession from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  Share2, 
  Clock, 
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import BlogPostActions from "./blog-post-actions";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      id: resolvedParams.id,
      userId: session.user.id,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" asChild className="flat-button">
              <Link href="/blog/history">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Link>
            </Button>
            <BlogPostActions post={post} />
          </div>

          <article>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {post.tokensUsed} token{post.tokensUsed !== 1 ? 's' : ''} used
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.characterCount.toLocaleString()} chars
                </Badge>
                {post.isPublished ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Published
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <EyeOff className="h-3 w-3" />
                    Draft
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    <span>
                      Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                )}
                {post.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>
                      Published on {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {post.imageUrl && (
                <div className="mb-8">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-80 object-cover border flat-shadow"
                  />
                  {post.imagePrompt && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Generated with prompt: "{post.imagePrompt}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Blog Content */}
            <Card className="flat-card mb-8">
              <CardHeader>
                <CardTitle>Blog Post Content</CardTitle>
                <CardDescription>
                  Your AI-generated blog post ready for publication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-gray max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            {/* Original Text */}
            <Card className="flat-card">
              <CardHeader>
                <CardTitle>Original Input</CardTitle>
                <CardDescription>
                  The source material that was transformed into this blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 border-l-4 border-primary">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {post.originalText}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    </div>
  );
}