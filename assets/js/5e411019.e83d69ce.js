"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[99609],{9501:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>d,contentTitle:()=>c,default:()=>h,frontMatter:()=>n,metadata:()=>i,toc:()=>l});var t=s(74848),o=s(28453);const n={},c="overlapFeaturesGroupMetrics()",i={id:"api/geoprocessing/functions/overlapFeaturesGroupMetrics",title:"overlapFeaturesGroupMetrics()",description:"Generate overlap group metrics using overlapFeatures operation",source:"@site/docs/api/geoprocessing/functions/overlapFeaturesGroupMetrics.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/overlapFeaturesGroupMetrics",permalink:"/geoprocessing/docs/api/geoprocessing/functions/overlapFeaturesGroupMetrics",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/overlapFeaturesGroupMetrics.md",tags:[],version:"current",frontMatter:{}},d={},l=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function a(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.header,{children:(0,t.jsx)(r.h1,{id:"overlapfeaturesgroupmetrics",children:"overlapFeaturesGroupMetrics()"})}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-ts",children:"function overlapFeaturesGroupMetrics(options): Promise<Metric[]>\n"})}),"\n",(0,t.jsx)(r.p,{children:"Generate overlap group metrics using overlapFeatures operation"}),"\n",(0,t.jsx)(r.h2,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsxs)(r.table,{children:[(0,t.jsx)(r.thead,{children:(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.th,{children:"Parameter"}),(0,t.jsx)(r.th,{children:"Type"}),(0,t.jsx)(r.th,{children:"Description"})]})}),(0,t.jsxs)(r.tbody,{children:[(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"options"})}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"object"})}),(0,t.jsx)(r.td,{children:"-"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"options.featuresByClass"})}),(0,t.jsxs)(r.td,{children:[(0,t.jsx)(r.code,{children:"Record"}),"<",(0,t.jsx)(r.code,{children:"string"}),", ",(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,t.jsx)(r.code,{children:"Feature"})}),"<",(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Polygon",children:(0,t.jsx)(r.code,{children:"Polygon"})}),", ",(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,t.jsx)(r.code,{children:"GeoJsonProperties"})}),">[]>"]}),(0,t.jsx)(r.td,{children:"features to overlap, keyed by class ID, use empty array if overlapArea operation"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"options.groupIds"})}),(0,t.jsxs)(r.td,{children:[(0,t.jsx)(r.code,{children:"string"}),"[]"]}),(0,t.jsx)(r.td,{children:"Group identifiers - will generate group metric for each, even if result in zero value, so pre-filter if want to limit"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"options.metricId"})}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"string"})}),(0,t.jsx)(r.td,{children:"Caller-provided metric ID"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"options.metrics"})}),(0,t.jsxs)(r.td,{children:[(0,t.jsx)(r.code,{children:"object"}),"[]"]}),(0,t.jsx)(r.td,{children:"The metrics to group"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"options.metricToGroup"})}),(0,t.jsxs)(r.td,{children:["(",(0,t.jsx)(r.code,{children:"sketchMetric"}),") => ",(0,t.jsx)(r.code,{children:"string"})]}),(0,t.jsx)(r.td,{children:"Function that given sketch metric and group name, returns true if sketch is in the group, otherwise false"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsxs)(r.td,{children:[(0,t.jsx)(r.code,{children:"options.onlyPresentGroups"}),"?"]}),(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"boolean"})}),(0,t.jsx)(r.td,{children:"only generate metrics for groups that sketches match to, rather than all"})]}),(0,t.jsxs)(r.tr,{children:[(0,t.jsx)(r.td,{children:(0,t.jsx)(r.code,{children:"options.sketch"})}),(0,t.jsxs)(r.td,{children:[(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Sketch",children:(0,t.jsx)(r.code,{children:"Sketch"})}),"<",(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Polygon",children:(0,t.jsx)(r.code,{children:"Polygon"})}),"> | ",(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/SketchCollection",children:(0,t.jsx)(r.code,{children:"SketchCollection"})}),"<",(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Polygon",children:(0,t.jsx)(r.code,{children:"Polygon"})}),">"]}),(0,t.jsx)(r.td,{children:"Sketch - single or collection"})]})]})]}),"\n",(0,t.jsx)(r.h2,{id:"returns",children:"Returns"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.code,{children:"Promise"}),"<",(0,t.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Metric",children:(0,t.jsx)(r.code,{children:"Metric"})}),"[]>"]})]})}function h(e={}){const{wrapper:r}={...(0,o.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},28453:(e,r,s)=>{s.d(r,{R:()=>c,x:()=>i});var t=s(96540);const o={},n=t.createContext(o);function c(e){const r=t.useContext(n);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),t.createElement(n.Provider,{value:r},e.children)}}}]);