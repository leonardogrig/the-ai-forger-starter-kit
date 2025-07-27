"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../../app/generated/prisma";
import UserManagement from "./user-management";

interface AdminDashboardProps {
  users: any[];
  stats: {
    totalUsers: number;
  };
}

export default function AdminDashboard({
  users: initialUsers,
  stats,
}: AdminDashboardProps) {
  const [users, setUsers] = useState(initialUsers);

  const handleUserUpdate = (
    userId: string,
    updates: { role?: UserRole }
  ) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };


  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <UserManagement users={users} onUserUpdate={handleUserUpdate} />
    </div>
  );
}
