import { TabInfoProps } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

type KerahatItem = {
  key: string;
  dot: string;
  label: string;
  desc: string;
};

function SunArc({ C }: { C: any }) {
  // SVG içeriği değişmedi
  return (
    <Svg viewBox="0 0 360 130" width="100%" height={130}>
      <Defs>
        <LinearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FAC775" stopOpacity="0.25" />
          <Stop offset="50%" stopColor="#B5D4F4" stopOpacity="0.15" />
          <Stop offset="100%" stopColor="#F5C4B3" stopOpacity="0.25" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="360" height="130" rx="6" fill="url(#skyGrad)" />
      <Line
        x1="20"
        y1="100"
        x2="340"
        y2="100"
        stroke={C.outlineVariant}
        strokeWidth="0.75"
      />
      <Path
        d="M 20 100 Q 180 -20 340 100"
        fill="none"
        stroke={C.outlineVariant}
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <Circle cx="20" cy="100" r="11" fill="#FAC775" opacity="0.9" />
      <Circle cx="20" cy="100" r="7" fill="#EF9F27" />
      <Line
        x1="20"
        y1="84"
        x2="20"
        y2="80"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="20"
        y1="116"
        x2="20"
        y2="120"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="4"
        y1="100"
        x2="0"
        y2="100"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="36"
        y1="100"
        x2="40"
        y2="100"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="180" cy="18" r="13" fill="#FAC775" opacity="0.9" />
      <Circle cx="180" cy="18" r="9" fill="#EF9F27" />
      <Line
        x1="180"
        y1="2"
        x2="180"
        y2="-2"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="180"
        y1="34"
        x2="180"
        y2="38"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="164"
        y1="18"
        x2="160"
        y2="18"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="196"
        y1="18"
        x2="200"
        y2="18"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="340" cy="100" r="11" fill="#F5C4B3" opacity="0.9" />
      <Circle cx="340" cy="100" r="7" fill="#D85A30" />
      <Line
        x1="340"
        y1="84"
        x2="340"
        y2="80"
        stroke="#D85A30"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="340"
        y1="116"
        x2="340"
        y2="120"
        stroke="#D85A30"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="324"
        y1="100"
        x2="320"
        y2="100"
        stroke="#D85A30"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line
        x1="356"
        y1="100"
        x2="360"
        y2="100"
        stroke="#D85A30"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Rect x="0" y="100" width="360" height="30" fill={C.onSurface + "10"} />
      <SvgText
        x="20"
        y="120"
        fontSize="9"
        textAnchor="middle"
        fill={C.onSurfaceVariant}
        fontWeight="500"
      >
        Doğuş
      </SvgText>
      <SvgText
        x="180"
        y="36"
        fontSize="9"
        textAnchor="middle"
        fill={C.onSurfaceVariant}
        fontWeight="500"
      >
        İstivaʼ (öğle)
      </SvgText>
      <SvgText
        x="340"
        y="120"
        fontSize="9"
        textAnchor="middle"
        fill={C.onSurfaceVariant}
        fontWeight="500"
      >
        Batış
      </SvgText>
    </Svg>
  );
}

export function MekruhVakitlerCard({ mezhep = "hanefi" }: TabInfoProps) {
  const styles = useStyles();
  const prefix = `info.${mezhep}.kerahat`;

  const items = i18n.t(`${prefix}.items`, {
    returnObjects: true,
  }) as KerahatItem[];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{i18n.t(`${prefix}.badge`)}</Text>
        </View>
        <Text style={styles.title}>{i18n.t(`${prefix}.title`)}</Text>
      </View>

      <View style={styles.arcArea}>
        <SunArc C={styles._rawColors} />

        <View style={styles.timesList}>
          {items.map((item) => (
            <View key={item.key} style={styles.timeRow}>
              <View style={styles.dotLine}>
                <View style={[styles.dot, { backgroundColor: item.dot }]} />
                <Text style={styles.timeName}>{item.label}</Text>
              </View>
              <View style={styles.descWrapper}>
                <Text style={styles.timeDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.ruleBox}>
        <Text style={styles.ruleText}>{i18n.t(`${prefix}.rule_text_raw`)}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  _rawColors: C as any,
  card: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 0.5,
    borderColor: C.outlineVariant,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: C.secondaryContainer,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: C.onSecondaryContainer,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: C.onSurface,
  },
  arcArea: {
    backgroundColor: C.surfaceVariant,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 12,
  },
  timesList: {
    gap: 10,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  dotLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 90,
    flexShrink: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeName: {
    fontSize: 12,
    fontWeight: "500",
    color: C.onSurfaceVariant,
  },
  descWrapper: {
    flex: 1,
    borderLeftWidth: 1.5,
    borderLeftColor: C.outlineVariant,
    paddingLeft: 12,
  },
  timeDesc: {
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },
  ruleBox: {
    borderTopWidth: 0.5,
    borderTopColor: C.outlineVariant,
    paddingTop: 14,
  },
  ruleText: {
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 20,
  },
}));
