"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[13618],{91757:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>l,contentTitle:()=>n,default:()=>o,frontMatter:()=>t,metadata:()=>d,toc:()=>h});var c=r(74848),i=r(28453);const t={},n="mpaClassMetric()",d={id:"api/geoprocessing/functions/mpaClassMetric",title:"mpaClassMetric()",description:"Given sketch for rbcsMpa with rbcs activity userAttributes,",source:"@site/docs/api/geoprocessing/functions/mpaClassMetric.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/mpaClassMetric",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/mpaClassMetric",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/mpaClassMetric.md",tags:[],version:"current",frontMatter:{}},l={},h=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function a(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(s.header,{children:(0,c.jsx)(s.h1,{id:"mpaclassmetric",children:"mpaClassMetric()"})}),"\n",(0,c.jsx)(s.pre,{children:(0,c.jsx)(s.code,{className:"language-ts",children:"function mpaClassMetric(sketch, childAreaMetric): RegBasedClassificationMetric[]\n"})}),"\n",(0,c.jsx)(s.p,{children:"Given sketch for rbcsMpa with rbcs activity userAttributes,\nassumes mpa is a single zone mpa and returns metrics with mpa classification score"}),"\n",(0,c.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,c.jsxs)(s.table,{children:[(0,c.jsx)(s.thead,{children:(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.th,{children:"Parameter"}),(0,c.jsx)(s.th,{children:"Type"}),(0,c.jsx)(s.th,{children:"Description"})]})}),(0,c.jsxs)(s.tbody,{children:[(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"sketch"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/NullSketch",children:(0,c.jsx)(s.code,{children:"NullSketch"})})}),(0,c.jsx)(s.td,{children:"sketch with GEAR_TYPES (multi), BOATING (single), and AQUACULTURE (single) user attributes"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"childAreaMetric"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"object"})}),(0,c.jsx)(s.td,{children:"area metric for sketch"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"childAreaMetric.classId"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"null"})," | ",(0,c.jsx)(s.code,{children:"string"})]}),(0,c.jsx)(s.td,{children:"-"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"childAreaMetric.extra"}),"?"]}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"Record"}),"<",(0,c.jsx)(s.code,{children:"string"}),", ",(0,c.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/JSONValue",children:(0,c.jsx)(s.code,{children:"JSONValue"})}),">"]}),(0,c.jsx)(s.td,{children:"-"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"childAreaMetric.geographyId"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"null"})," | ",(0,c.jsx)(s.code,{children:"string"})]}),(0,c.jsx)(s.td,{children:"-"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"childAreaMetric.groupId"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"null"})," | ",(0,c.jsx)(s.code,{children:"string"})]}),(0,c.jsx)(s.td,{children:"-"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"childAreaMetric.metricId"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"string"})}),(0,c.jsx)(s.td,{children:"-"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"childAreaMetric.sketchId"})}),(0,c.jsxs)(s.td,{children:[(0,c.jsx)(s.code,{children:"null"})," | ",(0,c.jsx)(s.code,{children:"string"})]}),(0,c.jsx)(s.td,{children:"-"})]}),(0,c.jsxs)(s.tr,{children:[(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"childAreaMetric.value"})}),(0,c.jsx)(s.td,{children:(0,c.jsx)(s.code,{children:"number"})}),(0,c.jsx)(s.td,{children:"-"})]})]})]}),"\n",(0,c.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,c.jsxs)(s.p,{children:[(0,c.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/RegBasedClassificationMetric",children:(0,c.jsx)(s.code,{children:"RegBasedClassificationMetric"})}),"[]"]})]})}function o(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,c.jsx)(s,{...e,children:(0,c.jsx)(a,{...e})}):a(e)}},28453:(e,s,r)=>{r.d(s,{R:()=>n,x:()=>d});var c=r(96540);const i={},t=c.createContext(i);function n(e){const s=c.useContext(t);return c.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:n(e.components),c.createElement(t.Provider,{value:s},e.children)}}}]);