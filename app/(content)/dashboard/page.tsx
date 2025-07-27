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
import { isUserAdmin } from "@/lib/auth";
import { Gift } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const isAdmin = await isUserAdmin(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back,{" "}
              {session.user.name?.split(" ")[0] || session.user.email}!
            </h1>
            <p className="text-gray-600">
              Here's your personalized dashboard overview
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-6 mb-8">
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

          </div>

        </div>
      </div>
    </div>
  );
}
