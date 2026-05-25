import { getUser } from "@/lib/auth";
import { ShieldIcon } from "@/components/Icons";

export default async function AdminDashboardPage() {
  const user = await getUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Admin Panel
      </h1>

      <div className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex items-center gap-3 mb-4">
          <ShieldIcon className="w-6 h-6 text-destructive" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Admin Dashboard
          </h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Panel de administración — próximamente.
        </p>

        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-foreground font-mono text-sm">{user?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="text-destructive font-medium">Admin</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-green-600 font-medium">Authorized</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
