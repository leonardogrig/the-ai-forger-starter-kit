import "next-auth";
import { DefaultSession } from "next-auth";
import { UserRole } from "../app/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      createdAt: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    createdAt: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

