import type { Metadata } from "next";
import { Card } from "@floodwatch/ui";

export const metadata: Metadata = {
  title: "Emergency Contacts",
  description: "Emergency contacts and helplines for flood response in Kenya.",
};

const CONTACTS = [
  { name: "National Emergency Number", detail: "112 (or 999)", kind: "National" },
  { name: "Kenya Red Cross", detail: "1199", kind: "Humanitarian" },
  { name: "County Disaster Management", detail: "Contact your county government office", kind: "County" },
  { name: "Kenya Meteorological Department", detail: "Call 0900 100 03 (weather advisories)", kind: "Advisory" },
  { name: "Police / Fire / Ambulance", detail: "999 / 112", kind: "Emergency" },
  { name: "National Disaster Operations Centre", detail: "020 247 5050", kind: "Government" },
];

export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">Emergency Contacts</h1>
      <p className="mt-1 text-sm text-slate-400">Keep these numbers accessible. Save them before an emergency.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACTS.map((contact) => (
          <Card key={contact.name}>
            <p className="text-xs uppercase tracking-wider text-slate-500">{contact.kind}</p>
            <h3 className="mt-2 text-base font-semibold text-slate-100">{contact.name}</h3>
            <p className="mt-1 text-lg font-bold text-cyan-400">{contact.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
