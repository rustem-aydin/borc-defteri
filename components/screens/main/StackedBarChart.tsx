import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  DeviceEventEmitter,
  LayoutChangeEvent,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const TOOLTIP_WIDTH = 160;
const TOOLTIP_GAP = 6;

// ─── Tooltip Modal ──────────────────────────────────────────────────────────
function TooltipModal({
  visible,
  anchor,
  item,
  onClose,
}: {
  visible: boolean;
  anchor: { x: number; y: number; width: number; height: number } | null;
  item: any | null;
  onClose: () => void;
}) {
  const styles = useStyles();

  if (!visible || !anchor || !item) return null;

  const tooltipTop = anchor.y + anchor.height + TOOLTIP_GAP;
  const tooltipLeft = anchor.x + anchor.width / 2 - TOOLTIP_WIDTH / 2;
  const safeLeft = Math.max(8, tooltipLeft);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }}>
          <View
            style={[
              styles.tooltipBox,
              {
                position: "absolute",
                width: TOOLTIP_WIDTH,
                top: tooltipTop,
                left: safeLeft,
              },
            ]}
          >
            <View style={styles.popoverHeader}>
              <Text style={styles.popoverTitle}>
                {item.day} {i18n.t("home.barChart.detaylari")}
              </Text>
            </View>
            {item.segments.map((seg: any, idx: number) => (
              <View key={idx} style={styles.popoverRow}>
                <View style={[styles.dot, { backgroundColor: seg.c }]} />
                <Text style={styles.popoverLabel}>
                  {i18n.t("diger.vakitler")[seg.vakit]}
                </Text>
                <Text style={styles.popoverValue}>
                  {seg.h} {i18n.t("diger.vakit")}
                </Text>
              </View>
            ))}
            <View style={styles.popoverFooter}>
              <Text style={styles.totalText}>
                {i18n.t("diger.toplam")}: {item.val} {i18n.t("diger.vakit")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ─── Bar Tetikleyici ────────────────────────────────────────────────────────
function BarTrigger({
  item,
  barWidth,
  onOpen,
}: {
  item: any;
  barWidth: number;
  onOpen: (ref: React.RefObject<View | null>, item: any) => void;
}) {
  const styles = useStyles();
  const ref = useRef<View | null>(null);
  return (
    <View ref={ref} collapsable={false} style={styles.triggerWrapper}>
      <Pressable
        style={{ width: barWidth, height: "100%" }}
        onPress={() => onOpen(ref, item)}
      />
    </View>
  );
}

// ─── Ana Bileşen ────────────────────────────────────────────────────────────
export function StackedBarChart({ data }: { data: any[] }) {
  const styles = useStyles();
  const { colors: C } = useTheme();

  const [containerWidth, setContainerWidth] = useState(300);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [dailyTarget, setDailyTarget] = useState<number>(5);
  const [tooltipAnchor, setTooltipAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [tooltipItem, setTooltipItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchDailyTarget = async () => {
      try {
        const storedDaily = await AsyncStorage.getItem("@target_daily");
        if (storedDaily) {
          setDailyTarget(Number(storedDaily));
        }
      } catch (error) {
        console.log(i18n.t("home.barChat.error"), error);
      }
    };

    fetchDailyTarget();

    const subscription = DeviceEventEmitter.addListener("TargetUpdated", () => {
      fetchDailyTarget();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const height = 220;
  const paddingTop = 24;
  const paddingBottom = 40;
  const paddingLeft = 36;
  const paddingRight = 10;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) setContainerWidth(width);
  };

  const handleOpen = (ref: React.RefObject<View | null>, item: any) => {
    ref.current?.measureInWindow((x, y, w, h) => {
      setTooltipAnchor({ x, y, width: w, height: h });
      setTooltipItem(item);
      setTooltipVisible(true);
    });
  };

  if (!data || data.length === 0) return null;

  const actualMaxVakit = Math.max(
    ...data.map((item) =>
      item.segments.reduce((sum: any, seg: any) => sum + seg.h, 0),
    ),
  );
  const maxAxisValue = Math.max(actualMaxVakit, dailyTarget);
  const yDomain = Math.max(6, Math.ceil(maxAxisValue / 2) * 2);

  const chartWidth = containerWidth;
  const innerChartWidth = chartWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const bottomY = paddingTop + chartHeight;

  const barWidth = (innerChartWidth / data.length) * 0.55;
  const barSpacing = (innerChartWidth / data.length) * 0.45;

  const targetYPos = bottomY - (dailyTarget / yDomain) * chartHeight;

  return (
    <>
      <View style={styles.card} onLayout={handleLayout} collapsable={false}>
        <Svg width={chartWidth} height={height}>
          <G>
            {[0, 0.5, 1].map((ratio, i) => {
              const val = yDomain * ratio;
              const yPos = bottomY - (val / yDomain) * chartHeight;
              const isCloseToTarget =
                Math.abs(val - dailyTarget) <= yDomain * 0.15;

              return (
                <G key={`grid-${i}`}>
                  {!isCloseToTarget && (
                    <SvgText
                      x={paddingLeft - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      fontSize={10}
                      fontWeight="700"
                      fill={C.outline}
                    >
                      {Math.round(val)}
                    </SvgText>
                  )}
                  <Line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={chartWidth - paddingRight}
                    y2={yPos}
                    stroke={C.outlineVariant}
                  />
                </G>
              );
            })}
          </G>

          <G>
            <Line
              x1={paddingLeft}
              y1={targetYPos}
              x2={chartWidth - paddingRight}
              y2={targetYPos}
              stroke={C.tertiary}
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />
            <SvgText
              x={paddingLeft - 8}
              y={targetYPos + 4}
              textAnchor="end"
              fontSize={11}
              fontWeight="800"
              fill={C.tertiary}
            >
              {dailyTarget}
            </SvgText>
            <SvgText
              x={paddingLeft + 6}
              y={targetYPos - 6}
              textAnchor="start"
              fontSize={9}
              fontWeight="700"
              fill={C.tertiary}
              opacity={0.9}
            >
              Hedef
            </SvgText>
          </G>

          {data.map((item, itemIndex) => {
            let cumulativeHeight = 0;
            const x =
              paddingLeft +
              itemIndex * (barWidth + barSpacing) +
              barSpacing / 2;

            const totalVakit = item.segments.reduce(
              (sum: any, seg: any) => sum + seg.h,
              0,
            );
            const totalBarHeight = (totalVakit / yDomain) * chartHeight;
            const topLabelY = bottomY - totalBarHeight - 6;

            return (
              <G key={`bar-${itemIndex}`}>
                {item.segments.map((seg: any, idx: number) => {
                  const segmentHeight = (seg.h / yDomain) * chartHeight;
                  const currentCumulative = cumulativeHeight;
                  cumulativeHeight += segmentHeight;
                  return (
                    <AnimatedSegment
                      key={`seg-${idx}`}
                      x={x}
                      barWidth={barWidth}
                      color={seg.c}
                      targetHeight={segmentHeight}
                      targetCumulativeHeight={currentCumulative}
                      bottomY={bottomY}
                      isTop={idx === item.segments.length - 1}
                    />
                  );
                })}

                {totalVakit > 0 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={topLabelY}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="800"
                    fill={C.primary}
                  >
                    {item.val !== undefined ? item.val : totalVakit}
                  </SvgText>
                )}

                <SvgText
                  x={x + barWidth / 2}
                  y={height - 15}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="800"
                  fill={C.outline}
                >
                  {item.day}
                </SvgText>
              </G>
            );
          })}
        </Svg>

        <View
          style={[
            styles.overlay,
            {
              left: paddingLeft,
              right: paddingRight,
              top: paddingTop,
              height: chartHeight,
            },
          ]}
          pointerEvents="box-none"
        >
          {data.map((item, index) => (
            <BarTrigger
              key={`trigger-${index}`}
              item={item}
              barWidth={barWidth}
              onOpen={handleOpen}
            />
          ))}
        </View>
      </View>

      <TooltipModal
        visible={tooltipVisible}
        anchor={tooltipAnchor}
        item={tooltipItem}
        onClose={() => setTooltipVisible(false)}
      />
    </>
  );
}

// ─── AnimatedSegment ────────────────────────────────────────────────────────
const AnimatedSegment = ({
  x,
  barWidth,
  color,
  targetHeight,
  targetCumulativeHeight,
  bottomY,
  isTop,
}: any) => {
  const animatedProps = useAnimatedProps(() => ({
    height: withTiming(targetHeight, { duration: 400 }),
    y: withTiming(bottomY - targetCumulativeHeight - targetHeight, {
      duration: 400,
    }),
  }));
  return (
    <AnimatedRect
      x={x}
      width={barWidth}
      fill={color}
      rx={isTop ? 2 : 0}
      animatedProps={animatedProps}
    />
  );
};

const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    position: "relative",
    overflow: "visible",
    marginBottom: 18,
  },
  overlay: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
  },
  triggerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipBox: {
    backgroundColor: C.surfaceContainerLowest,
    padding: 12,
    borderRadius: 12,
    shadowColor: C.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  popoverHeader: {
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
    marginBottom: 8,
    paddingBottom: 4,
  },
  popoverTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: C.onSurface,
  },
  popoverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  popoverLabel: {
    fontSize: 11,
    color: C.outline,
    flex: 1,
  },
  popoverValue: {
    fontSize: 11,
    fontWeight: "700",
    color: C.onSurface,
  },
  popoverFooter: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant,
  },
  totalText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.primary,
    textAlign: "right",
  },
}));
