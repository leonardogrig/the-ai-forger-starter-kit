"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  tokensUsed: number;
  characterCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const PostSkeleton = () => (
  <Card className="flat-card">
    <CardHeader>
      <div className="loading-skeleton h-5 w-3/4 mb-2"></div>
      <div className="flex gap-2">
        <div className="loading-skeleton h-4 w-16"></div>
        <div className="loading-skeleton h-4 w-20"></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="loading-skeleton h-4 w-32 mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="loading-skeleton h-4 w-24"></div>
        <div className="loading-skeleton h-8 w-16"></div>
      </div>
    </CardContent>
  </Card>
);

export default function BlogHistoryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cache, setCache] = useState<Map<number, { posts: BlogPost[], pagination: PaginationInfo }>>(new Map());

  const fetchPosts = useCallback(async (page: number) => {
    if (cache.has(page)) {
      const cachedData = cache.get(page)!;
      setPosts(cachedData.posts);
      setPagination(cachedData.pagination);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog/posts?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setPagination(data.pagination);
        
        setCache(prev => new Map(prev.set(page, { 
          posts: data.posts, 
          pagination: data.pagination 
        })));
      } else {
        toast.error(data.error || "Failed to fetch blog posts");
      }
    } catch (error) {
      toast.error("An error occurred while fetching blog posts");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Blog post deleted successfully");
        
        setCache(new Map());
        fetchPosts(currentPage);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete blog post");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the blog post");
      console.error("Delete error:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="flat-button">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <Button asChild className="flat-button">
              <Link href="/blog/generate">
                <Plus className="h-4 w-4 mr-2" />
                Generate New Post
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <History className="h-8 w-8 text-primary" />
              Blog Post History
            </h1>
            <p className="text-muted-foreground">
              Manage all your AI-generated blog posts
            </p>
            {pagination && (
              <p className="text-sm text-muted-foreground mt-2">
                Total: {pagination.total} posts
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="flat-card text-center py-12">
              <CardContent>
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Generate your first AI-powered blog post to get started
                </p>
                <Button asChild className="flat-button">
                  <Link href="/blog/generate">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Your First Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 mb-8">
                {posts.map((post) => (
                  <Card key={post.id} className="flat-card flat-shadow-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2 mb-2">
                            {post.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {post.tokensUsed} token{post.tokensUsed !== 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {post.characterCount.toLocaleString()} chars
                            </Badge>
                            {post.isPublished ? (
                              <Badge variant="default" className="text-xs">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Draft
                              </Badge>
                            )}
                          </div>
                        </div>
                        {post.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-16 h-16 object-cover border"
                            />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            asChild
                            className="flat-button"
                          >
                            <Link href={`/blog/post/${post.id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="flat-button"
                            onClick={() => router.push(`/blog/edit/${post.id}`)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(post.id)}
                            className="flat-button text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="flat-button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="flat-button w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="flat-button"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}