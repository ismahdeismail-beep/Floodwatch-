import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { riskLevelFromScore, riskLabel } from "@floodwatch/utils";
import { Colors, RiskColors } from "@/constants/theme";

const DEMO = {
  location: "Mathare, Nairobi",
  score: 0.74,
  expectedDepthM: 1.4,
  durationHours: 9,
  confidence: 0.82,
};

export default function HomeScreen() {
  const level = useMemo(() => riskLevelFromScore(DEMO.score), []);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Your location</Text>
        <Text style={styles.title}>{DEMO.location}</Text>

        <View style={[styles.riskCard, { borderColor: RiskColors[level] }]}>
          <Text style={[styles.riskLabel, { color: RiskColors[level] }]}>
            {riskLabel(level)} risk
          </Text>
          <Text style={styles.riskScore}>
            {(DEMO.score * 100).toFixed(0)}<Text style={styles.riskScoreSuffix}>/100</Text>
          </Text>
          <Text style={styles.riskHint}>
            Next 48 hours · model confidence {Math.round(DEMO.confidence * 100)}%
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{DEMO.expectedDepthM.toFixed(1)} m</Text>
            <Text style={styles.metricLabel}>Expected depth</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{DEMO.durationHours} h</Text>
            <Text style={styles.metricLabel}>Duration</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What you should do</Text>
          <Text style={styles.infoBody}>
            Stay alert and monitor local announcements. Move valuables to higher ground, keep
            your emergency kit ready, and avoid flooded roads.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16 },
  eyebrow: { color: Colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  title: { color: Colors.text, fontSize: 28, fontWeight: "700" },
  riskCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    backgroundColor: Colors.surface,
    gap: 8,
  },
  riskLabel: { fontSize: 14, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  riskScore: { color: Colors.text, fontSize: 44, fontWeight: "800" },
  riskScoreSuffix: { fontSize: 18, color: Colors.textMuted, fontWeight: "600" },
  riskHint: { color: Colors.textMuted, fontSize: 12 },
  grid: { flexDirection: "row", gap: 12 },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricValue: { color: Colors.brandSoft, fontSize: 22, fontWeight: "700" },
  metricLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: Colors.surfaceAlt,
    gap: 8,
  },
  infoTitle: { color: Colors.text, fontSize: 15, fontWeight: "600" },
  infoBody: { color: Colors.textMuted, fontSize: 13, lineHeight: 20 },
});
