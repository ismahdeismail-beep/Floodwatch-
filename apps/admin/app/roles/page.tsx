import { PageHeader, Card, Badge } from "@floodwatch/ui";

const ROLES = [
  {
    name: "super_admin",
    description: "Full control of the platform, including user management and secrets.",
    permissions: ["users.*", "roles.*", "models.promote", "settings.*", "secrets.*", "backups.restore", "audit.*"],
  },
  {
    name: "platform_admin",
    description: "Operational control of services, models, data sources, and keys.",
    permissions: ["services.*", "models.*", "datasources.*", "apikeys.*", "backups.*", "logs.read"],
  },
  {
    name: "operator",
    description: "Day-to-day platform operations and alert configuration.",
    permissions: ["alerts.*", "datasources.read", "models.read", "logs.read", "reports.*"],
  },
  {
    name: "auditor",
    description: "Read-only access to logs, audit trails, and reports.",
    permissions: ["logs.read", "audit.read", "reports.read", "backups.read"],
  },
];

export default function RolesPage() {
  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        description="RBAC matrix enforced by the auth service across all platform surfaces."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {ROLES.map((r) => (
          <Card key={r.name} title={r.name} subtitle={r.description}>
            <ul className="flex flex-wrap gap-2">
              {r.permissions.map((p) => (
                <li key={p}>
                  <Badge tone="info" className="font-mono">
                    {p}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
