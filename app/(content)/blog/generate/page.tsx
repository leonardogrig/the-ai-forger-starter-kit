"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Loader2, PenTool, Zap, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function BlogGeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [originalText, setOriginalText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<any>(null);

  const calculateTokens = (text: string) => {
    return Math.ceil(text.length / 15000);
  };

  const handleGenerate = async () => {
    if (!originalText.trim()) {
      toast.error("Please enter some text to transform");
      return;
    }

    if (originalText.length < 100) {
      toast.error("Please provide at least 100 characters of text");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/blog/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalText }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedPost(data.blogPost);
        toast.success(`Blog post generated! ${data.tokensUsed} tokens used.`);
      } else {
        if (response.status === 403) {
          toast.error("Premium subscription required to use this feature");
        } else if (response.status === 402) {
          toast.error(`Insufficient tokens. Need ${data.required}, have ${data.available}`);
        } else {
          toast.error(data.error || "Failed to generate blog post");
        }
      }
    } catch (error) {
      toast.error("An error occurred while generating the blog post");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPost = () => {
    if (generatedPost) {
      router.push(`/blog/post/${generatedPost.id}`);
    }
  };

  const tokensRequired = calculateTokens(originalText);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" asChild className="flat-button">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <PenTool className="h-8 w-8 text-primary" />
              Blog Post Generator
            </h1>
            <p className="text-muted-foreground">
              Transform your YouTube transcriptions or rough thoughts into polished, SEO-optimized blog posts
            </p>
          </div>

          {!generatedPost ? (
            <Card className="flat-card">
              <CardHeader>
                <CardTitle>Input Your Content</CardTitle>
                <CardDescription>
                  Paste your YouTube transcript, notes, or any text you'd like to transform into a blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="content" className="text-sm font-medium">
                      Original Text
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {tokensRequired} token{tokensRequired !== 1 ? 's' : ''} required
                      </Badge>
                    </div>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Paste your YouTube transcript, voice notes, or any text content here..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="min-h-[300px] flat-input"
                    disabled={isGenerating}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{originalText.length.toLocaleString()} characters</span>
                    <span>Minimum 100 characters required</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-none">
                  <h3 className="font-medium mb-2">What you'll get:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SEO-optimized blog post with engaging title</li>
                    <li>• Properly structured content with headings and formatting</li>
                    <li>• AI-generated featured image</li>
                    <li>• Ready-to-publish HTML content</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || originalText.length < 100}
                  className="w-full flat-button flat-shadow"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Blog Post...
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-4 w-4" />
                      Generate Blog Post ({tokensRequired} token{tokensRequired !== 1 ? 's' : ''})
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="flat-card">
              <CardHeader className="bg-green-50 border-b border-green-200">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Check className="h-5 w-5" />
                  Blog Post Generated Successfully!
                </CardTitle>
                <CardDescription className="text-green-600">
                  Your content has been transformed into a professional blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{generatedPost.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{generatedPost.tokensUsed} tokens used</Badge>
                      <Badge variant="outline">{generatedPost.characterCount.toLocaleString()} characters</Badge>
                    </div>
                  </div>

                  {generatedPost.imageUrl && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Generated Featured Image:</p>
                      <div className="border rounded-none overflow-hidden">
                        <img 
                          src={generatedPost.imageUrl} 
                          alt="Generated blog post image"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleViewPost} className="flex-1 flat-button">
                      View Full Post
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setGeneratedPost(null);
                        setOriginalText("");
                      }}
                      className="flex-1 flat-button"
                    >
                      Generate Another
                    </Button>
                    <Button variant="outline" asChild className="flat-button">
                      <Link href="/blog/history">View History</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}