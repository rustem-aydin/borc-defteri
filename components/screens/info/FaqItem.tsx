import { makeStyles } from "@/hooks/make-styles";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FaqItemProps {
  number: string;
  question: string;
  answer: string;
}

export function FaqItem({ number, question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => setOpen((v) => !v)}
      style={styles.faqItem}
    >
      <View style={styles.faqRow}>
        <Text style={styles.faqNumber}>{number}</Text>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Text style={styles.faqChevron}>{open ? "↑" : "›"}</Text>
      </View>
      {open && <Text style={styles.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

const useStyles = makeStyles((C) => ({
  faqItem: {
    backgroundColor: C.surfaceLow,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  faqNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: C.primary,
    width: 32,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurface,
    flex: 1,
  },
  faqChevron: {
    fontSize: 20,
    color: C.outline,
  },
  faqAnswer: {
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 20,
    marginTop: 10,
    paddingLeft: 32,
  },
}));
