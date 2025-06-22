// YearlyExpensePDF.jsx
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

// ✅ Import the custom fonts
// import NotoSans from "../../public/assets/font/NotoSans-Regular.ttf";
// import NotoSansBengali from "../../public/assets/font/NotoSansBengali-Regular.ttf";

// ✅ Register the font (no symbols font)
Font.register({
  family: "Noto Sans",
  src: "/assets/font/NotoSans-Regular.ttf",
});
Font.register({
  family: "Noto Sans",
  src: "/assets/font/NotoSans-Bold.ttf",
});
Font.register({
  family: "Noto Sans Bengali",
  src: "/assets/font/NotoSansBengali-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    padding: 20,
    backgroundColor: "#ffffff",
    fontFamily: "Noto Sans",
  },
  header: {
    color: "black",
    padding: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    textAlign: "left",
    marginVertical: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  taka: {
    fontFamily: "Noto Sans Bengali",
    fontSize: 10,
    color: "black",
    flex: 1,
    paddingHorizontal: 3,
  },
  currency: {
    fontFamily: "Noto Sans",
    fontSize: 10,
    color: "black",
    flex: 1,
    paddingHorizontal: 3,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    flex: 1,
    paddingHorizontal: 3,
    fontFamily: "Noto Sans",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dottedLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "dashed",
    width: 100,
    marginBottom: 5,
  },
  logo: {
    width: 50,
    height: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    width: 200,
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  
  totalLabel: {
    fontWeight: "bold",
    fontFamily: "Noto Sans",
  },
  
  totalValue: {
    fontWeight: "bold",
    fontFamily: "Noto Sans",
  },
  
  totalValueTaka: {
    fontWeight: "bold",
    fontFamily: "Noto Sans Bengali",
  },
  
});

const myPDFDocument = ({
  data,
  heading,
  value,
  title,
  useCurrency,
  showTotalAmount,
}) => {
  console.log("showTotalAmount:", showTotalAmount);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Image
            style={styles.logo}
            src="/assets/Images/Images-nav/logo-image.jpeg"
          />
        </View>

        {/* Table Headers */}
        <View style={styles.tableHeader}>
          {heading.map((head, index) => (
            <Text style={styles.cell} key={index}>
              {head}
            </Text>
          ))}
        </View>

        {/* Table Rows */}
        {data && data.length > 0 ? (
          data.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              {value.map((val, idx) => (
                <Text style={styles.cell} key={idx}>
                  {useCurrency.includes(val) && row.currency_sign ? (
                    <>
                      <Text
                        style={
                          row.currency_sign === "৳"
                            ? styles.taka
                            : styles.currency
                        }
                      >
                        {row.currency_sign}{" "}
                      </Text>
                      <Text>{row[val]}</Text>
                    </>
                  ) : (
                    String(row[val] ?? "N/A")
                  )}
                </Text>
              ))}
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 10, textAlign: "center" }}>
            No data available
          </Text>
        )}
{showTotalAmount &&
  Object.keys(showTotalAmount).some((key) => key !== "currency_sign") && (
    <View style={{ marginTop: 20 }}>
      {Object.entries(showTotalAmount).map(([key, value], index) => {
        if (key === "currency_sign") return null;

        const isTaka = showTotalAmount["currency_sign"] === "৳";

        return (
          <View key={index} style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {key.replace("_", " ")}:
            </Text>
            <Text style={isTaka ? styles.totalValueTaka : styles.totalValue}>
              {showTotalAmount["currency_sign"]}
              {typeof value === "number"
                ? value.toFixed(2)
                : parseFloat(value || 0).toFixed(2)}
            </Text>
          </View>
        );
      })}
    </View>
  )}





        {/* Footer Signatures */}
        <View style={styles.footer}>
          <View>
            <View style={styles.dottedLine} />
            <Text>Received</Text>
          </View>
          <View>
            <View style={styles.dottedLine} />
            <Text>Authorized</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default myPDFDocument;
