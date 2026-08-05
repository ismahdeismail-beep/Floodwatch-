import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

interface Shelter {
  id: string;
  name: string;
  county: string;
  capacity: string;
  status: "open" | "nearly full" | "full";
}

const SHELTERS: Shelter[] = [
  { id: "S-101", name: "Garsen County Hall", county: "Tana River", capacity: "320 / 500", status: "open" },
  { id: "S-102", name: "Garissa Primary School", county: "Garissa", capacity: "410 / 450", status: "nearly full" },
  { id: "S-103", name: "Kisumu Social Hall", county: "Kisumu", capacity: "180 / 400", status: "open" },
  { id: "S-104", name: "Mumias Stadium Pavilion", county: "Kakamega", capacity: "150 / 300", status: "open" },
];

const STATUS_COLOR: Record<Shelter["status"], string> = {
  open: Colors.success,
  "nearly full": Colors.warning,
  full: Colors.danger,
};

export default function SheltersScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={SHELTERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.header}>Evacuation shelters</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.status, { color: STATUS_COLOR[item.status] }]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.county}>{item.county}</Text>
            <View style={styles.capacityTrack}>
              <View style={[styles.capacityFill, { width: `${(Number(item.capacity.split(" / ")[0]) / Number(item.capacity.split(" / ")[1])) * 100}%` }]} />
            </View>
            <Text style={styles.capacityText}>{item.capacity} occupants / capacity</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 12 },
  header: { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: 4 },
  card: {
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: Colors.text, fontSize: 15, fontWeight: "600", flex: 1 },
  status: { fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  county: { color: Colors.textMuted, fontSize: 12 },
  capacityTrack: { height: 6, borderRadius: 3, backgroundColor: Colors.surfaceAlt, overflow: "hidden" },
  capacityFill: { height: "100%", borderRadius: 3, backgroundColor: Colors.brand },
  capacityText: { color: Colors.textMuted, fontSize: 11 },
});
