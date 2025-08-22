import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import getSession from "@/lib/auth";
import {
  checkUserAccess,
  getUserTokens,
  isUserAdmin,
} from "@/lib/subscription";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Forger Starter Kit",
  description: "Next.js starter with NextAuth and Stripe",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Get user data for navbar if authenticated
  let navbarData = {};
  if (session?.user) {
    const [{ hasAccess, subscription }, tokenInfo, adminStatus] =
      await Promise.all([
        checkUserAccess(session.user.id),
        getUserTokens(session.user.id),
        isUserAdmin(session.user.id),
      ]);

    navbarData = {
      user: session.user,
      hasAccess,
      tokenInfo,
      isAdmin: adminStatus,
      hasSubscription: !!subscription,
    };
  }

  return (
    <html lang="en">
      <head>
        <script src="https://js.stripe.com/v3/" async></script>
      </head>
      <body
        className={`${roboto.variable} antialiased`}
      >
        <NextTopLoader showSpinner={false} color="#5c7aff" />
        <SessionProvider session={session}>
          <Navbar {...navbarData} />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
