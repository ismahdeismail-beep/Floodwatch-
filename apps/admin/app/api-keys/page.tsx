import { PageHeader, Card, Badge, Button } from "@floodwatch/ui";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string;
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
}

const KEYS: ApiKey[] = [
  { id: "KEY-001", name: "NDMA integration", prefix: "fw_live_8f3a…", scopes: "alerts:read, alerts:write", created: "2026-06-10", lastUsed: "now", status: "active" },
  { id: "KEY-002", name: "County GIS portal", prefix: "fw_live_21c9…", scopes: "risk:read, maps:read", created: "2026-06-22", lastUsed: "12 min ago", status: "active" },
  { id: "KEY-003", name: "Media partner feed", prefix: "fw_live_77b2…", scopes: "alerts:read", created: "2026-07-01", lastUsed: "1 h ago", status: "active" },
  { id: "KEY-004", name: "Legacy mobile relay", prefix: "fw_live_e05d…", scopes: "alerts:read", created: "2026-03-15", lastUsed: "2026-06-30", status: "revoked" },
];

export default function ApiKeysPage() {
  return (
    <>
      <PageHeader
        title="API Keys"
        description="Machine-to-machine credentials issued by the auth service. Keys are stored hashed; show once on creation."
        action={<Button>Issue key</Button>}
      />

      <Card title="Active keys">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Key prefix</th>
                <th className="py-3 pr-4">Scopes</th>
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 pr-4">Last used</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {KEYS.map((k) => (
                <tr key={k.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-100">
                    {k.name}
                    <span className="ml-2 font-mono text-xs text-slate-600">{k.id}</span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-400">{k.prefix}</td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-slate-500">{k.scopes}</td>
                  <td className="py-3 pr-4 text-slate-400">{k.created}</td>
                  <td className="py-3 pr-4 text-slate-400">{k.lastUsed}</td>
                  <td className="py-3">
                    {k.status === "active" ? (
                      <Badge tone="success">Active</Badge>
                    ) : (
                      <Badge tone="danger">Revoked</Badge>
                    )}
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
