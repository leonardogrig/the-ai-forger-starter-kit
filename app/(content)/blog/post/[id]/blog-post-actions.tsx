"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy,
  Download,
  Share2,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  slug: string | null;
}

interface BlogPostActionsProps {
  post: BlogPost;
}

export default function BlogPostActions({ post }: BlogPostActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    router.push(`/blog/edit/${post.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Blog post deleted successfully");
        router.push("/blog/history");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete blog post");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the blog post");
      console.error("Delete error:", error);
    }
  };

  const handleTogglePublish = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          isPublished: !post.isPublished,
        }),
      });

      if (response.ok) {
        toast.success(`Blog post ${!post.isPublished ? 'published' : 'unpublished'} successfully`);
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update blog post");
      }
    } catch (error) {
      toast.error("An error occurred while updating the blog post");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      toast.success("Blog post content copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy content to clipboard");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([post.content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${post.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Blog post downloaded");
  };

  const handleShare = async () => {
    if (navigator.share && post.slug) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this blog post: ${post.title}`,
          url: window.location.href,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={handleTogglePublish} 
        disabled={isUpdating}
        variant={post.isPublished ? "outline" : "default"}
        className="flat-button"
      >
        {post.isPublished ? (
          <>
            <EyeOff className="h-4 w-4 mr-2" />
            Unpublish
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flat-button">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyContent}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}