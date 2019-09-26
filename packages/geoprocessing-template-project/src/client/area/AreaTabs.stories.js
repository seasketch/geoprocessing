import React from "react";
import { storiesOf } from "@storybook/react";
import AreaTab from "./AreaTab";
import { ReportDecorator } from "@seasketch/geoprocessing-client";

storiesOf("Zone Area", module)
  .addDecorator(ReportDecorator)
  .add("Campus Point", () => (
    <AreaTab
      serviceResults={{
        area: {
          areaKm: 25123
        }
      }}
    />
  ));
