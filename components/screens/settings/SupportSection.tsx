import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, Share, Text, View } from "react-native";

export function SupportSection() {
  const styles = useStyles();
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();

  const handleShare = async () => {
    try {
      const message =
        i18n.t(`support.shareMessage`) || "Bu harika uygulamaya göz at!";
      const url =
        "https://play.google.com/store/apps/details?id=com.rustem_aydin.borcdefteri";
      await Share.share({
        message: `${message}\n\n${url}`,
      });
    } catch (error) {}
  };

  const handleRate = async () => {
    const url =
      i18n.t(`support.googlePlayUrl`) || "market://details?id=com.yourapp";
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleVisitWebsite = async () => {
    const url = i18n.t(`support.websiteUrl`) || "https://yoursite.com";
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const supportItems = [
    {
      icon: "share" as const,
      iconBg: C.primaryContainer,
      iconColor: C.onPrimaryContainer,
      title: i18n.t(`support.shareApp`),
      subtitle: i18n.t(`support.shareHint`),
      onPress: handleShare,
    },
    {
      icon: "star" as const,
      iconBg: C.tertiaryContainer,
      iconColor: C.onTertiaryContainer,
      title: i18n.t(`support.rateApp`),
      subtitle: i18n.t(`support.rateHint`),
      onPress: handleRate,
    },
    {
      icon: "language" as const,
      iconBg: C.secondaryContainer,
      iconColor: C.onSecondaryContainer,
      title: i18n.t(`support.visitWebsite`),
      subtitle: i18n.t(`support.websiteHint`),
      onPress: handleVisitWebsite,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="favorite" size={22} color={C.primary} />
        <Text style={styles.sectionTitle}>{i18n.t(`support.title`)}</Text>
      </View>

      <View style={styles.card}>
        {supportItems.map((item, index) => (
          <Pressable
            key={item.title}
            onPress={item.onPress}
            style={({ pressed }) => [
              rowStyles.container,
              pressed && rowStyles.containerPressed,
              index !== supportItems.length - 1 && rowStyles.borderBottom,
            ]}
          >
            <View style={rowStyles.left}>
              <View
                style={[rowStyles.iconWrap, { backgroundColor: item.iconBg }]}
              >
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={item.iconColor}
                />
              </View>
              <View style={rowStyles.textWrap}>
                <Text style={rowStyles.title}>{item.title}</Text>
                <Text style={rowStyles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={C.onSurfaceVariant}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const useRowStyles = makeStyles((C) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  containerPressed: {
    backgroundColor: C.surfaceContainerLow,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
    marginRight: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1 },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: C.onSurface,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
}));

const useStyles = makeStyles((C) => ({
  container: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: C.onSurface,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    overflow: "hidden",
  },
}));
