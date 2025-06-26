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
  halfCell: {
    width: "25%",
    padding: 5,
    fontSize: 10,
    
  },
  halfCellLast: {
    width: "75%",
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  borderTopRow: {
    borderTopWidth: 1,
    borderTopColor: "#000",
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
    fontWeight: "semibold",
    borderTopWidth: 1,
    borderTopColor: "#000",
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
    marginTop: 45,
    bottom: 20,
    left: 20,
    right: 20,
  },
  dottedLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "dashed",
    width: 80,
    marginRight: 20,
  },
  signature: {
    textAlign: "center",
    marginLeft: 15,
    fontSize: 8,
    marginRight: 25,
  },
});

const TaxPDF = ({ data }) => {
  if (!data) return null; // Safety check

  console.log("data-----", data);

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
                <Text style={styles.label}>Location:</Text> Head Office
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
                <Text style={styles.label}>Income Year:</Text> {data.income_year}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Assessment Year:</Text> {data.assessment_year}
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
            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.lastCol]}>Total Taxable Income</Text>
          </View>
          {data.tax_table.map((row, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index === data.tax_table.length - 1 ? styles.totalRow : {},
              ]}
            >
              <Text style={styles.tableCell}>{row.income_head}</Text>
              <Text style={styles.tableCell}>{row.total_income.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{row.less_exemptions.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.lastCol]}>{row.taxable_income.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Tax Rate Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Income Tax Rate</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Parameter</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Taxable Income</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.lastCol]}>Individual Tax Liability</Text>
          </View>
          {data.tax_rate_table.map((row, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index === data.tax_rate_table.length - 1 ? styles.totalRow : {},
              ]}
            >
              <Text style={styles.tableCell}>
                {typeof row.range_per === "string" ? row.range_per : `${row.range_per}%`}
              </Text>
              <Text style={styles.tableCell}>{row.parameter}</Text>
              <Text style={styles.tableCell}>{Number(row.taxable_income).toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.lastCol]}>{Number(row.individual_tax_liability).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Annual Taxable Income Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.halfCellLast, styles.tableHeaderCell]}>Tax Rebate for Investment</Text>
            <Text style={[styles.halfCell, styles.tableHeaderCell]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.halfCellLast}>25% of Annual Taxable Income</Text>
            <Text style={styles.halfCell}>
              {Number(data.annoual_taxable_income).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.halfCellLast}>Maximum Investment Allower</Text>
            <Text style={styles.halfCell}>1500000.00</Text>
          </View>
        </View>

        <View style={styles.table}>
        <View style={styles.tableRow}>
            <Text style={styles.halfCellLast}>Tax Rebate on Investment</Text>
            <Text style={styles.halfCell}>0.00</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.halfCellLast}>Net Tax Payable After Rebate</Text>
            <Text style={styles.halfCell}>
              {Number(data.total_tax).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.halfCellLast}>Total Tax Payable To Government</Text>
            <Text style={styles.halfCell}>{Number(data.total_tax).toFixed(2)}</Text>
          </View>
        </View>

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