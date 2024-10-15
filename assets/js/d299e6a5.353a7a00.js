"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[47420],{67674:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>a});var r=t(74848),n=t(28453);const i={},c="nestMetrics()",d={id:"api/geoprocessing/functions/nestMetrics",title:"nestMetrics()",description:"Recursively groups metrics by ID in order of ids specified to create arbitrary nested hierarchy for fast lookup.",source:"@site/docs/api/geoprocessing/functions/nestMetrics.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/nestMetrics",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/nestMetrics",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/nestMetrics.md",tags:[],version:"current",frontMatter:{}},o={},a=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function l(e){const s={code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.header,{children:(0,r.jsx)(s.h1,{id:"nestmetrics",children:"nestMetrics()"})}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"function nestMetrics(metrics, ids): Record<string, any>\n"})}),"\n",(0,r.jsx)(s.p,{children:"Recursively groups metrics by ID in order of ids specified to create arbitrary nested hierarchy for fast lookup.\nCaller responsible for all metrics having the ID properties defined\nIf an id property is not defined on a metric, then 'undefined' will be used for the key"}),"\n",(0,r.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{children:"Parameter"}),(0,r.jsx)(s.th,{children:"Type"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"metrics"})}),(0,r.jsxs)(s.td,{children:[(0,r.jsx)(s.code,{children:"object"}),"[]"]})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"ids"})}),(0,r.jsxs)(s.td,{children:["( | ",(0,r.jsx)(s.code,{children:'"classId"'})," | ",(0,r.jsx)(s.code,{children:'"metricId"'})," | ",(0,r.jsx)(s.code,{children:'"geographyId"'})," | ",(0,r.jsx)(s.code,{children:'"sketchId"'})," | ",(0,r.jsx)(s.code,{children:'"groupId"'}),")[]"]})]})]})]}),"\n",(0,r.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.code,{children:"Record"}),"<",(0,r.jsx)(s.code,{children:"string"}),", ",(0,r.jsx)(s.code,{children:"any"}),">"]})]})}function h(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},28453:(e,s,t)=>{t.d(s,{R:()=>c,x:()=>d});var r=t(96540);const n={},i=r.createContext(n);function c(e){const s=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:c(e.components),r.createElement(i.Provider,{value:s},e.children)}}}]);