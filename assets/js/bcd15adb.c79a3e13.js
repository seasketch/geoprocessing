"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[86683],{93847:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>l});var r=n(74848),s=n(28453);const t={},i="Upgrading",a={id:"Migrating",title:"Upgrading",description:"Instructions to migrate existing geoprocessing projects to newer versions.",source:"@site/docs/Migrating.md",sourceDirName:".",slug:"/Migrating",permalink:"/geoprocessing/docs/next/Migrating",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/Migrating.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Typescript API",permalink:"/geoprocessing/docs/next/api/"},next:{title:"Extending",permalink:"/geoprocessing/docs/next/extending"}},c={},l=[{value:"Initial upgrade",id:"initial-upgrade",level:2},{value:"Test Stack",id:"test-stack",level:2},{value:"6.x to 7.x",id:"6x-to-7x",level:2},{value:"Upgrade dev environment",id:"upgrade-dev-environment",level:3},{value:"Upgrade Script",id:"upgrade-script",level:3},{value:"Convert project to ES Modules",id:"convert-project-to-es-modules",level:3},{value:"Migrate asset imports",id:"migrate-asset-imports",level:3},{value:"Other Changes",id:"other-changes",level:3},{value:"Migrate styled-components",id:"migrate-styled-components",level:3},{value:"6.0 to 6.1",id:"60-to-61",level:2},{value:"5.x to 6.x",id:"5x-to-6x",level:2},{value:"4.x to 5.x",id:"4x-to-5x",level:2},{value:"package.json",id:"packagejson",level:3},{value:"Geographies",id:"geographies",level:3},{value:"Datasources",id:"datasources",level:3},{value:"Precalc",id:"precalc",level:3},{value:"Geoprocessing functions",id:"geoprocessing-functions",level:3},{value:"Report Clients",id:"report-clients",level:3},{value:"Language Translation",id:"language-translation",level:3}];function d(e){const o={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.header,{children:(0,r.jsx)(o.h1,{id:"upgrading",children:"Upgrading"})}),"\n",(0,r.jsx)(o.p,{children:"Instructions to migrate existing geoprocessing projects to newer versions."}),"\n",(0,r.jsx)(o.h2,{id:"initial-upgrade",children:"Initial upgrade"}),"\n",(0,r.jsxs)(o.p,{children:["An existing project will be pinned to a specific version of the geoprocessing library in package.json, under ",(0,r.jsx)(o.code,{children:"devDependencies"}),". To update to the latest version you can simply run:"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-bash",children:"npm update @seasketch/geoprocessing@latest\nnpm install\nnpm run upgrade\n"})}),"\n",(0,r.jsx)(o.p,{children:"If you are upgrading to a new major version (e.g 6.1.x to 7.0.x), then there will be breaking changes that may affect your project. It is suggested that you upgrade only one major version at a time if there are significant manual steps required to migrate your project. If you need to upgrade 2 or more major versions, consider simply creating a new project from scratch, them migrating everything over one at a time (datasources, metric groups, functions and report clients)."}),"\n",(0,r.jsx)(o.p,{children:"After upgrading you should always rerun your tests and storybook to verify everything is working properly and test output changes are as expected."}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-bash",children:"npm test\nnpm run storybook\n"})}),"\n",(0,r.jsx)(o.p,{children:"Make sure to commit all of your changes to your git repo, and re-deploy your project to AWS when ready."}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-bash",children:"npm run build\nnpm run deploy\n"})}),"\n",(0,r.jsxs)(o.p,{children:["After deploy, you may also need to reimport and republish all of your datasources using ",(0,r.jsx)(o.code,{children:"reimport:data"})," and ",(0,r.jsx)(o.code,{children:"publish:data"})," commands. Follow the steps for your particular migration below."]}),"\n",(0,r.jsx)(o.h2,{id:"test-stack",children:"Test Stack"}),"\n",(0,r.jsx)(o.p,{children:"If you'd like to deploy to a test stack first, alongside your existing production stack, to make sure everything is working properly:"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Change the ",(0,r.jsx)(o.code,{children:"name"})," field of your project in package.json (e.g. ",(0,r.jsx)(o.code,{children:'"name": "my-reports"'}),' becomes `"name": "my-reports-7x".']}),"\n",(0,r.jsxs)(o.li,{children:["Then ",(0,r.jsx)(o.code,{children:"npm run build"})," and ",(0,r.jsx)(o.code,{children:"npm run deploy"}),". This will deploy to a new AWS CloudFormation stack, separate from your production stack."]}),"\n",(0,r.jsx)(o.li,{children:'Once deployed, repoint your existing sketch classes to the new geoprocessing service, or create separate "admin only" sketch classes that point to your new test service. Make sure that all required sketch class attributes are in place.'}),"\n",(0,r.jsxs)(o.li,{children:["When you are ready to update production, change the ",(0,r.jsx)(o.code,{children:"name"})," in package.json back, and rerun ",(0,r.jsx)(o.code,{children:"build"})," and ",(0,r.jsx)(o.code,{children:"deploy"}),"."]}),"\n"]}),"\n",(0,r.jsx)(o.h2,{id:"6x-to-7x",children:"6.x to 7.x"}),"\n",(0,r.jsx)(o.p,{children:"Numerous manual migration steps are required, including a number of breaking changes:"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsx)(o.li,{children:"Testing framework switched from Jest to Vite"}),"\n",(0,r.jsx)(o.li,{children:"Required use of new Node features (e.g. switch from __dirname to import.meta.dirname)"}),"\n",(0,r.jsx)(o.li,{children:"Required use of ES Module structure and import style"}),"\n",(0,r.jsxs)(o.li,{children:["Lambda functions are now maintained in one or more LambdaStack(s) nested within the root CloudFormation stack. The number of nested stacks auto-scales as functions are added to the project (about 15-20 functions per LambdaStack). This change typically will cause an error when re-deploying an existing project, because the logical ID's for lambda functions are unique and fixed and migrating functions from the root stack to a nested LambdaStack causes a ",(0,r.jsx)(o.code,{children:"duplicate identifier"})," error. If you see this error, the solution is to run ",(0,r.jsx)(o.code,{children:"npm run destroy"})," to delete your stack first. Then run ",(0,r.jsx)(o.code,{children:"deploy"})," again. You will need to ",(0,r.jsx)(o.code,{children:"publish"})," your datasources again after deploy. Follow the instructions up top for how to use a ",(0,r.jsx)(o.code,{children:"test stack"})]}),"\n"]}),"\n",(0,r.jsxs)(o.p,{children:["See ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/fsm-nearshore-reports/pull/3",children:"fsm-reports"})," for a migration from 6.x to 7.x and ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/brazil-reports/pull/10",children:"brazil-reports"})," for migration from 3.x to 7.x which was done by starting with a freshly created project in a git branch and slowly migrating the datasources, metric groups, functions, and report clients over."]}),"\n",(0,r.jsx)(o.h3,{id:"upgrade-dev-environment",children:"Upgrade dev environment"}),"\n",(0,r.jsxs)(o.p,{children:["If you're using ",(0,r.jsx)(o.code,{children:"geoprocessing-devcontainer"})," to develop in a Docker environment, you will need to update this repo and the underlying ",(0,r.jsx)(o.code,{children:"geoprocessing-workspace"})," docker image to the latest. First, make sure Docker Desktop is running, then:"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-bash",children:"cd geoprocessing-devcontainer\ngit pull\ndocker pull seasketch/geoprocessing-workspace\n"})}),"\n",(0,r.jsx)(o.p,{children:"You should now be able to start a Docker container shell using the latest image and test that everything is up to date"}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-bash",children:"sudo docker run -it --entrypoint /bin/bash seasketch/geoprocessing-workspace\n\n(base) vscode \u279c / $ node -v\nv20.12.1\n(base) vscode \u279c / $ npm -v\n10.5.0\n(base) vscode \u279c / $ gdalinfo --version\nGDAL 3.8.5, released 2024/04/02\n"})}),"\n",(0,r.jsx)(o.p,{children:"Exit back out of this shell when done"}),"\n",(0,r.jsxs)(o.p,{children:["The latest version of the ",(0,r.jsx)(o.code,{children:"geoprocessing-workspace"})," will only work with geoprocessing 7.x projects. This is due to a change in how GDAL produces flatgeobuf files. If you suddenly see errors of ",(0,r.jsx)(o.code,{children:'"Not a FlatGeobuf file"'})," when trying to read your file, this is likely the reason. In order to continue to develop older 6.x and lower geoprocessing projects you will need to start your devcontainer using the ",(0,r.jsx)(o.code,{children:"local-dev-pre-7x"})," environment. This is pinned to an older version of the docker image - ",(0,r.jsx)(o.code,{children:"seasketch/geoprocessing-workspace:sha-69bb889"})]}),"\n",(0,r.jsx)(o.p,{children:"If you're maintaining your own development environment then you should look to have at least the following versions at minimum:"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsx)(o.li,{children:"Node 20.12.1"}),"\n",(0,r.jsx)(o.li,{children:"NPM 10.5.0"}),"\n",(0,r.jsx)(o.li,{children:"GDAL 3.5.0"}),"\n"]}),"\n",(0,r.jsx)(o.h3,{id:"upgrade-script",children:"Upgrade Script"}),"\n",(0,r.jsxs)(o.p,{children:["As of v7.0-beta.5 there is a new ",(0,r.jsx)(o.code,{children:"upgrade"})," script that automates installing/updating assets in your project from the gp library. As of now it upgrades:"]}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsx)(o.li,{children:"package.json - updates scripts, dependencies, devDependencies"}),"\n",(0,r.jsx)(o.li,{children:".storybook - installs directory"}),"\n",(0,r.jsxs)(o.li,{children:[".vscode - overwrites ",(0,r.jsx)(o.code,{children:".vscode"})," directory with new files"]}),"\n",(0,r.jsxs)(o.li,{children:["i18n - creates a new ",(0,r.jsx)(o.code,{children:"project/i18n.json"})," file. overwrites ",(0,r.jsx)(o.code,{children:"src/i18n"})," directory with new files."]}),"\n"]}),"\n",(0,r.jsx)(o.p,{children:"Some of these upgrades are destructive and will simply overwrite the director in your project (.storybook, .vscode, src/i18n). If you have customized any of these parts of your project, then be sure to look at the git changelog and bring back any of your work."}),"\n",(0,r.jsx)(o.p,{children:"This includes: package.json, i18n, storybook, vscode."}),"\n",(0,r.jsxs)(o.p,{children:["Add it to your projects package.json ",(0,r.jsx)(o.code,{children:"scripts"})," section"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{children:'"upgrade": "geoprocessing upgrade"\n'})}),"\n",(0,r.jsx)(o.p,{children:"Then run it:"}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-bash",children:"npm run upgrade\n"})}),"\n",(0,r.jsx)(o.h3,{id:"convert-project-to-es-modules",children:"Convert project to ES Modules"}),"\n",(0,r.jsxs)(o.p,{children:["This is the biggest breaking change in v7. You will need to change your project to an ",(0,r.jsx)(o.code,{children:"ES Module"})," structure or ",(0,r.jsx)(o.code,{children:"ESM"})," for short. With this change, Node will use an ",(0,r.jsx)(o.code,{children:"ESM"})," runtime, instead of the original ",(0,r.jsx)(o.code,{children:"CommonJS"}),", which will necessitate some additional code changes covered below."]}),"\n",(0,r.jsxs)(o.p,{children:["Use the ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/geoprocessing/tree/dev/packages/base-project",children:"base project"})," that gets installed when you init a new geoprocessing project as a guide."]}),"\n",(0,r.jsx)(o.p,{children:"First, in package.json:"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Add ",(0,r.jsx)(o.code,{children:'"type": "module",'})]}),"\n"]}),"\n",(0,r.jsxs)(o.p,{children:["Then reload your VSCode window to make sure it picks up that your project is now an ESM project. You can do this with ",(0,r.jsx)(o.code,{children:"Cmd-Shift-P"})," on Mac or ",(0,r.jsx)(o.code,{children:"Ctrl-Shift-P"})," on Windows and then start typing ",(0,r.jsx)(o.code,{children:"reload"})," and select the ",(0,r.jsx)(o.code,{children:"Developer: Reload Window"})," option. Or just close and restart the VSCode app as you normally would."]}),"\n",(0,r.jsxs)(o.p,{children:["Now you need to update all of your projects source files to be ESM and Node v20 compliant. VSCode should give you hints along the way, so basically just click through all the source files looking for red squiggle underlined text. You will focus in the ",(0,r.jsx)(o.code,{children:"src"})," directory."]}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["For each import of a local module (e.g. ",(0,r.jsx)(o.code,{children:"import project from ../project"}),"), use a full explicit path and include a ",(0,r.jsx)(o.code,{children:".js"})," extension on the end, even if you are importing a ",(0,r.jsx)(o.code,{children:".ts"})," file. The example would become ",(0,r.jsx)(o.code,{children:"import project from ../project/projectClient.js"}),"."]}),"\n",(0,r.jsxs)(o.li,{children:["NodeJS when using the ES Module engine now requires explicit paths to code files. No longer can you import a module from a directory (e.g. ",(0,r.jsx)(o.code,{children:"import foo from ./my/directory"}),") and expect it will look for an index.js file. You have to change this to",(0,r.jsx)(o.code,{children:"import foo form ./my/directory/index.js"}),".\n",(0,r.jsx)(o.code,{children:"__dirname"})," built-in must be changed to ",(0,r.jsx)(o.code,{children:"import.meta.dirname"})]}),"\n"]}),"\n",(0,r.jsx)(o.h3,{id:"migrate-asset-imports",children:"Migrate asset imports"}),"\n",(0,r.jsxs)(o.p,{children:[(0,r.jsx)(o.code,{children:"require"})," is no longer allowed for importing images and other static assets. Vite expects you to import the assets ",(0,r.jsx)(o.a,{href:"https://vitejs.dev/guide/assets#importing-asset-as-url",children:"directly"})," as urls. SizeCard.tsx is one component installed by default with projects that will need to be updated."]}),"\n",(0,r.jsx)(o.p,{children:"Change:"}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'<img\n  src={require("../assets/img/territorial_waters.png")}\n  style={{ maxWidth: "100%" }}\n/>\n'})}),"\n",(0,r.jsx)(o.p,{children:"to:"}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'import watersImgUrl from "../assets/img/territorial_waters.png";\n...\n{<img src={watersImgUrl} style={{ maxWidth: "100%" }} />}\n'})}),"\n",(0,r.jsxs)(o.p,{children:["At this point, VSCode will complain about your image import, it doesn't support importing anything other than code and JSON files by default. The code bundler now used by your project, Vite, knows how to do this however, you just need to load its capabilities by creating a file called ",(0,r.jsx)(o.code,{children:"vite-env.d.ts"})," at the top-level of your project with the following:"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{children:'/// <reference types="vite/client" />\n// Add Vite types to project\n// https://vitejs.dev/guide/features.html#client-types\n'})}),"\n",(0,r.jsx)(o.h3,{id:"other-changes",children:"Other Changes"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsx)(o.li,{children:"Rename babel.config.js to babel.config.cjs. This babel config is used only by the translation library."}),"\n",(0,r.jsx)(o.li,{children:"update project/projectClient.ts with type assertion syntax"}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'import datasources from "./datasources.json" with { type: "json" };\nimport metrics from "./metrics.json" with { type: "json" };\nimport precalc from "./precalc.json" with { type: "json" };\nimport objectives from "./objectives.json" with { type: "json" };\nimport geographies from "./geographies.json" with { type: "json" };\nimport basic from "./basic.json" with { type: "json" };\nimport projectPackage from "../package.json" with { type: "json" };\nimport gp from "../project/geoprocessing.json" with { type: "json" };\n\nimport { ProjectClientBase } from "@seasketch/geoprocessing/client-core";\n\nconst projectClient = new ProjectClientBase({\n  datasources,\n  metricGroups: metrics,\n  precalc,\n  objectives,\n  geographies,\n  basic,\n  package: projectPackage,\n  geoprocessing: gp,\n});\nexport default projectClient;\n'})}),"\n",(0,r.jsx)(o.h3,{id:"migrate-styled-components",children:"Migrate styled-components"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["If you have report components that use styled-components for its styling, you will need to change all code imports of ",(0,r.jsx)(o.code,{children:"styled-components"})," from"]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'import styled from "styled-components";\n'})}),"\n",(0,r.jsx)(o.p,{children:"to use of the named export"}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'import { styled } from "styled-components";\n'})}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsx)(o.li,{children:"Also when you run storybook or load your reports in production you may start to see React console warnings about extra attributes being present."}),"\n"]}),"\n",(0,r.jsx)(o.p,{children:"`React does not recognize the rowTotals prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase rowtotals instead. If you accidentally passed it from a parent component, remove it from the DOM element."}),"\n",(0,r.jsxs)(o.p,{children:["The solution is to switch to using ",(0,r.jsx)(o.code,{children:"transient"})," prop names, or component prop names that start with a dollar sign (e.g. ",(0,r.jsx)(o.code,{children:"$rowTotals"})," instead of ",(0,r.jsx)(o.code,{children:"rowTotals"}),"). Styled-components will automatically filter these props out before passing to React to render them as element attributes in the browser."]}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsx)(o.li,{children:(0,r.jsx)(o.a,{href:"https://jakemccambley.medium.com/transient-props-in-styled-components-3105f16cb91f",children:"https://jakemccambley.medium.com/transient-props-in-styled-components-3105f16cb91f"})}),"\n"]}),"\n",(0,r.jsx)(o.h1,{id:"stop-importing-directly-from-seasketchgeoprocessing-in-report-clients",children:"Stop importing directly from @seasketch/geoprocessing in report clients"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Report client code must no longer import from geoprocessing libraries top level entry point ",(0,r.jsx)(o.code,{children:"@seasketch/geoprocessing"}),' or you may see a "require is not defined" error or other errors related to Node specific modules not found. The solution is to switch from for example:']}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'import { ProjectClientBase } from "@seasketch/geoprocessing";\n'})}),"\n",(0,r.jsx)(o.p,{children:"to:"}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'import { ProjectClientBase } from "@seasketch/geoprocessing/client-core";\n'})}),"\n",(0,r.jsxs)(o.p,{children:["The use of the top-level entry point has persisted in some code because the previous Webpack code bundler did some extra magic to not let Node modules be bundled into report client browser code. The new Vite code bundler does not do this magic and leaves it to you to track your imports. The geoprocessing library offers both the ",(0,r.jsx)(o.code,{children:"client-core"})," and ",(0,r.jsx)(o.code,{children:"client-ui"})," entry points which should be used. These should offer everything you need."]}),"\n",(0,r.jsx)(o.h2,{id:"60-to-61",children:"6.0 to 6.1"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Run ",(0,r.jsx)(o.code,{children:"reimport:data"})," to ensure that all raster datasources in ",(0,r.jsx)(o.code,{children:"data/dist"})," are in an equal area projection."]}),"\n",(0,r.jsxs)(o.li,{children:["Run ",(0,r.jsx)(o.code,{children:"precalc:data"})," for all raster datasources to precalculate additional metrics including ",(0,r.jsx)(o.code,{children:"sum"}),", ",(0,r.jsx)(o.code,{children:"area"}),", ",(0,r.jsx)(o.code,{children:"valid"}),", ",(0,r.jsx)(o.code,{children:"count"}),"."]}),"\n",(0,r.jsxs)(o.li,{children:["Run ",(0,r.jsx)(o.code,{children:"publish:data"})," for all raster datasources to ensure equal area version is published to S3 storage."]}),"\n",(0,r.jsxs)(o.li,{children:["Migrate geoprocessing functions from ",(0,r.jsx)(o.code,{children:"otverlapRaster()"})," (now deprecated) to ",(0,r.jsx)(o.code,{children:"rasterMetrics()"})," as you have time, and need to calculate additional stats like area. ",(0,r.jsx)(o.code,{children:"rasterStats()"})," and ",(0,r.jsx)(o.code,{children:"getArea()"})," are available as lower level alternatives for constructing your own functions."]}),"\n",(0,r.jsxs)(o.li,{children:["any use of geoblaze directly, that passes a polygon feature for overlap, must reproject the feature to an equal area projection first, using ",(0,r.jsx)(o.code,{children:"toRasterProjection"}),". See ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/geoprocessing/blob/5b2c3dd1381343733e0908d91c22d51597151f1b/packages/geoprocessing/src/toolbox/geoblaze/geoblaze.ts#L34",children:"getSum"})," for an example."]}),"\n",(0,r.jsxs)(o.li,{children:["any use of the deprecated ",(0,r.jsx)(o.code,{children:"loadCogWindow()"})," should be replaced with the newer ",(0,r.jsx)(o.code,{children:"loadCog()"}),". The former doesnt' appear to work correctly with functions like ",(0,r.jsx)(o.code,{children:"rasterStats()"})," and ",(0,r.jsx)(o.code,{children:"rasterMetrics()"}),"."]}),"\n"]}),"\n",(0,r.jsx)(o.h2,{id:"5x-to-6x",children:"5.x to 6.x"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Add ",(0,r.jsx)(o.code,{children:"explodeMulti: true"})," to all vector datasources in ",(0,r.jsx)(o.code,{children:"project/datasources.json"}),". You can set this to false if you know for sure you need to maintain multipolygons in the datasource. Otherwise breaking them up can speed up geoprocessing function by not fetching an operating on extra polygons outside the bounding box of a sketch."]}),"\n"]}),"\n",(0,r.jsx)(o.h2,{id:"4x-to-5x",children:"4.x to 5.x"}),"\n",(0,r.jsx)(o.h3,{id:"packagejson",children:"package.json"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Update package.json to latest 5.x version of geoprocessing library and run ",(0,r.jsx)(o.code,{children:"npm install"})]}),"\n",(0,r.jsxs)(o.li,{children:["Add the ",(0,r.jsx)(o.code,{children:"precalc:data"})," and ",(0,r.jsx)(o.code,{children:"precalc:data:clean"})," cli commands to ",(0,r.jsx)(o.code,{children:"package.json"}),":"]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-json",children:'{\n  "precalc:data": "start-server-and-test \'http-server data/dist -c-1 -p 8001\' http://localhost:8001 precalc:data_",\n  "precalc:data_": "geoprocessing precalc:data",\n  "precalc:data:clean": "geoprocessing precalc:data:clean"\n}\n'})}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Drop use of web server from ",(0,r.jsx)(o.code,{children:"import:data"})," and ",(0,r.jsx)(o.code,{children:"reimport:data"})]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-json",children:'{\n  "import:data": "geoprocessing import:data",\n  "reimport:data": "geoprocessing reimport:data"\n}\n'})}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["The ProjectClient now takes precalc metrics and geographies as input. Update ",(0,r.jsx)(o.code,{children:"project/projectClient.ts"})," to the following:"]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-typescript",children:'import datasources from "./datasources.json" with { type: "json" };\nimport metrics from "./metrics.json" with { type: "json" };\nimport precalc from "./precalc.json" with { type: "json" };\nimport objectives from "./objectives.json" with { type: "json" };\nimport geographies from "./geographies.json" with { type: "json" };\nimport basic from "./basic.json" with { type: "json" };\nimport projectPackage from "../package.json" with { type: "json" };\nimport gp from "../project/geoprocessing.json" with { type: "json" };\nimport { ProjectClientBase } from "@seasketch/geoprocessing" with { type: "json" };\n\nconst projectClient = new ProjectClientBase({\n  datasources,\n  metricGroups: metrics,\n  precalc: precalc,\n  objectives,\n  geographies,\n  basic,\n  package: projectPackage,\n  geoprocessing: gp,\n});\n\nexport default projectClient;\n'})}),"\n",(0,r.jsx)(o.h3,{id:"geographies",children:"Geographies"}),"\n",(0,r.jsxs)(o.p,{children:["Geographies are a new construct, most commonly used for planning boundaries. You are required to define at least one per project and you can have more than one. Projects have always had them, but they were implicitly defined based on how data was clipped, which was both unclear to the report developer and very limiting. Geographies are explicit. There is no longer confusion about whether and how to clip datasources to one or more planning boundaries. You just define what the geography boundaries are, by associating it with a datasource. Then the precalc command will clip the datasource (whether vector or raster) to each geographies features (intersection) and precompute metrics with what remains (total area, count, sum). This replaces what was ",(0,r.jsx)(o.code,{children:"keyStats"})," in datasources.json. Preclac metrics are typically used as the denominator when calculating % sketch overlap in reports. Geoprocessing functions also clip the current sketch to one or more geographies at runtime when calculating metrics. These are often used as the numerator when when calculating sketch % overlap in reports."]}),"\n",(0,r.jsxs)(o.p,{children:["To setup your projects default geography, create a new file ",(0,r.jsx)(o.code,{children:"project/geographies.json"}),". Choose from one of the options below for your default geography. Just make sure that the geography is assigned to the ",(0,r.jsx)(o.code,{children:"default-boundary"})," group, and ",(0,r.jsx)(o.code,{children:"precalc"})," is set to ",(0,r.jsx)(o.code,{children:"true"})]}),"\n",(0,r.jsxs)(o.ol,{children:["\n",(0,r.jsx)(o.li,{children:"If you already have a local datasource with your planning boundary, then just define a geography that uses that datasource."}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-json",children:'[\n  {\n    "geographyId": "nearshore",\n    "datasourceId": "6nm_boundary",\n    "display": "Azores",\n    "layerId": "x6kSfK6Lb",\n    "groups": ["default-boundary"],\n    "precalc": true\n  }\n]\n'})}),"\n",(0,r.jsxs)(o.ol,{start:"2",children:["\n",(0,r.jsxs)(o.li,{children:["If your planning boundary is a Marine Regions EEZ, you can define an ",(0,r.jsx)(o.code,{children:"eez"})," geography that uses the new ",(0,r.jsx)(o.code,{children:"global-eez-mr-v12"})," datasource (see below on how to add this datasource to your project), which is the default for a new project when you choose the Ocean EEZ template. You just need to apply the correct ",(0,r.jsx)(o.code,{children:"bboxFilter"})," and ",(0,r.jsx)(o.code,{children:"propertyFilter"})," for your EEZ or EEZ's of choice. [TODO: ADD WEB LINK]"]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-json",children:'[\n  {\n    "geographyId": "eez",\n    "datasourceId": "global-eez-mr-v12",\n    "display": "Samoan EEZ",\n    "propertyFilter": {\n      "property": "GEONAME",\n      "values": ["Samoan Exclusive Economic Zone"]\n    },\n    "bboxFilter": [\n      -174.51139447157757, -15.878383591829206, -170.54265693017294,\n      -10.960825304544073\n    ],\n    "groups": ["default-boundary"],\n    "precalc": true\n  }\n]\n'})}),"\n",(0,r.jsxs)(o.ol,{start:"3",children:["\n",(0,r.jsxs)(o.li,{children:["If you don't have a planning boundary or want to use the entire world as your planning boundary you can use the world geography which uses the world datasource (see below for how to add this datasource). world is the new default geography for all new ",(0,r.jsx)(o.code,{children:"blank"})," geoprocessing projects."]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-json",children:'[\n  {\n    "geographyId": "world",\n    "datasourceId": "world",\n    "display": "World",\n    "groups": ["default-boundary"],\n    "precalc": true\n  }\n]\n'})}),"\n",(0,r.jsx)(o.h3,{id:"datasources",children:"Datasources"}),"\n",(0,r.jsxs)(o.p,{children:["Based on your geography choice above, add the corresponding datasource for this geography to your ",(0,r.jsx)(o.code,{children:"datasources.json"})," file."]}),"\n",(0,r.jsxs)(o.p,{children:["World datasource published by ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/global-datasources",children:"global-datasources"}),":"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-json",children:'[\n  {\n    "datasourceId": "world",\n    "geo_type": "vector",\n    "formats": ["json", "fgb"],\n    "layerName": "world",\n    "classKeys": [],\n    "url": "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/world.fgb",\n    "propertiesToKeep": [],\n    "metadata": {\n      "name": "World Outline Polygon",\n      "description": "World polygon for default project geography in seasketch geoprocessing proejcts",\n      "version": "1.0",\n      "publisher": "SeaSketch",\n      "publishDate": "20231018",\n      "publishLink": ""\n    },\n    "precalc": false\n  }\n]\n'})}),"\n",(0,r.jsxs)(o.p,{children:["Global EEZ datasource published by ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/global-datasources",children:"global-datasources"})," (with filters set to for Samoa EEZ)"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-json",children:'[\n  {\n    "datasourceId": "global-eez-mr-v12",\n    "geo_type": "vector",\n    "formats": ["fgb", "json"],\n    "metadata": {\n      "name": "World EEZ v11",\n      "description": "World EEZ boundaries and disputed areas",\n      "version": "11.0",\n      "publisher": "Flanders Marine Institute (VLIZ)",\n      "publishDate": "2019118",\n      "publishLink": "https://marineregions.org/"\n    },\n    "idProperty": "GEONAME",\n    "nameProperty": "GEONAME",\n    "classKeys": [],\n    "url": "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/global-eez-mr-v12.fgb",\n    "propertyFilter": {\n      "property": "GEONAME",\n      "values": ["Samoan Exclusive Economic Zone"]\n    },\n    "bboxFilter": [\n      -174.51139447157757, -15.878383591829206, -170.54265693017294,\n      -10.960825304544073\n    ],\n    "precalc": false\n  }\n]\n'})}),"\n",(0,r.jsxs)(o.p,{children:["Finally, you need to add a ",(0,r.jsx)(o.code,{children:"precalc"})," setting to all other datasources in your ",(0,r.jsx)(o.code,{children:"datasources.json"})," file. This property is required, and you will see validation errors when running any data commands or smoke tests."]}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Add ",(0,r.jsx)(o.code,{children:'"precalc": true'})," to all datasources in ",(0,r.jsx)(o.code,{children:"project/datasources.json"})," that metrics should be precalculated for. This is typically limited to datasources that you need to precalc the overall summary metric of the datasource (total area, total feature count) so that you can report the % of the total that a sketch overlaps with. Otherwise you don't need to precalc."]}),"\n",(0,r.jsxs)(o.li,{children:["Set all other datasources to ",(0,r.jsx)(o.code,{children:'"precalc": false'}),". This includes global datasources or datasources that are only a source for ",(0,r.jsx)(o.code,{children:"geography"})," features and otherwise aren't used in reports. Setting these to true will at best just precalculate extra metrics that won't be used. At worst it will try to fetch entire global datasources and fail at the task, because the necessary filters aren't in place."]}),"\n"]}),"\n",(0,r.jsx)(o.h3,{id:"precalc",children:"Precalc"}),"\n",(0,r.jsxs)(o.p,{children:["Once you have your ",(0,r.jsx)(o.code,{children:"geographies"})," and ",(0,r.jsx)(o.code,{children:"datasources"})," properly configured, you're ready to run the ",(0,r.jsx)(o.code,{children:"precalc:data"})," command."]}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Create a new file ",(0,r.jsx)(o.code,{children:"project/precalc.json"})," populated with an empty array ",(0,r.jsx)(o.code,{children:"[]"})]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-bash",children:"npm run precalc:data\n"})}),"\n",(0,r.jsxs)(o.p,{children:["This will precompute metrics for all combinations of geographies and datasources. It will also strip any existing ",(0,r.jsx)(o.code,{children:"keyStats"})," properties from ",(0,r.jsx)(o.code,{children:"datasources.json"})," and populate ",(0,r.jsx)(o.code,{children:"precalc.json"}),"."]}),"\n",(0,r.jsx)(o.h3,{id:"geoprocessing-functions",children:"Geoprocessing functions"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Update ",(0,r.jsx)(o.code,{children:"clipToGeography"})," function, to allow geographies to use external datasources. To copy the file from the gp library to your project space, run the following from a terminal in the top-level of your project."]}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{children:"mkdir -p src/util && cp -r node_modules/@seasketch/geoprocessing/dist/base-project/src/util/clipToGeography.ts src/util/clipToGeography.ts\n"})}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["update all geoprocessing functions to use the following boilerplate:","\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["look for ",(0,r.jsx)(o.code,{children:"geographyIds"})," passed in extraParams"]}),"\n",(0,r.jsx)(o.li,{children:"get the geography using project client and fallback to default geography"}),"\n",(0,r.jsx)(o.li,{children:"clip the current sketch to the geography"}),"\n",(0,r.jsxs)(o.li,{children:["see ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/functions/geomorphAreaOverlap.ts#L30",children:"azores-nearshore-reports"})," for examples."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(o.h3,{id:"report-clients",children:"Report Clients"}),"\n",(0,r.jsxs)(o.p,{children:["Reports clients should migrate to new boilerplate code. See ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/components/Geomorphology.tsx#L35",children:"azores-nearshore-reports"})," for examples, specifically:"]}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["receive the current geography as a ",(0,r.jsx)(o.code,{children:"geographyId"})," passed in props."]}),"\n",(0,r.jsxs)(o.li,{children:["get the current geography using ",(0,r.jsx)(o.code,{children:"project.getGeographyById"}),"."]}),"\n",(0,r.jsxs)(o.li,{children:["pass geographyId to ",(0,r.jsx)(o.code,{children:"project.getPrecalcMetrics()"})]}),"\n",(0,r.jsxs)(o.li,{children:["pass geographyId to ResultsCard as ",(0,r.jsx)(o.code,{children:"extraParams"})," for gp function to use"]}),"\n",(0,r.jsx)(o.li,{children:"use curGeography.display string as appropriate in client to tell user which geography is being reported on."}),"\n",(0,r.jsxs)(o.li,{children:["Update any calls to ",(0,r.jsx)(o.code,{children:"toPercentMetric()"}),", now overriding metricIds are passed in through an object, instead of directly. (i.e. ",(0,r.jsx)(o.code,{children:"toPercentMetric(singleMetrics, precalcMetrics, project.getMetricGroupPercId(metricGroup)"})," becomes ",(0,r.jsx)(o.code,{children:"toPercentMetric(singleMetrics, precalcMetrics, {metricIdOverride: project.getMetricGroupPercId(metricGroup)})"}),")"]}),"\n"]}),"\n",(0,r.jsxs)(o.p,{children:["If you would like to allow the user to switch between planning geographies from the report UI, you can add a ",(0,r.jsx)(o.code,{children:"GeographySwitcher"})," at the top level of the report client (see ",(0,r.jsx)(o.a,{href:"https://github.com/seasketch/azores-nearshore-reports/blob/0816a8013de648783159af29071e00e9d8ce547e/src/clients/MpaTabReport.tsx#L34",children:"azores-nearshore-reports"})," example). The user chosen geography ID is then passed into each ",(0,r.jsx)(o.code,{children:"ResultsCard"})," and on to each geoprocessing function as ",(0,r.jsx)(o.code,{children:"extraParams"})]}),"\n",(0,r.jsx)(o.h3,{id:"language-translation",children:"Language Translation"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["Geography display names in geographies.json are now extracted with ",(0,r.jsx)(o.code,{children:"npm run extract:translations"}),". Then translate these strings per your current workflow and GeographySwitcher will use them automatically. The same is true for objectives.json and metrics.json."]}),"\n",(0,r.jsx)(o.li,{children:"Update src/i18n/i18nAsync.ts to latest. Copy the following file in the gp library to your project space to overwrite."}),"\n"]}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{children:"cp -r node_modules/@seasketch/geoprocessing/dist/base-project/src/i18n/i18nAsync.ts src/i18n/i18nAsync.ts\n"})})]})}function h(e={}){const{wrapper:o}={...(0,s.R)(),...e.components};return o?(0,r.jsx)(o,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},28453:(e,o,n)=>{n.d(o,{R:()=>i,x:()=>a});var r=n(96540);const s={},t=r.createContext(s);function i(e){const o=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function a(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(t.Provider,{value:o},e.children)}}}]);