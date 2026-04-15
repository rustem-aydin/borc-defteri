// hooks/useColors.ts

import { useTheme } from "@/lib/ThemeContext";

export const useColors = () => useTheme().colors;
