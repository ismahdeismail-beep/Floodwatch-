import { ScrollView, StyleSheet, Text, View, Switch } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

export default function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Settings</Text>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Notifications</Text>
          <SettingRow label="Push alerts (FCM)" value={push} onChange={setPush} />
          <SettingRow label="SMS alerts" value={sms} onChange={setSms} />
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Location</Text>
          <SettingRow label="Share location for local risk" value={shareLocation} onChange={setShareLocation} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoText}>
            FloodWatch AI v0.1.0 — community early-warning app. Powered by the FloodWatch AI
            platform: satellite rainfall, river gauge telemetry, and AI flood forecasting.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.surfaceAlt, true: Colors.brand }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 20 },
  header: { color: Colors.text, fontSize: 22, fontWeight: "700" },
  group: { gap: 10 },
  groupTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowLabel: { color: Colors.text, fontSize: 14 },
  infoCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  infoTitle: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  infoText: { color: Colors.textMuted, fontSize: 13, lineHeight: 19 },
});
