"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[48589],{23450:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>i,contentTitle:()=>o,default:()=>h,frontMatter:()=>c,metadata:()=>l,toc:()=>a});var n=t(74848),r=t(28453);const c={},o="flattenByGroupAllClass()",l={id:"api/geoprocessing/functions/flattenByGroupAllClass",title:"flattenByGroupAllClass()",description:"Aggregates metrics by group",source:"@site/docs/api/geoprocessing/functions/flattenByGroupAllClass.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/flattenByGroupAllClass",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/flattenByGroupAllClass",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/flattenByGroupAllClass.md",tags:[],version:"current",frontMatter:{}},i={},a=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function d(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"flattenbygroupallclass",children:"flattenByGroupAllClass()"})}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"function flattenByGroupAllClass(\n   collection, \n   groupMetrics, \n   totalMetrics): object[]\n"})}),"\n",(0,n.jsx)(s.p,{children:"Aggregates metrics by group"}),"\n",(0,n.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Description"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"collection"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/NullSketchCollection",children:(0,n.jsx)(s.code,{children:"NullSketchCollection"})})," | ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/SketchCollection",children:(0,n.jsx)(s.code,{children:"SketchCollection"})}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/SketchGeometryTypes",children:(0,n.jsx)(s.code,{children:"SketchGeometryTypes"})}),">"]}),(0,n.jsx)(s.td,{children:"sketch collection metrics are for"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"groupMetrics"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"object"}),"[]"]}),(0,n.jsx)(s.td,{children:"metrics with assigned groupId (except group total metric) and sketchIds for collection"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"totalMetrics"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"object"}),"[]"]}),(0,n.jsx)(s.td,{children:"totals by class"})]})]})]}),"\n",(0,n.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"object"}),"[]"]}),"\n",(0,n.jsx)(s.p,{children:"one aggregate object for every groupId present in metrics.  Each object includes:\n[numSketches] - count of child sketches in the group\n[classId] - a percValue for each classId present in metrics for group\n[value] - sum of value across all classIds present in metrics for group\n[percValue] - given sum value across all classIds, contains ratio of total sum across all class IDs"})]})}function h(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},28453:(e,s,t)=>{t.d(s,{R:()=>o,x:()=>l});var n=t(96540);const r={},c=n.createContext(r);function o(e){const s=n.useContext(c);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(c.Provider,{value:s},e.children)}}}]);