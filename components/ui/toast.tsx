import { Text } from "@/components/ui/text";
import { AlertCircle, Check, Info, X } from "lucide-react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
  index: number;
}

const { width: screenWidth } = Dimensions.get("window");
const DYNAMIC_ISLAND_HEIGHT = 37;
const EXPANDED_HEIGHT = 85;
const TOAST_MARGIN = 8;
const DYNAMIC_ISLAND_WIDTH = 126;
const EXPANDED_WIDTH = screenWidth - 32;

// Daha sert, hızlı animasyon
const ANIMATION_CONFIG = {
  duration: 250,
};

export function Toast({
  id,
  title,
  description,
  variant = "default",
  onDismiss,
  index,
  action,
}: ToastProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const width = useSharedValue(DYNAMIC_ISLAND_WIDTH);
  const height = useSharedValue(DYNAMIC_ISLAND_HEIGHT);
  const borderRadius = useSharedValue(18.5);
  const contentOpacity = useSharedValue(0);

  const backgroundColor = "#1C1C1E";
  const mutedTextColor = "#8E8E93";

  useEffect(() => {
    const hasContentToShow = Boolean(title || description || action);

    if (hasContentToShow) {
      width.value = EXPANDED_WIDTH;
      height.value = EXPANDED_HEIGHT;
      borderRadius.value = 20;
      setIsExpanded(true);

      // Timing ile düz geçiş, spring yok
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 250 });
      contentOpacity.value = withTiming(1, { duration: 200 });
    } else {
      setIsExpanded(false);
      translateY.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, []);

  const getVariantColor = () => {
    switch (variant) {
      case "success":
        return "#30D158";
      case "error":
        return "#FF453A";
      case "warning":
        return "#FF9F0A";
      case "info":
        return "#007AFF";
      default:
        return "#8E8E93";
    }
  };

  const getIcon = () => {
    const iconProps = { size: 16, color: getVariantColor() };

    switch (variant) {
      case "success":
        return <Check {...iconProps} />;
      case "error":
        return <X {...iconProps} />;
      case "warning":
        return <AlertCircle {...iconProps} />;
      case "info":
        return <Info {...iconProps} />;
      default:
        return null;
    }
  };

  const dismiss = useCallback(() => {
    const onDismissAction = () => {
      "worklet";
      runOnJS(onDismiss)(id);
    };

    translateY.value = withTiming(-100, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        onDismissAction();
      }
    });
  }, [id, onDismiss]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      if (
        Math.abs(translationX) > screenWidth * 0.2 ||
        Math.abs(velocityX) > 500
      ) {
        const onDismissAction = () => {
          "worklet";
          runOnJS(onDismiss)(id);
        };

        translateX.value = withTiming(
          translationX > 0 ? screenWidth : -screenWidth,
          { duration: 200 },
        );
        opacity.value = withTiming(0, { duration: 200 }, (finished) => {
          if (finished) {
            onDismissAction();
          }
        });
      } else {
        // Spring yerine timing ile geri dönüş
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const getTopPosition = () => {
    const statusBarHeight = Platform.OS === "ios" ? 59 : 20;
    return statusBarHeight + index * (EXPANDED_HEIGHT + TOAST_MARGIN);
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  const animatedIslandStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
    backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const toastStyle: ViewStyle = {
    position: "absolute",
    top: getTopPosition(),
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000 + index,
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[toastStyle, animatedContainerStyle]}>
        <Animated.View style={animatedIslandStyle}>
          {!isExpanded && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {getIcon()}
            </View>
          )}

          {isExpanded && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                },
                animatedContentStyle,
              ]}
            >
              {getIcon() && (
                <View style={{ marginRight: 12 }}>{getIcon()}</View>
              )}

              <View style={{ flex: 1, minWidth: 0 }}>
                {title && (
                  <Text
                    variant="subtitle"
                    style={{
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: "600",
                      marginBottom: description ? 2 : 0,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {title}
                  </Text>
                )}
                {description && (
                  <Text
                    variant="caption"
                    style={{
                      color: mutedTextColor,
                      fontSize: 13,
                      fontWeight: "400",
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {description}
                  </Text>
                )}
              </View>

              {action && (
                <TouchableOpacity
                  onPress={action.onPress}
                  style={{
                    marginLeft: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: getVariantColor(),
                    borderRadius: 12,
                  }}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={dismiss}
                style={{ marginLeft: 8, padding: 4, borderRadius: 8 }}
              >
                <X size={14} color={mutedTextColor} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

interface ToastContextType {
  toast: (toast: Omit<ToastData, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToast = useCallback(
    (toastData: Omit<ToastData, "id">) => {
      const id = generateId();
      const newToast: ToastData = {
        ...toastData,
        id,
        duration: toastData.duration ?? 3000, // Daha kısa süre
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, newToast.duration);
      }
    },
    [maxToasts],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const createVariantToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      addToast({
        title,
        description,
        variant,
      });
    },
    [addToast],
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) =>
      createVariantToast("success", title, description),
    error: (title, description) =>
      createVariantToast("error", title, description),
    warning: (title, description) =>
      createVariantToast("warning", title, description),
    info: (title, description) =>
      createVariantToast("info", title, description),
    dismiss: dismissToast,
    dismissAll,
  };

  const containerStyle: ViewStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: "box-none",
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}
        <View style={containerStyle} pointerEvents="box-none">
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              {...toast}
              index={index}
              onDismiss={dismissToast}
            />
          ))}
        </View>
      </GestureHandlerRootView>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
