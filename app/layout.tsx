import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import getSession from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    const adminStatus = await isUserAdmin(session.user.id);

    navbarData = {
      user: session.user,
      isAdmin: adminStatus,
    };
  }

  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
