"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[47419],{49557:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>o,contentTitle:()=>n,default:()=>a,frontMatter:()=>i,metadata:()=>d,toc:()=>l});var s=r(74848),c=r(28453);const i={},n="getMetricGroupObjectiveIds()",d={id:"api/geoprocessing/functions/getMetricGroupObjectiveIds",title:"getMetricGroupObjectiveIds()",description:"Returns array of all objective IDs configured for the given MetricGroup.",source:"@site/docs/api/geoprocessing/functions/getMetricGroupObjectiveIds.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/getMetricGroupObjectiveIds",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/getMetricGroupObjectiveIds",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/getMetricGroupObjectiveIds.md",tags:[],version:"current",frontMatter:{}},o={},l=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function h(e){const t={code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,c.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"getmetricgroupobjectiveids",children:"getMetricGroupObjectiveIds()"})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"function getMetricGroupObjectiveIds(metricGroup): string[]\n"})}),"\n",(0,s.jsx)(t.p,{children:"Returns array of all objective IDs configured for the given MetricGroup.\nIf a class does not have an objectiveId assigned, then it gets the top-level\nobjectiveId"}),"\n",(0,s.jsx)(t.h2,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Parameter"}),(0,s.jsx)(t.th,{children:"Type"}),(0,s.jsx)(t.th,{children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"metricGroup"})}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"object"})}),(0,s.jsx)(t.td,{children:"-"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"metricGroup.classes"})}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.code,{children:"object"}),"[]"]}),(0,s.jsx)(t.td,{children:"data classes used by group"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.code,{children:"metricGroup.classKey"}),"?"]}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{children:"Optional datasource class key used to source classIds"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.code,{children:"metricGroup.datasourceId"}),"?"]}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{children:"Datasource to generate metrics from"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.code,{children:"metricGroup.layerId"}),"?"]}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{children:"Optional ID of map layer associated with this metric"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"metricGroup.metricId"})}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{children:"Unique id of metric in project"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.code,{children:"metricGroup.objectiveId"}),"?"]}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{children:"group level objective, applies to all classes"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"metricGroup.type"})}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.code,{children:"string"})}),(0,s.jsx)(t.td,{children:"Metric type"})]})]})]}),"\n",(0,s.jsx)(t.h2,{id:"returns",children:"Returns"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.code,{children:"string"}),"[]"]})]})}function a(e={}){const{wrapper:t}={...(0,c.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},28453:(e,t,r)=>{r.d(t,{R:()=>n,x:()=>d});var s=r(96540);const c={},i=s.createContext(c);function n(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:n(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);