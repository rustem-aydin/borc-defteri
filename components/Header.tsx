import { makeStyles } from "@/hooks/make-styles";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function Header({ title = "Geçmiş" }: any) {
  const router = useRouter();
  const styles = useStyles();
  const { colors: C } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: -0.5,
  },
}));
