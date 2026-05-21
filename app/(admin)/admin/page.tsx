import { getUser } from "@/lib/auth";
import { ShieldIcon } from "@/components/Icons";

export default async function AdminPage() {
  const user = await getUser();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8 w-full max-w-lg">
        <div className="flex items-center gap-3 mb-2">
          <ShieldIcon className="w-6 h-6 text-destructive" />
          <h1 className="text-2xl font-bold text-card-foreground">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Only authorized administrators can access this panel.
        </p>

        <div className="border-t border-border pt-6 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Admin Info
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground font-mono text-sm">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="text-foreground font-semibold">Admin</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="text-green-600 font-medium">Authorized</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
