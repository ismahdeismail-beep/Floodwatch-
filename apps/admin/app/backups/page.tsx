import { PageHeader, Card, Badge, Button } from "@floodwatch/ui";

interface BackupRow {
  id: string;
  scope: string;
  size: string;
  taken: string;
  status: "complete" | "in-progress" | "failed";
}

const BACKUPS: BackupRow[] = [
  { id: "BK-2026-08-04-0600", scope: "PostgreSQL (PostGIS) + object storage", size: "14.2 GB", taken: "06:00 EAT", status: "complete" },
  { id: "BK-2026-08-03-1800", scope: "PostgreSQL (PostGIS) + object storage", size: "14.1 GB", taken: "18:00 EAT", status: "complete" },
  { id: "BK-2026-08-03-0600", scope: "PostgreSQL (PostGIS) + object storage", size: "14.1 GB", taken: "06:00 EAT", status: "complete" },
  { id: "BK-2026-08-02-1800", scope: "PostgreSQL (PostGIS) + object storage", size: "14.0 GB", taken: "18:00 EAT", status: "complete" },
  { id: "BK-2026-08-02-0600", scope: "PostgreSQL (PostGIS) + object storage", size: "13.9 GB", taken: "06:00 EAT", status: "failed" },
];

export default function BackupsPage() {
  return (
    <>
      <PageHeader
        title="Backups"
        description="Automated snapshots of the operational database and object storage. Retention: 30 daily, 12 weekly, 7 monthly."
        action={<Button>Back up now</Button>}
      />

      <Card title="Backup schedule">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Backup</th>
                <th className="py-3 pr-4">Scope</th>
                <th className="py-3 pr-4">Size</th>
                <th className="py-3 pr-4">Taken</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {BACKUPS.map((b) => (
                <tr key={b.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-slate-300">{b.id}</td>
                  <td className="py-3 pr-4 text-slate-400">{b.scope}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">{b.size}</td>
                  <td className="py-3 pr-4 text-slate-400">{b.taken}</td>
                  <td className="py-3">
                    {b.status === "complete" && <Badge tone="success">Complete</Badge>}
                    {b.status === "in-progress" && <Badge tone="info">In progress</Badge>}
                    {b.status === "failed" && <Badge tone="danger">Failed</Badge>}
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
