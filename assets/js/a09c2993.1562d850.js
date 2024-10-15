"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[899],{9233:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>c,contentTitle:()=>r,default:()=>d,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var n=t(4848),i=t(8453);const o={slug:"/"},r="Introduction",a={id:"introduction",title:"Introduction",description:"The SeaSketch Geoprocessing framework is an all-in-one solution for developing low-cost and low-maintenance geoprocessing functions and reports for the web, with Typescript. Simplified publish to cloud with auto-scaling to meet high demand.",source:"@site/docs/introduction.md",sourceDirName:".",slug:"/",permalink:"/geoprocessing/docs/",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/introduction.md",tags:[],version:"current",frontMatter:{slug:"/"},sidebar:"tutorialSidebar",next:{title:"Concepts",permalink:"/geoprocessing/docs/concepts"}},c={},l=[{value:"Who is this framework for?",id:"who-is-this-framework-for",level:2},{value:"Goals",id:"goals",level:2},{value:"License",id:"license",level:2},{value:"Features",id:"features",level:2},{value:"3rd Party Building Blocks",id:"3rd-party-building-blocks",level:2},{value:"Known Limitations",id:"known-limitations",level:2},{value:"Javascript-only",id:"javascript-only",level:3},{value:"Coordinate System Support",id:"coordinate-system-support",level:3},{value:"Calculation Error",id:"calculation-error",level:3},{value:"Known Issues",id:"known-issues",level:2}];function h(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"introduction",children:"Introduction"})}),"\n",(0,n.jsx)(s.p,{children:"The SeaSketch Geoprocessing framework is an all-in-one solution for developing low-cost and low-maintenance geoprocessing functions and reports for the web, with Typescript. Simplified publish to cloud with auto-scaling to meet high demand."}),"\n",(0,n.jsxs)(s.p,{children:["This framework is part of the ",(0,n.jsx)(s.a,{href:"https://seasketch.org",children:"SeaSketch"})," ecosystem."]}),"\n",(0,n.jsx)(s.h2,{id:"who-is-this-framework-for",children:"Who is this framework for?"}),"\n",(0,n.jsx)(s.p,{children:"This framework is primarily designed for people that want to create and host their own geoprocessing functions and reports and plug them into their SeaSketch project, though it is not dependent on SeaSketch."}),"\n",(0,n.jsxs)(s.p,{children:["It is used for all SeaSketch ",(0,n.jsx)(s.a,{href:"https://github.com/seasketch/geoprocessing/network/dependents?package_id=UGFja2FnZS0xMTc3OTQ1NDg5",children:"projects"}),"."]}),"\n",(0,n.jsx)(s.h2,{id:"goals",children:"Goals"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://aws.amazon.com/lambda/serverless-architectures-learn-more/",children:"Serverless"})," architecture that scales up to meet high demand, then scales down to near zero cost when not in use."]}),"\n",(0,n.jsxs)(s.li,{children:["First-class ",(0,n.jsx)(s.a,{href:"https://www.typescriptlang.org/",children:"Typescript"})," development experience."]}),"\n",(0,n.jsx)(s.li,{children:"Provide a stable environment for writing analytical reports with React."}),"\n",(0,n.jsxs)(s.li,{children:["Utilize cloud-optimized data formats including ",(0,n.jsx)(s.a,{href:"https://flatgeobuf.org/",children:"Flatgeobuf"})," and ",(0,n.jsx)(s.a,{href:"https://www.cogeo.org/",children:"Cloud-optimized GeoTIFF (COG)"})]}),"\n",(0,n.jsx)(s.li,{children:"Open source license"}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"license",children:"License"}),"\n",(0,n.jsx)(s.p,{children:"Geoprocessing source code is licensed under a BSD 3-clause license and any reuse or modifications must retain this license with copyright notice."}),"\n",(0,n.jsxs)(s.p,{children:["Wiki docs, including any code snippets in tutorials, are licensed under a ",(0,n.jsx)("a",{rel:"license",href:"http://creativecommons.org/licenses/by-sa/4.0/",children:"Creative Commons Attribution-ShareAlike 4.0 International License"}),"."]}),"\n",(0,n.jsx)("a",{rel:"license",href:"http://creativecommons.org/licenses/by-sa/4.0/",children:(0,n.jsx)("img",{alt:"Creative Commons License",src:"https://i.creativecommons.org/l/by-sa/4.0/88x31.png"})}),"\n",(0,n.jsx)(s.h2,{id:"features",children:"Features"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"Cloud-native serverless architecture"}),"\n",(0,n.jsx)(s.li,{children:"Plug-and-play with SeaSketch platform"}),"\n",(0,n.jsxs)(s.li,{children:["End-to-end support and use of ",(0,n.jsx)(s.a,{href:"https://www.typescriptlang.org/",children:"Typescript"})]}),"\n",(0,n.jsx)(s.li,{children:"Project generator with templates and built-in commands for common project tasks"}),"\n",(0,n.jsxs)(s.li,{children:["Library of ",(0,n.jsx)(s.a,{href:"https://reactjs.org/",children:"React"})," UI components ready to add to reports."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://hub.docker.com/u/seasketch",children:"Docker workspace"})," preloaded with open source geo tools for data preparation."]}),"\n",(0,n.jsx)(s.li,{children:"Supports extended GeoJSON feature types called Sketches and SketchCollections suited to collaborative spatial planning"}),"\n",(0,n.jsxs)(s.li,{children:["Uses cloud-optimized techniques for storing and retrieving large datasets over a network including ",(0,n.jsx)(s.a,{href:"https://flatgeobuf.org/",children:"Flatgeobuf"}),", ",(0,n.jsx)(s.a,{href:"https://www.cogeo.org/",children:"Cloud-optimized GeoTIFFs (COGs)"}),", and ",(0,n.jsx)(s.a,{href:"https://github.com/seasketch/union-subdivided-polygons",children:"subdivision"}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["Toolbox of geoprocessing functions utilizing ",(0,n.jsx)(s.a,{href:"http://turfjs.org/",children:"Turf JS"}),", ",(0,n.jsx)(s.a,{href:"https://geoblaze.io/",children:"Geoblaze"}),", ",(0,n.jsx)(s.a,{href:"https://simplestatistics.org/",children:"Simple Statistics"}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["Cloud-native serverless architecture using ",(0,n.jsx)(s.a,{href:"https://aws.amazon.com/cloudformation/",children:"AWS Cloud Formation"}),", with automated provisioning and migration as a project evolves."]}),"\n",(0,n.jsx)(s.li,{children:"APIs for accessing project resources and integration including REST, Web Socket, and IFrame postMessage."}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"3rd-party-building-blocks",children:"3rd Party Building Blocks"}),"\n",(0,n.jsxs)(s.p,{children:["You will interact with a number of building blocks when creating a ",(0,n.jsx)(s.code,{children:"geoprocessing"})," project, many of which are 3rd party software and services. The main building blocks include:"]}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://github.com/seasketch/geoprocessing",children:"Github"})," - hosts the ",(0,n.jsx)(s.code,{children:"geoprocessing"})," code repository.  It's also the recommended place to host your geoprocessing project."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://www.npmjs.com/package/@seasketch/geoprocessing",children:"NPM"})," - the Node Package Manager or NPM, hosts the ",(0,n.jsx)(s.code,{children:"geoprocessing"})," Javascript package and allows it to be installed on your computer. It consists of an online repository for hosting Javascript packages, and a client library that is bundled with NodeJS on your local computer."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://nodejs.org/en/",children:"NodeJS"})," - an open source, cross-platform Javascript environment that allows Javascript code to be run on your computer.  The ",(0,n.jsx)(s.code,{children:"geoprocessing"})," framework is written almost entirely in Typescript, which is converted to Javascript.  Every time you run a geoprocessing command, NodeJS is what is used behind the scenes to execute it."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://hub.docker.com/repository/docker/seasketch",children:"Docker hub"})," - Docker Hub is a container image registry.  Container images are lightweight, standalone, executable packages of software that include everything needed to be self-sufficient: code, runtime, system tools, system libraries and settings.  Docker Hub publishes the ",(0,n.jsx)(s.code,{children:"geoprocessing"})," docker container images including ",(0,n.jsx)(s.code,{children:"geoprocessing-workspace"})," and ",(0,n.jsx)(s.code,{children:"geoprocessing-db"}),", which together provide a full suite of geospatial software needed by the geoprocessing framework, and that you can use for working with and publishing your geospatial data."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://www.docker.com/products/docker-desktop/",children:"Docker Desktop"})," - software used to create and run instances of the ",(0,n.jsx)(s.code,{children:"geoprocessing"})," container images on the users computer.  For Windows users, it also provides a way to install and run the geoprocessing framework within the Windows Subsystem for Linux (WSL)."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://code.visualstudio.com/",children:"VS Code"})," - provides an integrated development environment (IDE) for managing a geoprocessing project including code editing, command-line terminal, Github integration, and more."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://aws.amazon.com/what-is-aws/",children:"Amazon Web Service (AWS)"})," - AWS is the cloud service provider that ultimately hosts your geoprocessing project and integrates with a SeaSketch project to run reports on demand.  It provisions the necessary storage, compute and database infrastructure automatically using ",(0,n.jsx)(s.a,{href:"https://aws.amazon.com/cdk/",children:"CDK"}),"."]}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"known-limitations",children:"Known Limitations"}),"\n",(0,n.jsx)(s.h3,{id:"javascript-only",children:"Javascript-only"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["The current version of the library only supports spatial libraries written in Javascript.  This includes ",(0,n.jsx)(s.a,{href:"http://turfjs.org/",children:"Turf JS"}),", ",(0,n.jsx)(s.a,{href:"https://geoblaze.io/",children:"Geoblaze"}),", ",(0,n.jsx)(s.a,{href:"https://github.com/mapbox/cheap-ruler",children:"cheap-ruler"})," and anything else you can find.  There is discussion about supporting any analysis that can be packaged into a Docker container now that Lambda has ",(0,n.jsx)(s.a,{href:"https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/",children:"added container support"}),".  This will be done as need arises."]}),"\n"]}),"\n",(0,n.jsx)(s.h3,{id:"coordinate-system-support",children:"Coordinate System Support"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(s.p,{children:"Vector data, on import, is converted to WGS 84 (EPSG 4326).  Vector toolbox functions expect data to be in this projection."}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:["Raster data, on import, is converted to an equal area projection (NSIDC EASE-Grid 2.0 Global)[",(0,n.jsx)(s.a,{href:"https://epsg.io/6933",children:"https://epsg.io/6933"}),"].","  Raster toolbox functions should work with any grid-based projection but anything other than equal area will have accuract issues."]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(s.p,{children:"Geoprocessing functions in this library currently only support GeoJSON data in the World Geodetic System 1984 (WGS 84) [WGS84] datum (aka Lat/Lon), with longitude and latitude units of decimal degrees."}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(s.h3,{id:"calculation-error",children:"Calculation Error"}),"\n",(0,n.jsxs)(s.p,{children:["Since the data is spherical (WGS84), most toolbox functions in this library (particularly those that use ",(0,n.jsx)(s.a,{href:"http://turfjs.org/docs/#distance",children:"Turf.JS"}),") measure distance and area by approximating them on a sphere.  Algorithms are typically chosen that strike a balance between speed and accuracy."]}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"If the geographic area of your project is small, on the order of a few hundred to a thousand miles, and not at high latitudes, then error is relatively small."}),"\n",(0,n.jsx)(s.li,{children:"Reporting the percentage of an area is not subject to the error of the algorithm for calculating the area.  For example, if you write a function to calculate the % of a particular habitat captured by a polygon that overlaps the habitat, as long as the area of the total habitat, and the area overlapping the habitat are calculated using the same formula, then the percentage of the two should be the same as if it were calculated using a more accurate area formula."}),"\n"]}),"\n",(0,n.jsx)(s.p,{children:"Sources:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.a,{href:"https://blog.mapbox.com/fast-geodesic-approximations-with-cheap-ruler-106f229ad016",children:"Fast Geodesic Approximations"})}),"\n",(0,n.jsx)(s.li,{children:(0,n.jsx)(s.a,{href:"https://www.movable-type.co.uk/scripts/latlong.html",children:"Calculate distance, bearing and more between Latitude/Longitude points"})}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://en.wikipedia.org/wiki/Haversine_formula",children:"Haversine Formula on Wikipedia"}),".  Used by ",(0,n.jsx)(s.a,{href:"https://github.com/Turfjs/turf/tree/master/packages/turf-distance",children:"turf-distance"}),".  Error up to 0.5%"]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://sgp1.digitaloceanspaces.com/proletarian-library/books/5cc63c78dc09ee09864293f66e2716e2.pdf",children:"Some algorithms for polygons on a sphere"})," - used by ",(0,n.jsx)(s.a,{href:"http://turfjs.org/docs/#area",children:"turf-area"}),".  Greater error at higher latitudes vs. Vincenty."]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://en.wikipedia.org/wiki/Vincenty%27s_formulae",children:"Vincenty algorithm"})," used by ",(0,n.jsx)(s.a,{href:"https://github.com/Turfjs/turf-vincenty-inverse",children:"turf-vincenty-inverse"})]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.a,{href:"https://datatracker.ietf.org/doc/html/rfc7946#section-4",children:"GeoJSON spec WGS84 requirement"}),"."]}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"known-issues",children:"Known Issues"}),"\n",(0,n.jsx)(s.p,{children:"These are important to keep in mind when developing reports:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"If users cannot draw sketches on land, then Rasters must be clipped to land.  This is true for any place within the planning area that the user cannot draw."}),"\n",(0,n.jsx)(s.li,{children:"Holes should not be allowed in sketch polygons (such as via shapefile import), unless they are due to preprocessor clipping of non-eez areas like land."}),"\n"]}),"\n",(0,n.jsx)(s.p,{children:"The reason is because Geoblaze doesn\u2019t handle holes in polygons.  When given a polygon for overlap, like geoblaze.sum(raster, polygon) if it finds value within the hole, it will include it in the result (think sum) when it should exclude it.\nThe right solution is to add support to geoblaze.  In the interim a hack was done in the overlapRaster toolbox function to remove any holes from the sketch GeoJSON just prior to running a geoblaze.sum or geoblaze.histogram.\nSo if you allow the sketch have holes that should exclude raster value, that will not happen!  The toolbox function will just remove the holes and happily include any raster value that is there."}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:['When working with VectorDatasources, requesting a union of subdivided eez polygons will occasionally throw a "looping" error - see ',(0,n.jsx)(s.a,{href:"https://github.com/seasketch/geoprocessing/issues/72",children:"https://github.com/seasketch/geoprocessing/issues/72"})," and ",(0,n.jsx)(s.a,{href:"https://github.com/seasketch/union-subdivided-polygons/issues/5",children:"https://github.com/seasketch/union-subdivided-polygons/issues/5"}),".  It is not recommended to use unionProperty with the EEZ datasource, unless you thoroughly test with the country you are working with.  In practice this is not necessary anyway unless you are working with a complex EEZ boundary."]}),"\n"]})]})}function d(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},8453:(e,s,t)=>{t.d(s,{R:()=>r,x:()=>a});var n=t(6540);const i={},o=n.createContext(i);function r(e){const s=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),n.createElement(o.Provider,{value:s},e.children)}}}]);