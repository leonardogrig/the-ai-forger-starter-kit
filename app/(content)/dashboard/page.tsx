import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getSession from "@/lib/auth";
import {
  checkUserAccess,
  getUserTokens,
  isUserAdmin,
} from "@/lib/subscription";
import { Crown, Gift, TrendingUp, Zap, PenTool, History } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [{ hasAccess, subscription }, tokenInfo, isAdmin] = await Promise.all([
    checkUserAccess(session.user.id),
    getUserTokens(session.user.id),
    isUserAdmin(session.user.id),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back,{" "}
              {session.user.name?.split(' ')[0] || session.user.email}!
            </h1>
            <p className="text-gray-600">
              Here's your personalized dashboard overview
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Tokens Card */}
            <Card
              className={`${
                tokenInfo.expired
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Tokens
                  </div>
                  <Badge
                    variant={tokenInfo.expired ? "destructive" : "default"}
                    className="text-sm"
                  >
                    {tokenInfo.tokens}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {tokenInfo.expired
                    ? "Your tokens have expired"
                    : `Expires ${
                        tokenInfo.expiresAt
                          ? new Date(tokenInfo.expiresAt).toLocaleDateString()
                          : "Never"
                      }`}
                </p>
                <div className="text-xs text-gray-500">
                  {tokenInfo.expired
                    ? "Renew your subscription to get more tokens"
                    : "Use tokens to access premium features"}
                </div>
              </CardContent>
            </Card>

            {/* Free Content Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-500" />
                  Free Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Available to all authenticated users. No subscription
                  required!
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/free-content">Access Free Content</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Content Card */}
            <Card
              className={`${
                hasAccess ? "border-yellow-200 bg-yellow-50" : "border-gray-200"
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Premium Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasAccess ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      You have premium access! Enjoy exclusive content and
                      features.
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link href="/premium-content">
                        Access Premium Content
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Upgrade to premium to access exclusive content and
                      advanced features.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Link href="/pricing">Upgrade to Premium</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subscription Info */}
          {subscription && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Your Subscription
                </CardTitle>
                <CardDescription>Current subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-lg font-semibold capitalize">
                      {subscription.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Plan</p>
                    <p className="text-lg font-semibold">
                      {subscription.stripeProduct?.name || "Premium Plan"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Next Billing
                    </p>
                    <p className="text-lg font-semibold">
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <div className="mt-4 p-3 bg-amber-100 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Note:</strong> Your subscription will end on{" "}
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Tools Section */}
          {hasAccess && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Tools</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Blog Post Generator */}
                <Card className="border-purple-200 bg-purple-50 flat-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="h-5 w-5 text-purple-500" />
                      Blog Post Generator
                    </CardTitle>
                    <CardDescription>
                      Transform text into SEO-optimized blog posts with AI-generated images
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Turns YouTube transcripts or rough notes into polished blog content. 
                      Cost: 1 token per 15,000 characters.
                    </p>
                    <Button asChild size="sm" className="w-full flat-button">
                      <Link href="/blog/generate">Generate Blog Post</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Blog History */}
                <Card className="border-indigo-200 bg-indigo-50 flat-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-indigo-500" />
                      Blog History
                    </CardTitle>
                    <CardDescription>
                      View and manage your generated blog posts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Access all your previously generated blog posts, edit content, 
                      and manage publications.
                    </p>
                    <Button asChild size="sm" variant="outline" className="w-full flat-button">
                      <Link href="/blog/history">View History</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
