import { getUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Overview
      </h1>

      <div className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Welcome back, {user?.username || user?.email}
        </h2>

        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-foreground font-mono text-sm">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Username</dt>
            <dd className="text-foreground font-mono text-sm">{user?.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="text-foreground">
              {user?.role === "admin" ? (
                <span className="text-destructive font-medium">Admin</span>
              ) : (
                <span className="text-muted-foreground capitalize">{user?.role || "User"}</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
