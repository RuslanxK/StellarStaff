import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PdfDocument from "../PdfCreator/PdfDocument";
import { useSelector } from "react-redux";

const Test = () => {
  const storeData = useSelector((state) => state.app);

  return (
    <PDFViewer height="1080">
      <PdfDocument data={storeData} />
    </PDFViewer>
  );
};

export default Test;
