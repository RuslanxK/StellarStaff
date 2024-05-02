import React from "react";
import logo from "../Resources/logo.png";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-end",
    rowGap: "5px",
  },
  upperColumn: {
    flexDirection: "column",
  },
  name: {
    fontSize: 22,
  },
  image: {
    width: 100,
    marginBottom: "10px",
  },
});

const PdfHeader = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.upperColumn}>
        <Image src={logo} style={styles.image} />
        <Text style={styles.name}>{props.data.formData.fullname}</Text>
      </View>
    </View>
  );
};

export default PdfHeader;
