import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

// Placeholder detail view — in production this fetches GET /api/v1/alerts/{id}
// through the gateway (wired via @floodwatch/api-client).
export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Alert {id}</Text>
        <Text style={styles.title}>Tana River flooding — Garsen</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <Text style={styles.body}>
            River levels at Garsen have exceeded the critical threshold (4.5 m) and are still
            rising. Communities within 2 km of the Tana River floodplain should move to higher
            ground immediately.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended actions</Text>
          <Text style={styles.body}>
            · Move valuables and livestock to higher ground{"\n"}· Avoid flooded roads and
            bridges{"\n"}· Follow instructions from county authorities{"\n"}· Proceed to the
            nearest evacuation shelter
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16 },
  eyebrow: { color: Colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  title: { color: Colors.text, fontSize: 24, fontWeight: "700" },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  cardTitle: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  body: { color: Colors.textMuted, fontSize: 13, lineHeight: 20 },
});
