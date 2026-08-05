import { PageHeader, Card, Badge, Button } from "@floodwatch/ui";
import type { UserRole } from "@floodwatch/types";

interface DashboardUser {
  id: string;
  fullName: string;
  email: string;
  agency: string;
  role: UserRole;
  lastActive: string;
}

const USERS: DashboardUser[] = [
  { id: "USR-001", fullName: "Wanjiru Kamau", email: "wanjiru.kamau@disaster.go.ke", agency: "NDMA", role: "admin", lastActive: "now" },
  { id: "USR-002", fullName: "Omar Abdi", email: "omar.abdi@garissa.go.ke", agency: "County Gov", role: "operator", lastActive: "12 min ago" },
  { id: "USR-003", fullName: "Grace Mwende", email: "grace.mwende@kra.go.ke", agency: "KMD", role: "analyst", lastActive: "1 h ago" },
  { id: "USR-004", fullName: "Daniel Ochieng", email: "daniel.ochieng@kisumu.go.ke", agency: "County Gov", role: "operator", lastActive: "3 h ago" },
  { id: "USR-005", fullName: "Fatuma Noor", email: "fatuma.noor@nairobi.go.ke", agency: "County Gov", role: "viewer", lastActive: "yesterday" },
  { id: "USR-006", fullName: "Peter Kilonzo", email: "peter.kilonzo@wrma.go.ke", agency: "WRMA", role: "analyst", lastActive: "2 d ago" },
];

const ROLE_TONE = {
  admin: "danger",
  operator: "info",
  analyst: "warning",
  viewer: "default",
} as const;

export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="Users & Roles"
        description="Agency access to the operations dashboard. Roles: admin, operator, analyst, viewer."
        action={<Button>Invite user</Button>}
      />

      <Card title={`${USERS.length} active agency accounts`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Agency</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Last active</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-100">{u.fullName}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{u.agency}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{u.lastActive}</td>
                  <td className="py-3">
                    <Badge tone="success">Active</Badge>
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
