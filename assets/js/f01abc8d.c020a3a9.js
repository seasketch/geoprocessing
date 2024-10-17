"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8242],{23131:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>c,metadata:()=>i,toc:()=>l});var t=r(74848),n=r(28453);const c={},o="overlapRaster()",i={id:"api/geoprocessing/functions/overlapRaster",title:"~~overlapRaster()~~",description:"Returns metrics representing sketch overlap with raster.",source:"@site/docs/api/geoprocessing/functions/overlapRaster.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/overlapRaster",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/overlapRaster",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/overlapRaster.md",tags:[],version:"current",frontMatter:{}},d={},l=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Deprecated",id:"deprecated",level:2}];function a(e){const s={a:"a",code:"code",del:"del",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"overlapraster",children:(0,t.jsx)(s.del,{children:"overlapRaster()"})})}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ts",children:"function overlapRaster(\n   metricId, \n   raster, \n   sketch, \noptions?): Promise<Metric[]>\n"})}),"\n",(0,t.jsx)(s.p,{children:"Returns metrics representing sketch overlap with raster.\nIf sketch collection, then calculate overlap for all child sketches also"}),"\n",(0,t.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:"Parameter"}),(0,t.jsx)(s.th,{children:"Type"}),(0,t.jsx)(s.th,{children:"Description"})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"metricId"})}),(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"string"})}),(0,t.jsx)(s.td,{children:"metricId value to assign to each measurement"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"raster"})}),(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"Georaster"})}),(0,t.jsx)(s.td,{children:"Cloud-optimized geotiff to calculate overlap with, loaded via loadCog or geoblaze.parse()"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"sketch"})}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/SketchCollection",children:(0,t.jsx)(s.code,{children:"SketchCollection"})}),"<",(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Polygon",children:(0,t.jsx)(s.code,{children:"Polygon"})})," | ",(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/MultiPolygon",children:(0,t.jsx)(s.code,{children:"MultiPolygon"})}),"> | ",(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Sketch",children:(0,t.jsx)(s.code,{children:"Sketch"})}),"<",(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Polygon",children:(0,t.jsx)(s.code,{children:"Polygon"})})," | ",(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/MultiPolygon",children:(0,t.jsx)(s.code,{children:"MultiPolygon"})}),">"]}),(0,t.jsx)(s.td,{children:"single sketch or collection to calculate metrics for."})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.code,{children:"options"}),"?"]}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.code,{children:"Partial"}),"<",(0,t.jsx)(s.code,{children:"OverlapRasterOptions"}),">"]}),(0,t.jsx)(s.td,{children:"-"})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,t.jsxs)(s.p,{children:[(0,t.jsx)(s.code,{children:"Promise"}),"<",(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/Metric",children:(0,t.jsx)(s.code,{children:"Metric"})}),"[]>"]}),"\n",(0,t.jsx)(s.h2,{id:"deprecated",children:"Deprecated"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsx)(s.li,{children:"switch to overlapRasterSum"}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},28453:(e,s,r)=>{r.d(s,{R:()=>o,x:()=>i});var t=r(96540);const n={},c=t.createContext(n);function o(e){const s=t.useContext(c);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),t.createElement(c.Provider,{value:s},e.children)}}}]);