import React from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Simplified Developer Experience",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Create reports for your SeaSketch project with a combination of software
        building blocks.
      </>
    ),
  },
  {
    title: "Low cost",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Write bite-size serverless functions that analyze user sketches
        on-demand. Build reports to display the results.
      </>
    ),
  },
  {
    title: "Cloud Native",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Automated deploy to AWS and conversion of data to cloud-optimized
        formats.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
