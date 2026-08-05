import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AlertSeverity } from "@floodwatch/types";
import { Colors, SeverityColors } from "@/constants/theme";

interface MobileAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  location: string;
  time: string;
}

const ALERTS: MobileAlert[] = [
  { id: "ALT-1041", title: "Tana River flooding — Garsen", severity: "critical", location: "Tana River County", time: "2 min ago" },
  { id: "ALT-1040", title: "Persistent heavy rainfall expected", severity: "warning", location: "Garissa County", time: "18 min ago" },
  { id: "ALT-1039", title: "Lake Victoria levels rising", severity: "warning", location: "Kisumu County", time: "41 min ago" },
  { id: "ALT-1038", title: "River Nzoia at watch level", severity: "watch", location: "Kakamega County", time: "1 h ago" },
];

export default function AlertsScreen() {
  const sorted = useMemo(
    () => [...ALERTS].sort((a, b) => SeverityOrder[b.severity] - SeverityOrder[a.severity]),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.header}>Active alerts</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View
              style={[styles.severityBar, { backgroundColor: SeverityColors[item.severity] }]}
            />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={[styles.severity, { color: SeverityColors[item.severity] }]}>
                  {item.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const SeverityOrder: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  watch: 2,
  info: 3,
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 12 },
  header: { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  severityBar: { width: 5 },
  cardBody: { flex: 1, padding: 14, gap: 4 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  title: { color: Colors.text, fontSize: 14, fontWeight: "600", flex: 1 },
  severity: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  location: { color: Colors.textMuted, fontSize: 12 },
  time: { color: Colors.textMuted, fontSize: 11 },
});
