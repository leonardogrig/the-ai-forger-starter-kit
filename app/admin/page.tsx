import AdminDashboard from "@/components/admin/admin-dashboard";
import { authOptions } from "@/lib/auth";
import { isUserAdmin } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const isAdmin = await isUserAdmin(session.user.id);
  if (!isAdmin) {
    redirect("/dashboard");
  }

  const [users, totalUsersCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  const stats = {
    totalUsers: totalUsersCount,
  };

  return (
    <AdminDashboard users={users} stats={stats} />
  );
}
