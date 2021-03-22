import React from "react";
import Toolbar from "./Toolbar";
import Card from "./Card";
import SimpleButton from "./buttons/SimpleButton";
import ReportDecorator from "./ReportDecorator";
import "./Toolbar.stories.css";

export default {
  component: Toolbar,
  title: "Components|Toolbar",
  decorators: [ReportDecorator],
};

export const headerToolbar = () => (
  <Card>
    <Toolbar
      variant="dense"
      useGutters={false}
      toolbarCls="gp-toolbar-no-gutter"
    >
      <h2>Toolbar Title</h2>
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
    <Toolbar toolbarCls="gp-toolbar-example">
      <h2>Header Toolbar</h2>
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
    <Toolbar variant="dense" toolbarCls="gp-toolbar-example">
      <h2>Footer Toolbar</h2>
      <div>
        <SimpleButton>⬇</SimpleButton>
        <SimpleButton>➥</SimpleButton>
      </div>
    </Toolbar>
  </Card>
);
