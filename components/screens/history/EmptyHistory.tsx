import { makeStyles } from "@/hooks/make-styles";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function EmptyHistory() {
  const styles = useStyles();

  return (
    <View style={styles.emptyContainer}>
      {/* İkon rengi için styles._colors kullanıldı */}
      <MaterialIcons
        name="history"
        size={48}
        color={styles._colors.outlineVariant}
      />
      <Text style={styles.emptyText}>Henüz geçmiş işlemi bulunmuyor.</Text>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  _colors: C as any, // İkon gibi bileşen dışı elemanlara renk geçmek için
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    // Opacity yerine rengin kendisini (outlineVariant) kullanmak daha temiz bir görüntü sağlar
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: C.onSurfaceVariant,
    fontWeight: "500",
    textAlign: "center",
  },
}));
