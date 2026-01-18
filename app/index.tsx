import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { hasSeenFirstLantern } from "@/lib/storage";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowFirstLantern, setShouldShowFirstLantern] = useState(false);

  useEffect(() => {
    checkFirstLantern();
  }, []);

  async function checkFirstLantern() {
    const seen = await hasSeenFirstLantern();
    setShouldShowFirstLantern(!seen);
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#f4a040" />
      </View>
    );
  }

  if (shouldShowFirstLantern) {
    return <Redirect href="/first-lantern" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1a",
    alignItems: "center",
    justifyContent: "center",
  },
});
