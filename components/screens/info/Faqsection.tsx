import { TabInfoProps } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";
import { FaqItem } from "./FaqItem";

type FaqItemType = {
  number: string;
  question: string;
  answer: string;
};

export function FaqSection({ mezhep = "hanefi" }: TabInfoProps) {
  const styles = useStyles();

  const faqData = i18n.t(`info.${mezhep}.faq`, {
    returnObjects: true,
  }) as FaqItemType[];

  return (
    <View style={styles.faqSection}>
      <Text style={styles.faqSectionTitle}>{i18n.t(`info.faq_title`)}</Text>
      {faqData.map((item) => (
        <FaqItem
          key={item.number}
          number={item.number}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  faqSection: {
    marginBottom: 32,
  },
  faqSectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.primary, // Sabit renk yerine tema rengi atandı
    marginBottom: 16,
  },
}));
