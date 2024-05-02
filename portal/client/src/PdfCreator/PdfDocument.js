import { Page, View, Document, StyleSheet } from "@react-pdf/renderer";
import PdfHeader from "./PdfHeader";
import PdfCover from "./PdfCover";
import PdfSkills from "./PdfSkills";
import PdfExperience from "./PdfExperience";
import PdfEducation from "./PdfEducation";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: "50px",
  },
  sectionBody: {
    display: "flex",
    flexDirection: "column",
    rowGap: "20px",
    marginTop: "20px",
  },
});

// Create Document Component

const PdfDocument = (props) => {

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfHeader data={props.data} />
        <View style={styles.sectionBody}>
          <PdfCover data={props.data}/>
          <PdfSkills data={props.data}/>
          <PdfExperience data={props.data} />
          <PdfEducation data={props.data} />
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;
