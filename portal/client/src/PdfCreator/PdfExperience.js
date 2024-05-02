import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  experienceColumn: {
    flexDirection: "column",
  },
  title: {
    fontSize: "18px",
    borderBottom: "1px solid black",
    paddingBottom: "5px",
    marginBottom: "10px",
  },
  experienceItem: {
    marginBottom: "5px",
    borderBottom: "1px solid gray",
    paddingBottom: "5px",
  },
  companyName: {
    fontSize: "16px",
    fontWeight: "800",
    marginBottom: "5px",
  },
  companyLocation: {
    fontSize: "12px",
  },
  companyDescription: {
    fontSize: "10px",
  },
  companyDates: {
    fontSize: "10px",
  },
  topSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  companyColumn: {
    display: "flex",
    flexDirection: "column",
    columnGap: 5,
  },
  datesColumn: {
    display: "flex",
    flexDirection: "row",
    columnGap: 5,
  },
  companyDescription: {
    marginTop: "10px",
    fontSize: "10px",
  },
});

const PdfExperience = (props) => {
  const convertDates = (date) => {
    if (!date) {
      return "No date";
    } else {
      const dateString = date;
      const dateObject = new Date(dateString);

      const year = dateObject.getFullYear();
      const month = dateObject.toLocaleString("default", { month: "long" });
      const day = dateObject.getDate();

      const formattedDate = `${day} ${month} ${year}`;

      return formattedDate;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.experienceColumn}>
        <Text style={styles.title}>Experience</Text>
      </View>
      <View>
        {props.data.formData.experience.map((item, index) => {
          return (
            <View style={styles.experienceItem} key={index}>
              <View style={styles.topSection}>
                <View style={styles.companyColumn}>
                  <Text style={styles.companyName}>{item.companyName}</Text>
                  <Text style={styles.companyLocation}>{item.companyLocation}</Text>
                </View>
                <View style={styles.datesColumn}>
                  <Text style={styles.companyDates}>
                    {convertDates(item.fromDate)} -{" "}
                    {item.toDate === "Present" ? "Present" : `${convertDates(item.toDate)}`}
                  </Text>
                </View>
              </View>
              <Text style={styles.companyDescription}>{item.description}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PdfExperience;
