import React from "react";
import Toolbar from "./Toolbar";
import Card from "./Card";
import SimpleButton from "./buttons/SimpleButton";
import ReportDecorator from "./storybook/ReportDecorator";
import DataDownloadToolbar from "./DataDownloadToolbar";
import fixtures from "../testing/fixtures";

export default {
  component: Toolbar,
  title: "Components/Toolbar",
  decorators: [ReportDecorator],
};

export const headerToolbar = () => (
  <Card>
    <Toolbar variant="dense" useGutters={false}>
      <h2 style={{ flexGrow: 1 }}>Toolbar Title</h2>
      <div>
        <SimpleButton>⬇</SimpleButton>
        <SimpleButton>➥</SimpleButton>
      </div>
    </Toolbar>
    <p>Body</p>
  </Card>
);

export const regularGutterToolbar = () => (
  <Card>
    <Toolbar titleAlign="center" style={{ backgroundColor: "#eee" }}>
      <h2 style={{ flexGrow: 1 }}>Header Toolbar</h2>
      <div>
        <SimpleButton>⬇</SimpleButton>
        <SimpleButton>➥</SimpleButton>
      </div>
    </Toolbar>
    <p>Body</p>
  </Card>
);

export const denseGutterToolbar = () => (
  <Card title="Card Title">
    <p>Body</p>
    <Toolbar
      variant="dense"
      titleAlign="center"
      style={{ backgroundColor: "#eee" }}
    >
      <h2 style={{ flexGrow: 1 }}>Footer Toolbar</h2>
      <div>
        <SimpleButton>⬇</SimpleButton>
        <SimpleButton>➥</SimpleButton>
      </div>
    </Toolbar>
  </Card>
);

export const dataDownloadToolbar = () => {
  return (
    <Card>
      <DataDownloadToolbar
        title="Data Download Toolbar"
        filename="ranked"
        data={fixtures.ranked}
      />
    </Card>
  );
};
