import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  educationColumn: {
    flexDirection: "column",
  },
  title: {
    fontSize: "18px",
    borderBottom: "1px solid black",
    paddingBottom: "5px",
    marginBottom: "10px",
  },
  educationItem: {
    marginBottom: "5px",
    borderBottom: "1px solid gray",
    paddingBottom: "5px",
  },
  collageName: {
    fontSize: "16px",
    fontWeight: "800",
    marginBottom: "5px",
  },
  collageLocation: {
    fontSize: "12px",
  },
  collageDescription: {
    fontSize: "10px",
  },
  collageDates: {
    fontSize: "10px",
  },
  topSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  collageColumn: {
    display: "flex",
    flexDirection: "column",
    columnGap: 5,
  },
  datesColumn: {
    display: "flex",
    flexDirection: "row",
    columnGap: 5,
  },
  collageDescription: {
    marginTop: "10px",
    fontSize: "10px",
  },
});

const PdfEducation = (props) => {
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

      return JSON.stringify(formattedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.educationColumn}>
        <Text style={styles.title}>Education</Text>
      </View>
      {props.data.formData.noEducation ? (
        <View>
          <Text style={styles.collageDescription}>No Formal Schooling Attended</Text>
        </View>
      ) : (
        <View>
          {props.data.formData.education.map((item, index) => {
            return (
              <View style={styles.educationItem} key={index}>
                <View style={styles.topSection}>
                  <View style={styles.collageColumn}>
                    <Text style={styles.collageName}>{item.collageUniversity}</Text>
                    <Text style={styles.collageLocation}>{item.educationTitle}</Text>
                  </View>
                  <View style={styles.datesColumn}>
                  
                      <Text style={styles.collageDates}>
                        {item.toDate === "Present" ? `Currently studying there` : `Year of graduation: ${convertDates(item.toDate.$d)}`}
                      </Text>
                   
                  </View>
                </View>
                <Text style={styles.collageDescription}>{item.description}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default PdfEducation;
