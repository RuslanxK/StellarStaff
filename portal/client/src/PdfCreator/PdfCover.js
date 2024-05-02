import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  coverColumn: {
    flexDirection: "column",
  },
  cover: {
    fontSize: '10px',
  },
});

const PdfCover = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.coverColumn}>
        <Text style={styles.cover}>
          {props.data.formData.coverLetterText}
        </Text>
      </View>
    </View>
  );
};

export default PdfCover;
