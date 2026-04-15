import { Image } from "expo-image";
import { StyleSheetProperties } from "react-native";
interface Props {
  style?: StyleSheetProperties;
}
export default function Logo({ style }: Props) {
  return (
    <Image
      style={[{ width: 40, borderRadius: 6, height: 40, ...style }]}
      source={require("../assets/logo1.png")}
      contentFit="contain"
    />
  );
}
