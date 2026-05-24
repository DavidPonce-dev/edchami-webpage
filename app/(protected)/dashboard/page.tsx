import { getUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-card-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground mb-6">
          Welcome back, <span className="font-semibold text-foreground">{user?.email}</span>
        </p>

        <div className="border-t border-border pt-6 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Account Info
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground font-mono text-sm">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="text-foreground">
                {user?.role === "admin" ? (
                  <span className="text-destructive font-medium">Admin</span>
                ) : (
                  <span className="text-muted-foreground">User</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
