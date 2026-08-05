import { PageHeader, Card, Button } from "@floodwatch/ui";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        title="Platform Settings"
        description="Environment-level configuration. Changes require the super_admin role."
        action={<Button>Apply changes</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Secrets" subtitle="Credentials are injected via environment / secret manager — never stored here">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-300">Supabase service role</span><span className="font-mono text-slate-500">••••••••</span></li>
            <li className="flex justify-between"><span className="text-slate-300">NASA Earthdata token</span><span className="font-mono text-slate-500">••••••••</span></li>
            <li className="flex justify-between"><span className="text-slate-300">ECMWF CDS API key</span><span className="font-mono text-slate-500">••••••••</span></li>
            <li className="flex justify-between"><span className="text-slate-300">Firebase service account</span><span className="font-mono text-slate-500">••••••••</span></li>
          </ul>
        </Card>

        <Card title="Environment" subtitle="Deployment targets">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-300">Production</span><span className="text-emerald-400">Healthy</span></li>
            <li className="flex justify-between"><span className="text-slate-300">Staging</span><span className="text-emerald-400">Healthy</span></li>
            <li className="flex justify-between"><span className="text-slate-300">Preview</span><span className="text-slate-400">Idle</span></li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Deployment is managed via Terraform (Google Cloud Run) + GitHub Actions. See
            infrastructure/terraform and .github/workflows.
          </p>
        </Card>

        <Card title="Observability" subtitle="Monitoring & alerting">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-300">Prometheus</span><span className="text-emerald-400">Scraping</span></li>
            <li className="flex justify-between"><span className="text-slate-300">Grafana</span><span className="text-emerald-400">Dashboards live</span></li>
            <li className="flex justify-between"><span className="text-slate-300">Loki logs</span><span className="text-emerald-400">Ingesting</span></li>
          </ul>
        </Card>

        <Card title="Feature flags" subtitle="Gradual rollout controls">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-300">WhatsApp broadcast channel</span><span className="text-cyan-400">On (10%)</span></li>
            <li className="flex justify-between"><span className="text-slate-300">GloFAS integration</span><span className="text-slate-500">Off</span></li>
            <li className="flex justify-between"><span className="text-slate-300">New landing page</span><span className="text-cyan-400">On (100%)</span></li>
          </ul>
        </Card>
      </div>
    </>
  );
}
