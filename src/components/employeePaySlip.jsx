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
    borderRightWidth: 0, // Remove right border for last column to avoid double border
  },
  totalRow: {
    fontWeight: "bold",
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  netPayWrapper: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  netPayRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
  },
  netPayCell: {
    padding: 5,
    borderLeftWidth: 1,
    borderColor: "#000",
  },
  netPayLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  netPayValue: {
    fontWeight: "bold",
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
    marginLeft:15,
    fontSize: 8,
  },
});

const EmployeePaySlip = ({ data }) => {
  const {
    employees_id,
    job_title,
    employee_name,
    joining_date,
    bank_account_number,
    date,
    gross_salary,
    earnings,
    deductions,
    earnings_total,
    deductions_total,
    total_payable,
    e_tin,
    bank_name,
  } = data;

  // Format date to match "DD MMM YYYY"
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Pay slip for salary of {formattedDate}
          </Text>
          <Image
            style={styles.logo}
            src="/assets/Images/Images-nav/logo-image.jpeg"
          />
        </View>
        <View style={styles.upperSection}>
          <View style={styles.employeeDetails}>
            <View style={styles.detailSection}>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Employee ID:</Text> {employees_id}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Employee Name:</Text> {employee_name}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Designation:</Text> {job_title}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Department:</Text>
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Payment Mode:</Text> Bank
              </Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Basic Salary:</Text> {gross_salary}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Joining Date:</Text> {joining_date}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Account No:</Text>{" "}
                {bank_account_number}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>E-TIN:</Text> {e_tin}
              </Text>
              <Text style={styles.labelValue}>
                <Text style={styles.label}>Bank Name:</Text> {bank_name}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>
              Earning
            </Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>
              Amount in BDT
            </Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>
              Deductions
            </Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.lastCol]}>
              Amount in BDT
            </Text>
          </View>

          {/* Dynamic Rows */}
          {Array.from({
            length: Math.max(earnings.length, deductions.length),
          }).map((_, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {earnings[index]?.title ?? "-"}
              </Text>
              <Text style={styles.tableCell}>
                {earnings[index]
                  ? parseFloat(earnings[index].amount).toFixed(2)
                  : "-"}
              </Text>
              <Text style={styles.tableCell}>
                {deductions[index]?.title ?? "-"}
              </Text>
              <Text style={[styles.tableCell, styles.lastCol]}>
                {deductions[index]
                  ? parseFloat(deductions[index].amount).toFixed(2)
                  : "-"}
              </Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.tableCell}>Total Earning</Text>
            <Text style={styles.tableCell}>
              {parseFloat(earnings_total).toFixed(2)}
            </Text>
            <Text style={styles.tableCell}>Total Deduction</Text>
            <Text style={[styles.tableCell, styles.lastCol]}>
              {parseFloat(deductions_total).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.netPayWrapper}>
          <View style={styles.netPayRow}>
            <View style={styles.netPayCell}>
              <Text style={styles.netPayLabel}>Net Pay</Text>
            </View>
            <View style={styles.netPayCell}>
              <Text style={styles.netPayValue}>
                {parseFloat(total_payable).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          Salary information is strictly confidential. Sharing of such
          information will be breach of company rules and will result into
          disciplinary action.
        </Text>

        <View style={styles.footer}>
          <View>
            <View style={styles.dottedLine} />
            <Text style={styles.signature}>Received</Text>
          </View>
          <View>
            <View style={styles.dottedLine} />
            <Text style={styles.signature}>Authorized</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default EmployeePaySlip;