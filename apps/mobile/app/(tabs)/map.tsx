import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, RiskColors } from "@/constants/theme";

const DEFAULT_REGION = {
  latitude: Number(process.env.EXPO_PUBLIC_DEFAULT_LAT ?? -1.2921),
  longitude: Number(process.env.EXPO_PUBLIC_DEFAULT_LNG ?? 36.8219),
  latitudeDelta: 8,
  longitudeDelta: 8,
};

const ZONES = [
  { id: "z1", name: "Tana Delta", lat: -2.55, lng: 40.32, risk: "extreme" },
  { id: "z2", name: "Garissa Town", lat: -0.4569, lng: 39.658, risk: "high" },
  { id: "z3", name: "Kisumu Lakeshore", lat: -0.0917, lng: 34.768, risk: "high" },
  { id: "z4", name: "Mathare, Nairobi", lat: -1.2617, lng: 36.8626, risk: "moderate" },
] as const;

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <MapView style={styles.map} initialRegion={DEFAULT_REGION}>
        {ZONES.map((z) => (
          <Marker
            key={z.id}
            coordinate={{ latitude: z.lat, longitude: z.lng }}
            title={z.name}
            description={`Flood risk: ${z.risk}`}
            pinColor={RiskColors[z.risk]}
          />
        ))}
      </MapView>
      <View style={styles.legend}>
        {(["low", "moderate", "high", "extreme"] as const).map((level) => (
          <View key={level} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: RiskColors[level] }]} />
            <Text style={styles.legendText}>{level}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  map: { ...StyleSheet.absoluteFillObject },
  legend: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: Colors.textMuted, fontSize: 12, textTransform: "capitalize" },
});
