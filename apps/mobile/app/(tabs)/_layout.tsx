import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import type { ComponentProps } from "react";

type TabBarIconProps = {
  color: string;
  size: number;
};

type IconName = ComponentProps<typeof Ionicons>["name"];

function TabIcon({ color, size, name }: TabBarIconProps & { name: IconName }) {
  return <Ionicons name={name} color={color} size={size} />;
}

const ACTIVE = Colors.brandSoft;
const INACTIVE = Colors.textMuted;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.text,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: (props: TabBarIconProps) => <TabIcon {...props} name="home" />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: (props: TabBarIconProps) => <TabIcon {...props} name="map" />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: (props: TabBarIconProps) => <TabIcon {...props} name="notifications" />,
        }}
      />
      <Tabs.Screen
        name="shelters"
        options={{
          title: "Shelters",
          tabBarIcon: (props: TabBarIconProps) => <TabIcon {...props} name="business" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: (props: TabBarIconProps) => <TabIcon {...props} name="settings" />,
        }}
      />
    </Tabs>
  );
}
