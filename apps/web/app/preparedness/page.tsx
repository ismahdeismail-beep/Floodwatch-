import type { Metadata } from "next";
import { Card } from "@floodwatch/ui";

export const metadata: Metadata = {
  title: "Preparedness",
  description: "Flood preparedness guides and safety advice.",
};

const GUIDES = [
  {
    title: "Before a flood",
    items: [
      "Check your flood risk regularly on this platform.",
      "Know the warning levels: Green (info), Yellow (watch), Orange (warning), Red (critical).",
      "Prepare an emergency kit: water, food, documents, torch, radio, phone charger.",
      "Identify the highest ground and safe routes to reach it.",
      "Save emergency contacts in your phone.",
    ],
  },
  {
    title: "During a flood",
    items: [
      "Move to higher ground immediately — never wait.",
      "Do not walk, drive or swim through floodwater. 15 cm of moving water can knock you over.",
      "Avoid bridges over fast-flowing water.",
      "Turn off gas and electricity if it is safe to do so.",
      "Listen to official broadcasts and FloodWatch alerts.",
    ],
  },
  {
    title: "After a flood",
    items: [
      "Wait for official all-clear before returning.",
      "Watch for hidden hazards: downed power lines, damaged roads, contaminated water.",
      "Do not enter buildings surrounded by floodwater.",
      "Report damage to local authorities.",
      "Boil or treat water until the supply is declared safe.",
    ],
  },
];

export default function PreparednessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">Preparedness Guides</h1>
      <p className="mt-1 text-sm text-slate-400">Practical guidance to protect your family and property.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {GUIDES.map((guide) => (
          <Card key={guide.title} title={guide.title}>
            <ul className="space-y-3">
              {guide.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-400">
                  <span className="text-cyan-500">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
