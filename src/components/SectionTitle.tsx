import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <ThemedText type="defaultSemiBold" style={styles.sectionFont}>
      {title}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  sectionFont: {
    fontFamily: "nunito",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
});

export default SectionTitle;
