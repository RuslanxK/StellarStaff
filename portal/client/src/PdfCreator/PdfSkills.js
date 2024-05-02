import { Text, View, StyleSheet } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  skillsColumn: {
    flexDirection: "column",
  },
  title: {
    fontSize: "18px",
    borderBottom: "1px solid black",
    paddingBottom: "5px",
    marginBottom: "5px"
  },
  skillItem: {
    fontSize: "10px",
    marginBottom: '5px'
  },
});

const PdfSkills = (props) => {

  return (
    <View style={styles.container}>
      <View style={styles.skillsColumn}>
        <Text style={styles.title}>Skills</Text>
      </View>
      <View>
        {props.data.formData.skills.map((item, index) => {
          return (
          <Text style={styles.skillItem} key={index}>
            - {item}
          </Text>
          )
        })}
      </View>
    </View>
  );
};

export default PdfSkills;
