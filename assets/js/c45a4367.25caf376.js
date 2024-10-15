"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[99458],{93211:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>d,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var n=s(74848),i=s(28453);const o={slug:"/architecture"},r=void 0,a={id:"architecture/Architecture",title:"Architecture",description:"Library",source:"@site/versioned_docs/version-6.1.0/architecture/Architecture.md",sourceDirName:"architecture",slug:"/architecture",permalink:"/geoprocessing/docs/architecture",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/versioned_docs/version-6.1.0/architecture/Architecture.md",tags:[],version:"6.1.0",frontMatter:{slug:"/architecture"},sidebar:"tutorialSidebar",previous:{title:"Extending",permalink:"/geoprocessing/docs/extending"},next:{title:"Antimeridian",permalink:"/geoprocessing/docs/antimeridian"}},c={},l=[{value:"Library",id:"library",level:2},{value:"Published Project",id:"published-project",level:2},{value:"1. Registering with SeaSketch",id:"1-registering-with-seasketch",level:3},{value:"2. Preprocessing User Sketches",id:"2-preprocessing-user-sketches",level:3},{value:"3. Loading Reports Via iFrame",id:"3-loading-reports-via-iframe",level:3},{value:"4. Report Client",id:"4-report-client",level:3},{value:"5. useFunction Hook",id:"5-usefunction-hook",level:3},{value:"6. Geoprocessing Handler",id:"6-geoprocessing-handler",level:3},{value:"Sync",id:"sync",level:4},{value:"Async",id:"async",level:4},{value:"7. Geoprocessing Functions",id:"7-geoprocessing-functions",level:3}];function h(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h2,{id:"library",children:"Library"}),"\n",(0,n.jsxs)(t.p,{children:["The geoprocessing library is modeled after ",(0,n.jsx)(t.a,{href:"https://github.com/facebook/create-react-app",children:"create-react-app"})," in that it allows a new project to be generated with a single command."]}),"\n",(0,n.jsxs)(t.p,{children:["It publishes a CLI (command line interface) via the ",(0,n.jsx)(t.code,{children:"geoprocessing"})," command ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/package.json#L45",children:"registered"}),", which runs the accompanying ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/scripts/geoprocessing.ts",children:"script"}),", which publishes all of the CLI commands."]}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/scripts/init/init.ts",children:"init"})," command is runnable using ",(0,n.jsx)(t.code,{children:"npx"})," without installing the geoprocessing library (see Tutorials). The init command ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/scripts/init/createProject.ts",children:"creates a new project"})," using the ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/tree/dev/packages",children:"base-project"})," as a template followed by merging in one of the available ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/tree/dev/packages",children:"templates"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["The new generated project takes the geoprocessing library as a dependency, allowing the projects report clients access to the ",(0,n.jsx)(t.code,{children:"gp-ui"})," module and preprocessing/geoprocessing functions access to the ",(0,n.jsx)(t.code,{children:"gp-core"})," module. This also gives the project access to the remaining CLI commands via its ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/base-project/package.json",children:"package.json"}),", including the ability to ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/scripts/build/build.sh",children:"build"})," client and function bundles using ",(0,n.jsx)(t.a,{href:"https://webpack.js.org/",children:"webpack"})," and ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/scripts/deploy/deploy.sh",children:"deploy"})," the project using ",(0,n.jsx)(t.a,{href:"https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-javascript.html",children:"aws-cdk"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"published-project",children:"Published Project"}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"System Model",src:s(42712).A+"",title:"System Model Detailed",width:"1379",height:"1207"})}),"\n",(0,n.jsxs)(t.p,{children:["A published geoprocessing project at its heart is a single monolithic ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/scripts/aws/GeoprocessingStack.ts#L58",children:"GeoprocessingStack"})," created using AWS CloudFormation, with a REST API as its main access point."]}),"\n",(0,n.jsx)(t.h3,{id:"1-registering-with-seasketch",children:"1. Registering with SeaSketch"}),"\n",(0,n.jsx)(t.p,{children:"The root URL of the REST API returns a manifest of all project assets. This includes names, URL's, and configuration for all of the projects report clients, preprocessing functions, and geoprocessing functions."}),"\n",(0,n.jsxs)(t.p,{children:["Example for FSM: ",(0,n.jsx)(t.a,{href:"https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/",children:"https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-json",children:'{\n  "title": "fsm-reports",\n  "author": "Tim-Welch",\n  "apiVersion": "1.1.1-experimental-preprocess.14+7d0938c",\n  "version": "1.0.0",\n  "relatedUri": "https://github.com/seasketch/fsm-reports.git#readme",\n  "sourceUri": "git+https://github.com/seasketch/fsm-reports.git.git",\n  "published": "2023-02-11T03:54:03.297Z",\n  "clients": [\n    {\n      "title": "AllReport",\n      "uri": "https://test.com/AllReport",\n      "bundleSize": 0,\n      "apiVersion": "",\n      "tabs": []\n    }\n  ],\n  "feedbackClients": [],\n  "preprocessingServices": [\n    {\n      "title": "clipToOceanEez",\n      "description": "Erases portion of sketch overlapping with land or extending into ocean outsize EEZ boundary (0-200nm)",\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/clipToOceanEez",\n      "requiresProperties": []\n    },\n    {\n      "title": "clipToOceanOffshore",\n      "description": "Erases portion of sketch falling outside of offshore boundary (12-200nm)",\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/clipToOceanOffshore",\n      "requiresProperties": []\n    },\n    {\n      "title": "clipToOceanNearshore",\n      "description": "Erases portion of sketch falling outside of nearshore boundary (0-12nm)",\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/clipToOceanNearshore",\n      "requiresProperties": []\n    },\n    {\n      "title": "clipToOceanContiguous",\n      "description": "Erases portion of sketch overlapping with contiguous zone (12-24 nautical miles)",\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/clipToOceanContiguous",\n      "requiresProperties": []\n    },\n    {\n      "title": "clipToOceanOuterOffshore",\n      "description": "Erases portion of sketch falling outside of outer offshore boundary (24-200nm)",\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/clipToOceanOuterOffshore",\n      "requiresProperties": []\n    }\n  ],\n  "geoprocessingServices": [\n    {\n      "memory": 10240,\n      "title": "boundaryAreaOverlap",\n      "description": "Calculate sketch overlap with boundary polygons",\n      "executionMode": "async",\n      "timeout": 40,\n      "requiresProperties": [],\n      "handlerFilename": "boundaryAreaOverlap.ts",\n      "vectorDataSources": [],\n      "rateLimited": false,\n      "rateLimit": 0,\n      "rateLimitPeriod": "daily",\n      "rateLimitConsumed": 0,\n      "medianDuration": 0,\n      "medianCost": 0,\n      "type": "javascript",\n      "issAllowList": ["*"],\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/boundaryAreaOverlap"\n    },\n    {\n      "memory": 10240,\n      "title": "depthZoneValueOverlap",\n      "description": "metrics for sketch overlap with ocean depth zones",\n      "timeout": 120,\n      "executionMode": "async",\n      "requiresProperties": [],\n      "handlerFilename": "depthZoneValueOverlap.ts",\n      "vectorDataSources": [],\n      "rateLimited": false,\n      "rateLimit": 0,\n      "rateLimitPeriod": "daily",\n      "rateLimitConsumed": 0,\n      "medianDuration": 0,\n      "medianCost": 0,\n      "type": "javascript",\n      "issAllowList": ["*"],\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/depthZoneValueOverlap"\n    },\n    {\n      "memory": 10240,\n      "title": "envRegionValueOverlap",\n      "description": "metrics for sketch overlap with ocean depth zones",\n      "timeout": 120,\n      "executionMode": "async",\n      "requiresProperties": [],\n      "handlerFilename": "envRegionValueOverlap.ts",\n      "vectorDataSources": [],\n      "rateLimited": false,\n      "rateLimit": 0,\n      "rateLimitPeriod": "daily",\n      "rateLimitConsumed": 0,\n      "medianDuration": 0,\n      "medianCost": 0,\n      "type": "javascript",\n      "issAllowList": ["*"],\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/envRegionValueOverlap"\n    },\n    {\n      "memory": 10240,\n      "title": "geomorphValueOverlap",\n      "description": "metrics for sketch overlap with geomorphic features",\n      "timeout": 120,\n      "executionMode": "async",\n      "requiresProperties": [],\n      "handlerFilename": "geomorphValueOverlap.ts",\n      "vectorDataSources": [],\n      "rateLimited": false,\n      "rateLimit": 0,\n      "rateLimitPeriod": "daily",\n      "rateLimitConsumed": 0,\n      "medianDuration": 0,\n      "medianCost": 0,\n      "type": "javascript",\n      "issAllowList": ["*"],\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/geomorphValueOverlap"\n    },\n    {\n      "memory": 10240,\n      "title": "gfwEffortValueOverlap",\n      "description": "metrics for sketch overlap with fishing effort",\n      "timeout": 120,\n      "executionMode": "async",\n      "requiresProperties": [],\n      "handlerFilename": "gfwEffortValueOverlap.ts",\n      "vectorDataSources": [],\n      "rateLimited": false,\n      "rateLimit": 0,\n      "rateLimitPeriod": "daily",\n      "rateLimitConsumed": 0,\n      "medianDuration": 0,\n      "medianCost": 0,\n      "type": "javascript",\n      "issAllowList": ["*"],\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/gfwEffortValueOverlap"\n    },\n    {\n      "memory": 10240,\n      "title": "normaCatchValueOverlap",\n      "description": "metrics for sketch overlap with catch",\n      "timeout": 120,\n      "executionMode": "async",\n      "requiresProperties": [],\n      "handlerFilename": "normaCatchValueOverlap.ts",\n      "vectorDataSources": [],\n      "rateLimited": false,\n      "rateLimit": 0,\n      "rateLimitPeriod": "daily",\n      "rateLimitConsumed": 0,\n      "medianDuration": 0,\n      "medianCost": 0,\n      "type": "javascript",\n      "issAllowList": ["*"],\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/normaCatchValueOverlap"\n    },\n    {\n      "memory": 10240,\n      "title": "benthicSpeciesValueOverlap",\n      "description": "metrics for sketch overlap with ",\n      "timeout": 120,\n      "executionMode": "async",\n      "requiresProperties": [],\n      "handlerFilename": "benthicSpeciesValueOverlap.ts",\n      "vectorDataSources": [],\n      "rateLimited": false,\n      "rateLimit": 0,\n      "rateLimitPeriod": "daily",\n      "rateLimitConsumed": 0,\n      "medianDuration": 0,\n      "medianCost": 0,\n      "type": "javascript",\n      "issAllowList": ["*"],\n      "endpoint": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/benthicSpeciesValueOverlap"\n    }\n  ],\n  "uri": "https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/",\n  "clientSideBundle": "https://dy0s6wfz2se2a.cloudfront.net?service=https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/"\n}\n'})}),"\n",(0,n.jsxs)(t.p,{children:["SeaSketch allows you to add a preprocessor for your Sketch Class, populating the list from the manifest.\n",(0,n.jsx)(t.img,{alt:"System Model",src:s(66206).A+"",title:"Add Preprocessor",width:"924",height:"1268"})]}),"\n",(0,n.jsxs)(t.p,{children:["SeaSketch also allows you to add a reporting client for your Sketch Class, populating the list from the manifest.\n",(0,n.jsx)(t.img,{alt:"System Model",src:s(51692).A+"",title:"Add Client",width:"927",height:"617"})]}),"\n",(0,n.jsx)(t.h3,{id:"2-preprocessing-user-sketches",children:"2. Preprocessing User Sketches"}),"\n",(0,n.jsx)(t.p,{children:"The SeaSketch platform executes the preprocessing function every time a user finishes drawing their sketch. It typically performs some type of clip operation involving intersection or difference against other features (land, jurisdictional boundaries)"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.img,{alt:"Shape Draw",src:s(85287).A+"",title:"Shape Draw",width:"1860",height:"1030"}),"\nDrawing new sketch"]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.img,{alt:"Preprocessor Success",src:s(35792).A+"",title:"Preprocessor Success",width:"1893",height:"1060"}),"\nPreprocessor successfully removed inner portion of sketch"]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"https://seasketch.github.io/geoprocessing/api/classes/geoprocessing.PreprocessingHandler.html#func",children:"Preprocessing"})," functions are published by a geoprocessing project, and take a GeoJSON Feature or Sketch, validates it, potentially transforms it to make it usable in a planning process, and then returns the result. Common transformations include clipping a sketch to planning boundaries (e.g. EEZ, land, territorial sea)."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.a,{href:"https://github.com/seasketch/fsm-reports/blob/main/src/functions/clipToOceanOffshore.ts",children:"Offshore boundary intersect example"})}),"\n",(0,n.jsxs)(t.p,{children:["Preprocessing funtions are wrapped into a ",(0,n.jsx)(t.a,{href:"https://seasketch.github.io/geoprocessing/api/classes/geoprocessing.PreprocessingHandler.html",children:"PreprocessingHandler"})," on export by the report developer, which allow them to be deployed as Lambda functions, with some additional metadata for integration with SeaSketch (name, description), and a configurable amount of memory and processing power."]}),"\n",(0,n.jsx)(t.h3,{id:"3-loading-reports-via-iframe",children:"3. Loading Reports Via iFrame"}),"\n",(0,n.jsx)(t.p,{children:'When a SeaSketch user clicks to "View Reports" in the core platform for their Sketch or SketchCollection, it opens an iFrame in the sidebar and loads the appropriate report client published by the geoprocessing project. Reports are run inside a sandboxed iframe to isolate the two environments in order to protect user data.'}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.img,{alt:"View Report",src:s(71537).A+"",title:"View Report",width:"2000",height:"1380"}),"\nViewing sketch report"]}),"\n",(0,n.jsxs)(t.p,{children:["To do this, the SeaSketch platform contains a ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/next/blob/d0de6a0783f2a4f6df8137519d2fd618d030b318/packages/client/src/projects/Sketches/SketchReportWindow.tsx",children:"SketchReportWindow"})," component which creates an iFrame and tells it to load the ",(0,n.jsx)(t.code,{children:"clientSideBundle"})," specified in the manifest."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-json",children:'"clientSideBundle": "https://dy0s6wfz2se2a.cloudfront.net?service=https://yo04tf0re1.execute-api.us-west-2.amazonaws.com/prod/"\n'})}),"\n",(0,n.jsxs)(t.p,{children:["The URL is to a static React app stored on AWS S3 and distributed via CloudFront. It contains all of the published report clients inside its bundle. It's entry point is to the ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/App.tsx",children:"App"})," React component which communicates with the SeaSketch platform over the iFrame ",(0,n.jsx)(t.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage",children:"PostMessage API"}),". Notice the ",(0,n.jsx)(t.code,{children:"service"})," parameter included in the URL, this is to provide the App component with access to the project manifest for looking up geoprocessing functions, which the report client is responsible for running."]}),"\n",(0,n.jsxs)(t.p,{children:["Once the App component is initialized it sends a ",(0,n.jsx)(t.code,{children:"SeaSketchReportingInitEvent"})," message back to the SketchReportWindow to say it's ready, which then sends a ",(0,n.jsx)(t.code,{children:"SeaSketchReportingMessageEventType"})," message with the name of the client to load and the URL and properties of the sketch to report on."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-javascript",children:'postMessage({\n  type: "SeaSketchReportingMessageEventType",\n  client: "CLIENT_NAME_FROM_MANIFEST",\n  geometryUri: "SKETCH_URL",\n  sketchProperties: {\n    id: "607f3953a967192577003534",\n    name: "Test Sketch",\n    createdAt: "2023-04-20T20:28:03.607Z",\n    updatedAt: "2023-04-20T20:28:03.607Z",\n    sketchClassId: "5edfa3a8a1a9956b48ece131",\n    isCollection: false,\n    userAttributes: [],\n    visibleLayers: [],\n  },\n});\n'})}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"App"})," component receives this message and stores the sketch properties in its context state, and then imports and renders the requested client report. The report is rendered and displayed in the iFrame window."]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.img,{alt:"View Report",src:s(71537).A+"",title:"View Report",width:"2000",height:"1380"}),"\nViewing sketch report"]}),"\n",(0,n.jsx)(t.h3,{id:"4-report-client",children:"4. Report Client"}),"\n",(0,n.jsxs)(t.p,{children:["A report client is a React component, loaded by the top-level App component, and it is usually made up of one or more report pages, each with one or more report sections. Typically, each of those report sections contains a ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/components/ResultsCard.tsx",children:"ResultsCard"})," component, which given the name of a geoprocessing function will run it using the useFunction() hook, passing the sketch url and properties stored in the client App's context. The results are then passed back for the body of the card to render. The hook also provides estimates of how long the function will take to run (0 for unknown to start, and updated thereafter) and provides the user with a progress bar."]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.img,{alt:"Report Loading",src:s(41204).A+"",title:"Report Loading",width:"836",height:"283"}),"\nViewing sketch report"]}),"\n",(0,n.jsx)(t.p,{children:"The report client is responsible for running all of the functions and displaying the results as they come back."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-jsx",children:'<ResultsCard\n    title="Zone Size"\n    functionName="calculateArea"\n    skeleton={<LoadingSkeleton />}\n    >\n    {(data: AreaResults) => (\n        <p>\n        \ud83d\udcd0This feature is{" "}\n        <b>{Number.format(Math.round(data.area * 1e-6))}</b> square\n        kilometers.\n        </p>\n    )}\n</ResultsCard>\n'})}),"\n",(0,n.jsxs)(t.p,{children:["Example of a ResultsCard component that runs the ",(0,n.jsx)(t.code,{children:"calculateArea"})," geoprocessing function, which is expected to return a result with type ",(0,n.jsx)(t.code,{children:"AreaResults"})," with property ",(0,n.jsx)(t.code,{children:"area"}),", which is then rendered into a paragraph HTML element. Typescript allows you to strictly define what the result will look like, and the geoprocessing can define this structure."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-javascript",children:"export interface AreaResults {\n  /** area of the sketch in square meters */\n  area: number;\n  bbox: BBox;\n}\n"})}),"\n",(0,n.jsxs)(t.p,{children:["The most common type of data that a geoprocessing function returns is a ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/types/reports.ts#L21",children:"ReportResult"})," which is simply an array of Metric values, and the original sketch with null geometry."]}),"\n",(0,n.jsxs)(t.p,{children:["The ResultsCard uses a ",(0,n.jsx)(t.code,{children:"render callback"})," pattern called ",(0,n.jsx)(t.code,{children:"Function as Child Component"})," or ",(0,n.jsx)(t.code,{children:"FaCC"}),"."]}),"\n",(0,n.jsx)(t.h3,{id:"5-usefunction-hook",children:"5. useFunction Hook"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.code,{children:"useFunction"})," is a ",(0,n.jsx)(t.a,{href:"https://reactjs.org/docs/hooks-intro.html",children:"React hook"})," that calls out to a given geoprocessing function given its name, and passes the results back to the caller."]}),"\n",(0,n.jsx)(t.p,{children:"To do this it:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Returns a loading state so the user can be given an indicator of loading."}),"\n",(0,n.jsx)(t.li,{children:"Fetches the manifest from the root of the published project and finds the URL of the given function name, which is to the published Lambda function."}),"\n",(0,n.jsx)(t.li,{children:"If its an sync geoprocessing function it calls out to the function and waits for the result."}),"\n",(0,n.jsx)(t.li,{children:"If its an async geoprocessing function then it receives back a task ID and an estimate of how long it will take, and subscribes to the project web socket, listening for the task to be complete. The hook caller is provided with an updated estimate of how long the task will take so that it can give a better indication to the user."}),"\n",(0,n.jsxs)(t.li,{children:["In either case, a ",(0,n.jsx)(t.code,{children:"cacheKey"})," is usually provided by the hook, which is used server-side as the unique ID to cache the result in DynamoDB, and to notify via websocket the result is ready."]}),"\n",(0,n.jsxs)(t.li,{children:["Once the task is complete the hook calls a final time to the Lambda function synchronously, with ",(0,n.jsx)(t.code,{children:"checkCacheOnly"})," parameter set, and receives back the result from the DynamoDB cache."]}),"\n",(0,n.jsxs)(t.li,{children:["The result is then stored in the local in-memory cache, using the ",(0,n.jsx)(t.code,{children:"cacheKey"}),", for easy lookup should the geoprocessing function get called multiple times in a single session."]}),"\n",(0,n.jsx)(t.li,{children:"The result is finally returned by the useFunction hook for the caller (usually ResultsCard) to display the result."}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"6-geoprocessing-handler",children:"6. Geoprocessing Handler"}),"\n",(0,n.jsxs)(t.p,{children:["Geoprocessing Functions are bundled and deployed to ",(0,n.jsx)(t.a,{href:"https://aws.amazon.com/lambda/",children:"AWS Lambda"}),". The advantage of running on lambda is that costs are based directly on use, and are typically very low compared to a server running 24/7. They also scale up to hundreds of simulateous users very quickly."]}),"\n",(0,n.jsxs)(t.p,{children:["Every geoprocessing function is wrapped into a ",(0,n.jsx)(t.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/src/aws/GeoprocessingHandler.ts",children:"GeoprocessingHandler"})," function. It's role is to be the Lambda function entry point and:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Given a URL as input to a Sketch or GeoJSON Feature, fetch it."}),"\n",(0,n.jsxs)(t.li,{children:["Track the transitions through accomplishing the task of running the geoprocessing function including ",(0,n.jsx)(t.code,{children:"pending"}),", ",(0,n.jsx)(t.code,{children:"completed"}),", ",(0,n.jsx)(t.code,{children:"failed"}),"."]}),"\n",(0,n.jsx)(t.li,{children:"Estimate how long it will take based on past task runs (Task table in DynamoDB)."}),"\n",(0,n.jsx)(t.li,{children:"Check the cache to see if this geoprocessing function has already been run with the same input and return the result if so."}),"\n",(0,n.jsx)(t.li,{children:"Execute one of 4 different request scenarios, depending on the configured execution mode and step of the request."}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["The two different execution modes for running a geoprocessing function are ",(0,n.jsx)(t.code,{children:"sync"})," and ",(0,n.jsx)(t.code,{children:"async"}),". Sync will execute the geoprocessing function immediately and wait for the result without closing the connection from the browser client. Async will will return a task ID, that the browser client can use to subscribe to the available web socket and wait to be messaged that the result is ready."]}),"\n",(0,n.jsx)(t.p,{children:"These 2 execution modes create 4 different request scenarios. A lambda is created for each scenario, and the one GeoprocessingHandler function contains the conditional logic to handle all four of them."}),"\n",(0,n.jsx)(t.h4,{id:"sync",children:"Sync"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"immediately runs the geoprocessing function and return result in resolved promise to client without the browser client closing the connection."}),"\n"]}),"\n",(0,n.jsx)(t.h4,{id:"async",children:"Async"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"ASYNC_REQUEST_TYPE=start"})," - returns a Task ID to the browser client, that it can use to subscribe to the available web socket and wait to be messaged that the result is ready. In the meantime, this ",(0,n.jsx)(t.code,{children:"start"})," lambda will invoke a second lambda to ",(0,n.jsx)(t.code,{children:"run"})," the actual gp function."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"ASYNC_REQUEST_TYPE=run"})," - run gp function started by scenario 2, cache the result in DB cache and message the client by Task ID that the result is ready."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"checkCacheOnly=true"})," - checks the cache given task ID and returns the result."]}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"7-geoprocessing-functions",children:"7. Geoprocessing Functions"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"https://seasketch.github.io/geoprocessing/api/classes/geoprocessing.GeoprocessingHandler.html#func",children:"Geoprocessing"})," functions typically take a GeoJSON Feature or Sketch, whether singular or a collection, and perform geospatial operations on it and return a result. This can include:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"determining whether sketches within a collection overlap with each other and remove the overlap ensuring there is no double counting."}),"\n",(0,n.jsx)(t.li,{children:"assessing the protection level of each sketch and calculating metrics by protection level. Overlap of sketches within each protection level can also be removed ensuring there is not double counting."}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["The result can take any form but typically are ",(0,n.jsx)(t.a,{href:"/geoprocessing/docs/concepts#metrics",children:"metrics"}),"."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.a,{href:"https://github.com/seasketch/fsm-reports/blob/main/src/functions/boundaryAreaOverlap.ts#L23",children:"Boundary overlap example"})})]})}function d(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},66206:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/AddPreprocessor-4c68d38e860d660e7813cc88c2d0ff88.jpg"},51692:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/AddReportClient-606d035b45993f7ce155765b34acd1fb.jpg"},35792:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/PreprocessorSuccess-f409e0a2e7a1ec496e74a204774ca019.png"},41204:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/ReportLoading-3084f15d19ce71cc68c02cf21eef34be.jpg"},85287:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/ShapeDraw-adc13f170626b0746439fbd6279e95e7.png"},42712:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/SystemModelDetailed-3ac86fd5db49055e3866f89a08b3b95d.jpg"},71537:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/ViewReport-aa0ca7a623a58f352c25bb494463b91d.png"},28453:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>a});var n=s(96540);const i={},o=n.createContext(i);function r(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);