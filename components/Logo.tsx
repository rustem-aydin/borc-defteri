import { Image, ImageStyle } from "expo-image";
import { StyleProp } from "react-native";
interface Props {
  style?: StyleProp<ImageStyle>;
}
export default function Logo({ style }: Props) {
  return (
    <Image
      style={[{ width: 40, borderRadius: 6, height: 40 }, style]}
      source={require("../assets/logo-mark.webp")}
      contentFit="contain"
    />
  );
}
