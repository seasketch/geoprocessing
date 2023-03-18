import React from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import SizeCard from "../components/SizeCard";
import Translator from "../components/Translator";

const ReportClient = () => {
  return (
    <>
      <SketchAttributesCard autoHide />
      <SizeCard />
    </>
  );
};

export default function () {
  // Translator must be in parent FunctionComponent in order for ReportClient to use useTranslate hook
  return (
    <Translator>
      <ReportClient />
    </Translator>
  );
}
