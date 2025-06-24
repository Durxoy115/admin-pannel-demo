import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Noto Sans",
  src: "/assets/font/NotoSans-Regular.ttf",
});
Font.register({
  family: "Noto Sans",
  src: "/assets/font/NotoSans-Bold.ttf",
});
Font.register({
  family: "Noto Sans",
  src: "/assets/font/NotoSans_SemiCondensed-SemiBold.ttf",
});
Font.register({
  family: "Noto Sans Bengali",
  src: "/assets/font/NotoSansBengali-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 20,
    backgroundColor: "#ffffff",
    fontFamily: "Noto Sans",
  },
  upperSection: {
    border: "1px solid #000",
    padding: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flexGrow: 1,
  },
  logo: {
    width: 50,
    height: 20,
  },
  employeeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailSection: {
    flexDirection: "column",
  },
  labelValue: {
    display: "inline",
    marginRight: 5,
  },
  label: {
    fontWeight: "semibold",
    display: "inline",
  },
  value: {
    display: "inline",
    marginRight: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  tableCell: {
    width: "25%",
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableHeaderCell: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  lastCol: {
    borderRightWidth: 0,
  },
  totalRow: {
    fontWeight: "bold",
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  footerText: {
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
    fontSize: 8,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  dottedLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "dashed",
    width: 80,
  },
  signature: {
    textAlign: "center",
    marginLeft: 15,
    fontSize: 8,
  },
});

const TaxPDF = ({ data }) => {
    if (!data) return null; // Safety check
  

  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* ... header and logo */}
          <View style={styles.header}>
            <Text style={styles.title}>Income Tax Calculation</Text>
            <Image style={styles.logo} src="/assets/Images/Images-nav/logo-image.jpeg" />
          </View>
  
          <View style={styles.upperSection}>
            <View style={styles.employeeDetails}>
              <View style={styles.detailSection}>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>Employee Name:</Text> {data.employee_name}
                </Text>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>Employee ID:</Text> {data.employees_id}
                </Text>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>Designation:</Text> {data.job_title}
                </Text>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>Bank Name:</Text> {data.bank_name}
                </Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>Joining Date:</Text> {data.joining_date}
                </Text>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>E-TIN:</Text> {data.e_tin}
                </Text>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>Currency:</Text> {data.currency_title}
                </Text>
                <Text style={styles.labelValue}>
                  <Text style={styles.label}>Salary:</Text>  {data.gross_salary}
                </Text>
              </View>
            </View>
          </View>
  
          {/* Income Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Income Head</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Total Income</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Less Exemption</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.lastCol]}>Taxable Income</Text>
            </View>
            {data.tax_table.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{row.income_head}</Text>
                <Text style={styles.tableCell}>{row.total_income.toFixed(2)}</Text>
                <Text style={styles.tableCell}> {row.less_exemptions.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.lastCol]}> {row.taxable_income.toFixed(2)}</Text>
              </View>
            ))}
          </View>
  
          {/* Tax Rate Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Rate</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Parameter</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Taxable Income</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.lastCol]}>Tax Liability</Text>
            </View>
            {data.tax_rate_table.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {typeof row.range_per === "string" ? row.range_per : `${row.range_per}%`}
                </Text>
                <Text style={styles.tableCell}>{row.parameter}</Text>
                <Text style={styles.tableCell}> {Number(row.taxable_income).toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.lastCol]}> {Number(row.individual_tax_liability).toFixed(2)}</Text>
              </View>
              
            ))}
          </View>
          {/* Annual Taxable Income Table */}
<View style={styles.table}>
  <View style={styles.tableRow}>
    <Text style={[styles.tableCell, styles.tableHeaderCell]}>Annual Taxable Income</Text>
    <Text style={[styles.tableCell, styles.tableHeaderCell, styles.lastCol]}>Amount </Text>
  </View>
  <View style={styles.tableRow}>
    <Text style={styles.tableCell}>25% of Annual Tax Table Income</Text>
    <Text style={[styles.tableCell, styles.lastCol]}>
      {Number(data.annoual_taxable_income).toFixed(2)}
    </Text>
  </View>
</View>

  
          <Text style={styles.footerText}>
            Tax calculation information is confidential. Sharing is prohibited and may result in disciplinary action.
          </Text>
  
          <View style={styles.footer}>
            <View>
              
              <Text style={styles.signature}></Text>
            </View>
            <View>
              <View style={styles.dottedLine} />
              <Text style={styles.signature}>H.R. Department</Text>
            </View>
            
          </View>
        </Page>
      </Document>
    );
  };
  
  export default TaxPDF;
  

