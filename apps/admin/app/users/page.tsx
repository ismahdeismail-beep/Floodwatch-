import { PageHeader, Card, Badge, Button } from "@floodwatch/ui";

interface PlatformUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "active" | "disabled";
  mfa: boolean;
  createdAt: string;
}

const USERS: PlatformUser[] = [
  { id: "USR-9001", fullName: "Amina Yusuf", email: "amina@floodwatch.ai", role: "super_admin", status: "active", mfa: true, createdAt: "2026-01-12" },
  { id: "USR-9002", fullName: "Brian Otieno", email: "brian.otieno@floodwatch.ai", role: "platform_admin", status: "active", mfa: true, createdAt: "2026-02-03" },
  { id: "USR-9003", fullName: "Cynthia Wanjala", email: "cynthia.w@floodwatch.ai", role: "operator", status: "active", mfa: false, createdAt: "2026-03-18" },
  { id: "USR-9004", fullName: "Samuel Kiprotich", email: "sam.k@floodwatch.ai", role: "operator", status: "disabled", mfa: false, createdAt: "2026-04-02" },
  { id: "USR-9005", fullName: "Linda Achieng", email: "linda.a@floodwatch.ai", role: "auditor", status: "active", mfa: true, createdAt: "2026-05-27" },
];

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Platform Users"
        description="Accounts with access to the admin console and platform tooling."
        action={<Button>Create user</Button>}
      />

      <Card title={`${USERS.length} platform accounts`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">MFA</th>
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-100">{u.fullName}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-cyan-400">{u.role}</td>
                  <td className="py-3 pr-4">
                    {u.mfa ? <Badge tone="success">Enabled</Badge> : <Badge>Not set</Badge>}
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{u.createdAt}</td>
                  <td className="py-3 pr-4">
                    {u.status === "active" ? (
                      <Badge tone="success">Active</Badge>
                    ) : (
                      <Badge tone="danger">Disabled</Badge>
                    )}
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="secondary">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
