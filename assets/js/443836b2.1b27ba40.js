"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[72457],{38475:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>a});var i=s(74848),t=s(28453);const r={slug:"/cli"},o="Command Line Interface (CLI)",l={id:"CLI",title:"Command Line Interface (CLI)",description:"Each geoprocessing project provides a number of commands to get work done. They are accessible via your projects package.json scripts and run using npm run",source:"@site/docs/CLI.md",sourceDirName:".",slug:"/cli",permalink:"/geoprocessing/docs/cli",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/CLI.md",tags:[],version:"current",frontMatter:{slug:"/cli"},sidebar:"tutorialSidebar",previous:{title:"Tutorials",permalink:"/geoprocessing/docs/tutorials"},next:{title:"Architecture",permalink:"/geoprocessing/docs/architecture"}},c={},a=[{value:"Adding Building Blocks",id:"adding-building-blocks",level:2},{value:"Datasource management",id:"datasource-management",level:2},{value:"Testing",id:"testing",level:2},{value:"Build and deploy",id:"build-and-deploy",level:2},{value:"Upgrade scripts",id:"upgrade-scripts",level:2},{value:"Language Translation",id:"language-translation",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"command-line-interface-cli",children:"Command Line Interface (CLI)"})}),"\n",(0,i.jsxs)(n.p,{children:["Each geoprocessing project provides a number of commands to get work done. They are accessible via your projects package.json ",(0,i.jsx)(n.code,{children:"scripts"})," and run using ",(0,i.jsx)(n.code,{children:"npm run <command>"})]}),"\n",(0,i.jsx)(n.h2,{id:"adding-building-blocks",children:"Adding Building Blocks"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"create:report"})," - stubs out new report component and geoprocessing function"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"create:client"})," - stubs out a new report client"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"create:function"})," - stubs out a new geoprocessing function"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"add:template"})," - add-on templates for your project"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"datasource-management",children:"Datasource management"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"import:data"})," - import a new vector or raster datasource to the ",(0,i.jsx)(n.code,{children:"data/dist"})," directory, for publish and use in preprocessing and geoprocessing functions, making any necessary transformations and precalculations."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"reimport:data"})," - reimport an existing datasource. Use when a new version of data becomes available."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"publish:data"})," - publishes imported datasources from ",(0,i.jsx)(n.code,{children:"data/dist"})," to the projects ",(0,i.jsx)(n.code,{children:"datasets"})," S3 bucket, for use by preprocessing and geoprocessing functions."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"testing",children:"Testing"}),"\n",(0,i.jsxs)(n.p,{children:["Testing uses ",(0,i.jsx)(n.a,{href:"https://storybook.js.org/",children:"Storybook"}),", ",(0,i.jsx)(n.a,{href:"https://jestjs.io/",children:"Jest"})," and the ",(0,i.jsx)(n.a,{href:"https://testing-library.com/docs/react-testing-library/intro/",children:"React testing library"}),"."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"storybook"})," - loads stories for your reports and other UI components in your default web browser using a local storybook dev server."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Story files must be named ",(0,i.jsx)(n.code,{children:"*.stories.tsx"})," to be picked up."]}),"\n",(0,i.jsx)(n.li,{children:"Storybook updates automatically as you make and save changes to your components."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"start-data"})," - runs a local file server, serving up the cloud-optimized datasources in ",(0,i.jsx)(n.code,{children:"data/dist"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"test"})," - executes all unit and smoke tests for the project"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"test:unit:matching"})," - executes unit tests matching the given substring."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["You will need to run ",(0,i.jsx)(n.code,{children:"start-data"})," command manually before running this command if your functions accesses datasources published by this project (not global datasources)."]}),"\n",(0,i.jsxs)(n.li,{children:["See Vitest ",(0,i.jsx)(n.a,{href:"https://vitest.dev/guide/cli#options",children:"-t"})]}),"\n",(0,i.jsxs)(n.li,{children:["e.g. ",(0,i.jsx)(n.code,{children:"npm run test:matching boundaryAreaOverlapSmoke"})," where smoke test is coded as follows"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:'test("boundaryAreaOverlapSmoke - tests run against all examples", async () => {\n  ...\n})\n'})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"test:matching"})," - executes tests with name matching the given substring.","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["You will need to run ",(0,i.jsx)(n.code,{children:"start-data"})," command manually before running this command if your functions accesses datasources published by this project (not global datasources)."]}),"\n",(0,i.jsxs)(n.li,{children:["See Jest ",(0,i.jsx)(n.a,{href:"https://jestjs.io/docs/cli#--testnamepatternregex",children:"--testNamePattern"})]}),"\n",(0,i.jsxs)(n.li,{children:["e.g. ",(0,i.jsx)(n.code,{children:"npm run test:matching boundaryAreaOverlapSmoke"})," where smoke test is coded as follows"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:'test("boundaryAreaOverlapSmoke - tests run against all examples", async () => {\n  ...\n})\n'})}),"\n",(0,i.jsx)(n.h2,{id:"build-and-deploy",children:"Build and deploy"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"build"})," - bundles geoprocessing functions into a ",(0,i.jsx)(n.code,{children:".build"})," directory and report clients into a ",(0,i.jsx)(n.code,{children:".build-web"})," directory. Ready to be deployed.","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"build:client"})," - sub-command for building just your report clients"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"build:lambda"})," - sub-command for building just your geoprocessing functions"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"deploy"})," - deploys your built functions and clients to an AWS CloudFormation stack. Name of stack to deploy to is based on the name of your project in package.json. After initial deploy, use this same command to re-deploy.","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"synth"})," - translates your project resources into an AWS CloudFormation template. This is automatically done as par of the deploy and you should not need to run this."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"destroy"})," - destroy your current projects CloudFormation stack in AWS. Useful if a rollback fails and your stack is left in an inconsistent state. You should be able to re-deploy"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"bootstrap"})," - command to run ",(0,i.jsx)(n.code,{children:"cdk bootstrap"}),". Usually only needed if deploying for first time with CDK to a region with your account. Run if your deploy fails and suggests you need to bootstrap."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"url"})," - returns the root URL of the REST API for your deployment, which returns the project manifest."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"upgrade-scripts",children:"Upgrade scripts"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"install:scripts"})," - installs scripts from the geoprocessing library to ",(0,i.jsx)(n.code,{children:"scripts"})," and ",(0,i.jsx)(n.code,{children:"data/scripts"})," folders, overwriting existing files. Use to manually upgrade your scripts to the latest after upgrading the geoprocessing library. If you've modified these scripts locally you will need to merge the changes manually."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"language-translation",children:"Language Translation"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"translation:extract"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Extracts all translations from your projects source code using babel and ",(0,i.jsx)(n.a,{href:"https://github.com/gilbsgilbs/babel-plugin-i18next-extract",children:"babel-plugin-i18next-extract"}),". It also runs an additional script (",(0,i.jsx)(n.code,{children:"src/i18n/bin/extractExtraTerms.ts"}),") to extract strings from your project config (metrics.json, objectives.json) commonly displayed in reports for translation as ",(0,i.jsx)(n.code,{children:"extraTerms"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"translation:publish"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Posts translations for all langauges to POEditor. Behavior is pre-configured via ",(0,i.jsx)(n.code,{children:"src/i18n/config.ts"}),". Do not edit this file unless you need to."]}),"\n",(0,i.jsxs)(n.li,{children:["Translations with namespace specified by ",(0,i.jsx)(n.code,{children:"localNamespace"})," are written to POEditor with context value specified by ",(0,i.jsx)(n.code,{children:"remoteContext"}),"."]}),"\n",(0,i.jsx)(n.li,{children:"All english translations are published, overwriting any in POEditor, since the code is their source of truth."}),"\n",(0,i.jsxs)(n.li,{children:["For non-english languages, POEditor is the source of truth, so if a translation is not defined in POEditor, then a local project translation is published if available, otherwise a base translation will be published as fallback. Running ",(0,i.jsx)(n.code,{children:"translation:import"})," after that will then import those base translations back and seed the local project translations."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"translation:import"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Fetches translations from POEditor for all non-english languages having context value specified by ",(0,i.jsx)(n.code,{children:"remotextContex"})," property in ",(0,i.jsx)(n.code,{children:"src/i18n/config.son"}),". Any existing translation values will be overwritten. Translations are saved to the namespace specified by the ",(0,i.jsx)(n.code,{children:"localNamespace"})," property in ",(0,i.jsx)(n.code,{children:"project/i18n.json"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"translation:sync"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["A convenience command to keep the code, local translations, and remote translations in sync. Simply runs in succession ",(0,i.jsx)(n.code,{children:"extract"}),", ",(0,i.jsx)(n.code,{children:"publish"}),", then ",(0,i.jsx)(n.code,{children:"import"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"translation:install"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Use to manually upgrade your projects base translations from the installed geoprocessing library to the projects ",(0,i.jsx)(n.code,{children:"src/i18n/baseLang"})," directory, overwriting any previous version. You should not normally need to run this, because it is already run after every time you run ",(0,i.jsx)(n.code,{children:"npm install"})," such that if you upgrade your geoprocessing library version, it will be done automatically."]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>l});var i=s(96540);const t={},r=i.createContext(t);function o(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);