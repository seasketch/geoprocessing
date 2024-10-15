"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8489],{62961:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>c,toc:()=>d});var r=s(74848),n=s(28453);const a={},o="rasterStats()",c={id:"api/geoprocessing/functions/rasterStats",title:"rasterStats()",description:"Calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature.",source:"@site/docs/api/geoprocessing/functions/rasterStats.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/rasterStats",permalink:"/geoprocessing/docs/api/geoprocessing/functions/rasterStats",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/rasterStats.md",tags:[],version:"current",frontMatter:{}},i={},d=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"rasterstats",children:"rasterStats()"})}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",children:"function rasterStats(raster, options): Promise<StatsObject[]>\n"})}),"\n",(0,r.jsx)(t.p,{children:"Calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature.\nDefaults to calculating only sum stat\nIf no cells found, returns 0 or null value for each stat as appropriate."}),"\n",(0,r.jsx)(t.h2,{id:"parameters",children:"Parameters"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Parameter"}),(0,r.jsx)(t.th,{children:"Type"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"raster"})}),(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"Georaster"})})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"options"})}),(0,r.jsx)(t.td,{children:(0,r.jsx)(t.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/RasterStatsOptions",children:(0,r.jsx)(t.code,{children:"RasterStatsOptions"})})})]})]})]}),"\n",(0,r.jsx)(t.h2,{id:"returns",children:"Returns"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"Promise"}),"<",(0,r.jsx)(t.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/StatsObject",children:(0,r.jsx)(t.code,{children:"StatsObject"})}),"[]>"]})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},28453:(e,t,s)=>{s.d(t,{R:()=>o,x:()=>c});var r=s(96540);const n={},a=r.createContext(n);function o(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),r.createElement(a.Provider,{value:t},e.children)}}}]);