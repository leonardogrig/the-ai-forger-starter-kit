"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
}

export default function BlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublished: false,
  });

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setPost(data);
        setFormData({
          title: data.title,
          content: data.content,
          isPublished: data.isPublished,
        });
      } else {
        toast.error("Failed to load blog post");
        router.push("/blog/history");
      }
    } catch (error) {
      toast.error("An error occurred while loading the blog post");
      router.push("/blog/history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/blog/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Blog post updated successfully");
        router.push(`/blog/post/${params.id}`);
      } else {
        toast.error(data.error || "Failed to update blog post");
      }
    } catch (error) {
      toast.error("An error occurred while saving the blog post");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="loading-skeleton h-8 w-32 mb-8"></div>
            <Card className="flat-card">
              <CardHeader>
                <div className="loading-skeleton h-6 w-48 mb-2"></div>
                <div className="loading-skeleton h-4 w-96"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="loading-skeleton h-10 w-full"></div>
                <div className="loading-skeleton h-64 w-full"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button asChild>
            <Link href="/blog/history">Back to History</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" asChild className="flat-button">
              <Link href={`/blog/post/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Post
              </Link>
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flat-button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          <Card className="flat-card">
            <CardHeader>
              <CardTitle>Edit Blog Post</CardTitle>
              <CardDescription>
                Make changes to your blog post content and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog post title"
                  className="flat-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter blog post content (HTML format)"
                  className="min-h-[400px] flat-input font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Content is in HTML format. Be careful when editing to maintain proper structure.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}