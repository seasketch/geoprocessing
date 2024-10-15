"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[306],{2005:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var i=n(4848),r=n(8453);const o={slug:"/extending"},s=void 0,a={id:"Extending",title:"Extending",description:"It is possible to extend the geoprocessing framework to meet your needs right in your project code space. Here are some common use cases.",source:"@site/docs/Extending.md",sourceDirName:".",slug:"/extending",permalink:"/geoprocessing/docs/extending",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/Extending.md",tags:[],version:"current",frontMatter:{slug:"/extending"},sidebar:"tutorialSidebar",previous:{title:"Migration Guide",permalink:"/geoprocessing/docs/Migrating"},next:{title:"Tips and Tricks",permalink:"/geoprocessing/docs/tipsandtricks"}},c={},d=[{value:"I need to do additional data preparation before data import",id:"i-need-to-do-additional-data-preparation-before-data-import",level:2},{value:"I need to change the data import scripts",id:"i-need-to-change-the-data-import-scripts",level:2},{value:"I need my own data import",id:"i-need-my-own-data-import",level:2},{value:"I need to extend the base types or code",id:"i-need-to-extend-the-base-types-or-code",level:2},{value:"I need to print my reports / save reports to PDF",id:"i-need-to-print-my-reports--save-reports-to-pdf",level:2},{value:"Expanding collapsed dropdowns when printing",id:"expanding-collapsed-dropdowns-when-printing",level:3},{value:"Additional printing configuration",id:"additional-printing-configuration",level:3}];function l(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.p,{children:"It is possible to extend the geoprocessing framework to meet your needs right in your project code space. Here are some common use cases."}),"\n",(0,i.jsx)(t.h2,{id:"i-need-to-do-additional-data-preparation-before-data-import",children:"I need to do additional data preparation before data import"}),"\n",(0,i.jsxs)(t.p,{children:["Maybe you need to copy data in from over the Internet or write a script that transforms a dataset further before being ready to be imported. Here's a couple of options that keeps your code to do this right in the ",(0,i.jsx)(t.code,{children:"data"})," directory."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["Write a standalone Typescript script that ",(0,i.jsx)(t.a,{href:"https://github.com/mcclintock-lab/maldives-reports/blob/main/data/ous-demographic-data-sort.ts",children:"sorts a dataset"}),". Can be run from the root project directory with ",(0,i.jsx)(t.code,{children:"npm run ts-node data/ous-demographic-data-sort.ts"})]}),"\n",(0,i.jsxs)(t.li,{children:["Write a more complex Typescript script that uses Turf geoprocessing functions like ",(0,i.jsx)(t.a,{href:"https://github.com/mcclintock-lab/maldives-reports/blob/main/data/ous-demographic.ts",children:"this proof of concept"})]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"i-need-to-change-the-data-import-scripts",children:"I need to change the data import scripts"}),"\n",(0,i.jsxs)(t.p,{children:["Maybe you need to alter the parameters passed to gdal or ogr. Many of the scripts that get run during data import are loaded from your projects ",(0,i.jsx)(t.code,{children:"data/bin"})," directory. You can alter these scripts to meet your needs."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.a,{href:"https://github.com/seasketch/fsm-reports/tree/main/data/bin",children:"Example"})}),"\n",(0,i.jsxs)(t.p,{children:["If you upgrade your geoprocessing library, the files in ",(0,i.jsx)(t.code,{children:"data/bin"})," will get overwritten and you'll need to look at the git code changes and re-merge your changes manually."]}),"\n",(0,i.jsx)(t.h2,{id:"i-need-my-own-data-import",children:"I need my own data import"}),"\n",(0,i.jsxs)(t.p,{children:["If the escape hatches above aren't enough, it is possible to skip the use of ",(0,i.jsx)(t.code,{children:"data:import"})," entirely. Consider reserving this for datasource that you want to import directly into your but it won't be easy."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Write your own script that pre-calculates metrics for your datasource"}),"\n",(0,i.jsxs)(t.li,{children:["Amend ",(0,i.jsx)(t.code,{children:"project/projectClient.ts"})," to side-load your own custom datasource record and merge it with what is loaded from ",(0,i.jsx)(t.code,{children:"datasources.json"})]}),"\n",(0,i.jsxs)(t.li,{children:["You may The benefit of it is that it creates a datasource record in ",(0,i.jsx)(t.code,{children:"project/datasources.json"})," which can then be referenced in ",(0,i.jsx)(t.code,{children:"project/metrics.json"}),". These are read in by the ",(0,i.jsx)(t.code,{children:"ProjectClient"})," in ",(0,i.jsx)(t.code,{children:"project/projectClient.ts"}),", which is used by your functions and UI clients. To do this you can edit ",(0,i.jsx)(t.code,{children:"projectClient.ts"})," to add your own custom datasources outside of the ",(0,i.jsx)(t.code,{children:"datasources.json"})," file and merge them in. It's up to you to pre-calculate datasource metrics, and structure them properly if you still want to be able to run ",(0,i.jsx)(t.code,{children:"data:publish"})]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"i-need-to-extend-the-base-types-or-code",children:"I need to extend the base types or code"}),"\n",(0,i.jsxs)(t.p,{children:["Most things exported via the ",(0,i.jsx)(t.code,{children:"client-core"})," and ",(0,i.jsx)(t.code,{children:"client-ui"})," modules can be extended in ",(0,i.jsx)(t.code,{children:"project-space"}),", whether it's UI components, base types/schemas, or utility functions. Here are some examples to get you started."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["The ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/tree/dev/packages/geoprocessing/src/rbcs",children:"rbcs"})," module is a great example of extending all of these to create things specific to use of the ",(0,i.jsx)(t.code,{children:"regulation-based classification system"}),"."]}),"\n",(0,i.jsxs)(t.li,{children:["The ClassTable component is an extension of the base",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/Table.tsx",children:"Table"})," component, capable of displaying metrics for one or more classes of data. And you can layer this multiple levels deep as the ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/SketchClassTable.tsx",children:"SketchClassTable"})," component is an extension of the ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/table/ClassTable.tsx",children:"ClassTable"})," component, capable of displaying metrics for all classes, for a SketchCollection with one or more sketches."]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"i-need-to-print-my-reports--save-reports-to-pdf",children:"I need to print my reports / save reports to PDF"}),"\n",(0,i.jsxs)(t.p,{children:["Enabling printing of reports involves adding a state variable ",(0,i.jsx)(t.code,{children:"isPrinting"})," which edits the UI so all our React elements are visible for the print dialog."]}),"\n",(0,i.jsxs)(t.p,{children:["To begin, download and add ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/util/Print.tsx",children:"Print.tsx"})," to your ",(0,i.jsx)(t.code,{children:"src/util"})," directory. This file contains much of the code you'll need to set up printing."]}),"\n",(0,i.jsxs)(t.p,{children:["To include a small map overview of your sketch in your printed reports, you'll also need to download ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/components/PrintMap.tsx",children:"PrintMap.tsx"})," to your ",(0,i.jsx)(t.code,{children:"src/components"})," directory, and ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/functions/printMap.ts",children:"printMap.ts"})," and it's test file ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/fsm-nearshore-reports/blob/main/src/functions/printMapSmoke.test.ts",children:"printMapSmoke.test.ts"})," to your ",(0,i.jsx)(t.code,{children:"src/functions"})," directory."]}),"\n",(0,i.jsxs)(t.p,{children:["Run the following to install ",(0,i.jsx)(t.code,{children:"react-to-print"}),":"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-bash",children:"npm install react-to-print\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Open ",(0,i.jsx)(t.code,{children:"MpaTabReport.tsx"}),". Start by importing the components we'll need:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:'import { useReactToPrint } from "react-to-print";\nimport { PrintButton, PrintPopup, SketchAttributes } from "../util/Print";\nimport React, { useState, useRef, useEffect } from "react";\n'})}),"\n",(0,i.jsxs)(t.p,{children:["Next, we need add the following code in the MpaTabReport component. ",(0,i.jsx)(t.code,{children:"printRef"})," will reference the component we wish to print, and ",(0,i.jsx)(t.code,{children:"isPrinting"})," will reflect whether our print button was pressed and the component should display a print state. The ",(0,i.jsx)(t.code,{children:"useEffect"})," hook waits to ",(0,i.jsx)(t.code,{children:"isPrinting"})," to become true, and if so it disables animations on the page and runs the ",(0,i.jsx)(t.code,{children:"handlePrint"})," command. In ",(0,i.jsx)(t.code,{children:"handlePrint"})," we call ",(0,i.jsx)(t.code,{children:"useReactToPrint"})," to print the component."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:'// Printing\nconst printRef = useRef(null);\nconst [isPrinting, setIsPrinting] = useState(false);\nconst [attributes] = useSketchProperties();\n// Original animation durations saved during printing\nconst originalAnimationDurations: string[] = [\n  ...document.querySelectorAll(".chart"),\n].map((el) => (el as HTMLElement).style.animationDuration);\n\nuseEffect(() => {\n  // When printing, animations are disabled and the page is printed\n  if (isPrinting) {\n    [...document.querySelectorAll(".chart")].forEach(\n      (el) => ((el as HTMLElement).style.animationDuration = "0s")\n    );\n    handlePrint();\n  }\n  // Return animation duration to normal after printing\n  return () => {\n    [...document.querySelectorAll(".chart")].forEach(\n      (el, index) =>\n        ((el as HTMLElement).style.animationDuration =\n          originalAnimationDurations[index])\n    );\n  };\n}, [isPrinting]);\n\n// Print function\nconst handlePrint = useReactToPrint({\n  content: () => printRef.current,\n  documentTitle: attributes.name,\n  onBeforeGetContent: () => {},\n  onAfterPrint: () => setIsPrinting(false),\n});\n'})}),"\n",(0,i.jsx)(t.p,{children:"Now that we've configured what elements to print, we need to add a print button in the returned component, which will trigger the print dialog when clicked:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"<div\n  onClick={() => {\n    setIsPrinting(true);\n  }}\n>\n  <PrintButton />\n</div>;\n{\n  isPrinting && <PrintPopup />;\n}\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Finally, we need to attach ",(0,i.jsx)(t.code,{children:"printRef"})," to our reports component. We also want to set all report pages to appear when ",(0,i.jsx)(t.code,{children:"isPrinting"})," is true."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:'<div\n  ref={printRef}\n  style={{ backgroundColor: isPrinting ? "#FFF" : "inherit" }}\n>\n  <div style={{ display: isPrinting ? "block" : "none" }}>\n    <SketchAttributes {...attributes} />\n  </div>\n  <ReportPage hidden={!isPrinting && tab !== viabilityId}>\n    <ViabilityPage />\n  </ReportPage>\n  <ReportPage hidden={!isPrinting && tab !== representationId}>\n    <RepresentationPage />\n  </ReportPage>\n</div>\n'})}),"\n",(0,i.jsx)(t.p,{children:"Printing is now set up for your reports. Additional printing edits may be added and are described below."}),"\n",(0,i.jsx)(t.h3,{id:"expanding-collapsed-dropdowns-when-printing",children:"Expanding collapsed dropdowns when printing"}),"\n",(0,i.jsxs)(t.p,{children:["Many reports contain drop downs with additional data, such as ",(0,i.jsx)(t.code,{children:"Show By MPA"}),", ",(0,i.jsx)(t.code,{children:"Show by Zone"}),", or ",(0,i.jsx)(t.code,{children:"Learn More"})," dropdowns. To configure reports to open the dropdowns when ",(0,i.jsx)(t.code,{children:"isPrinting"})," is true, follow these instructions."]}),"\n",(0,i.jsxs)(t.p,{children:["First, in ",(0,i.jsx)(t.code,{children:"MpaTabReport.tsx"}),", pass ",(0,i.jsx)(t.code,{children:"isPrinting"})," to all report pages:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"<ViabilityPage printing={isPrinting} />\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Then, within ",(0,i.jsx)(t.code,{children:"ViabilityPage.tsx"}),", pass ",(0,i.jsx)(t.code,{children:"props.printing"})," into each report:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:"<SizeCard printing={props.printing} />\n"})}),"\n",(0,i.jsxs)(t.p,{children:["Finally, within ",(0,i.jsx)(t.code,{children:"SizeCard.tsx"}),", edit the ",(0,i.jsx)(t.code,{children:"Collapse"})," object:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",children:'{\n  isCollection && (\n    <Collapse\n      title={t("Show by MPA")}\n      collapsed={!props.printing}\n      key={String(props.printing) + "MPA"}\n    >\n      {genNetworkSizeTable(data, precalcMetrics, metricGroup, t)}\n    </Collapse>\n  );\n}\n'})}),"\n",(0,i.jsx)(t.h3,{id:"additional-printing-configuration",children:"Additional printing configuration"}),"\n",(0,i.jsxs)(t.p,{children:["Depending on your report design, more edits may have to be made so your reports can print clearly. Some examples include handling horizontal scroll objects and pagination. See ",(0,i.jsx)(t.a,{href:"https://github.com/seasketch/fsm-nearshore-reports/tree/main",children:"fsm-nearshore-reports"})," for examples in handling those particulars."]})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>a});var i=n(6540);const r={},o=i.createContext(r);function s(e){const t=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),i.createElement(o.Provider,{value:t},e.children)}}}]);