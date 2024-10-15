"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[27375],{75611:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>t,metadata:()=>o,toc:()=>l});var n=r(74848),c=r(28453);const t={},i="overlapRasterClass()",o={id:"api/geoprocessing/functions/overlapRasterClass",title:"overlapRasterClass()",description:"Calculates sum of overlap between sketches and a categorical raster with numeric values representing feature classes",source:"@site/docs/api/geoprocessing/functions/overlapRasterClass.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/overlapRasterClass",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/overlapRasterClass",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/overlapRasterClass.md",tags:[],version:"current",frontMatter:{}},d={},l=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function a(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,c.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"overlaprasterclass",children:"overlapRasterClass()"})}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"function overlapRasterClass(\n   metricId, \n   raster, \n   sketch, \n   mapping, \nmetricCategoryDimension): Promise<Metric[]>\n"})}),"\n",(0,n.jsx)(s.p,{children:"Calculates sum of overlap between sketches and a categorical raster with numeric values representing feature classes\nIf sketch collection, then calculate overlap for all child sketches also"}),"\n",(0,n.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Default value"}),(0,n.jsx)(s.th,{children:"Description"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"metricId"})}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"string"})}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"undefined"})}),(0,n.jsx)(s.td,{children:"metricId value to assign to each measurement"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"raster"})}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Georaster",children:(0,n.jsx)(s.code,{children:"Georaster"})})}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"undefined"})}),(0,n.jsx)(s.td,{children:"Cloud-optimized geotiff, loaded via loadCog or geoblaze.parse(), representing categorical data (multiple classes)"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"sketch"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"undefined"})," | ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/SketchCollection",children:(0,n.jsx)(s.code,{children:"SketchCollection"})}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Polygon",children:(0,n.jsx)(s.code,{children:"Polygon"})})," | ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/MultiPolygon",children:(0,n.jsx)(s.code,{children:"MultiPolygon"})}),"> | ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Sketch",children:(0,n.jsx)(s.code,{children:"Sketch"})}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Polygon",children:(0,n.jsx)(s.code,{children:"Polygon"})})," | ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/MultiPolygon",children:(0,n.jsx)(s.code,{children:"MultiPolygon"})}),">"]}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"undefined"})}),(0,n.jsx)(s.td,{children:"single sketch or collection. If undefined will return sum by feature class for the whole raster. Supports polygon or multipolygon. Will remove overlap between sketches, but will not remove overlap within Multipolygon sketch"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"mapping"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"Record"}),"<",(0,n.jsx)(s.code,{children:"string"}),", ",(0,n.jsx)(s.code,{children:"string"}),">"]}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"undefined"})}),(0,n.jsx)(s.td,{children:'Object mapping numeric category IDs (as strings e.g. "1") in the raster to their string names for display e.g. "Coral Reef"'})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"metricCategoryDimension"})}),(0,n.jsxs)(s.td,{children:["| ",(0,n.jsx)(s.code,{children:'"classId"'})," | ",(0,n.jsx)(s.code,{children:'"metricId"'})," | ",(0,n.jsx)(s.code,{children:'"geographyId"'})," | ",(0,n.jsx)(s.code,{children:'"sketchId"'})," | ",(0,n.jsx)(s.code,{children:'"groupId"'})]}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:'"classId"'})}),(0,n.jsx)(s.td,{children:"Dimension to assign category name when creating metrics, defaults to classId"})]})]})]}),"\n",(0,n.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"Promise"}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/Metric",children:(0,n.jsx)(s.code,{children:"Metric"})}),"[]>"]})]})}function h(e={}){const{wrapper:s}={...(0,c.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},28453:(e,s,r)=>{r.d(s,{R:()=>i,x:()=>o});var n=r(96540);const c={},t=n.createContext(c);function i(e){const s=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function o(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),n.createElement(t.Provider,{value:s},e.children)}}}]);