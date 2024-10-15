"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[13829],{76845:(e,s,c)=>{c.r(s),c.d(s,{assets:()=>o,contentTitle:()=>a,default:()=>p,frontMatter:()=>r,metadata:()=>t,toc:()=>d});var n=c(74848),i=c(28453);const r={},a="metricGroupSchema",t={id:"api/geoprocessing/variables/metricGroupSchema",title:"metricGroupSchema",description:"Defines a metric in combination with a datasource, with one or more data classes",source:"@site/docs/api/geoprocessing/variables/metricGroupSchema.md",sourceDirName:"api/geoprocessing/variables",slug:"/api/geoprocessing/variables/metricGroupSchema",permalink:"/geoprocessing/docs/next/api/geoprocessing/variables/metricGroupSchema",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/variables/metricGroupSchema.md",tags:[],version:"current",frontMatter:{}},o={},d=[{value:"Type declaration",id:"type-declaration",level:2},{value:"classes",id:"classes",level:3},{value:"classKey",id:"classkey",level:3},{value:"datasourceId",id:"datasourceid",level:3},{value:"layerId",id:"layerid",level:3},{value:"metricId",id:"metricid",level:3},{value:"objectiveId",id:"objectiveid",level:3},{value:"type",id:"type",level:3}];function l(e){const s={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"metricgroupschema",children:"metricGroupSchema"})}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:'const metricGroupSchema: ZodObject<object, "strip", ZodTypeAny, object, object>;\n'})}),"\n",(0,n.jsx)(s.p,{children:"Defines a metric in combination with a datasource, with one or more data classes"}),"\n",(0,n.jsx)(s.h2,{id:"type-declaration",children:"Type declaration"}),"\n",(0,n.jsx)(s.h3,{id:"classes",children:"classes"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:'classes: ZodArray<ZodObject<object, "strip", ZodTypeAny, object, object>, "many">;\n'})}),"\n",(0,n.jsx)(s.p,{children:"data classes used by group"}),"\n",(0,n.jsx)(s.h3,{id:"classkey",children:"classKey"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"classKey: ZodOptional<ZodString>;\n"})}),"\n",(0,n.jsx)(s.p,{children:"Optional datasource class key used to source classIds"}),"\n",(0,n.jsx)(s.h3,{id:"datasourceid",children:"datasourceId"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"datasourceId: ZodOptional<ZodString>;\n"})}),"\n",(0,n.jsx)(s.p,{children:"Datasource to generate metrics from"}),"\n",(0,n.jsx)(s.h3,{id:"layerid",children:"layerId"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"layerId: ZodOptional<ZodString>;\n"})}),"\n",(0,n.jsx)(s.p,{children:"Optional ID of map layer associated with this metric"}),"\n",(0,n.jsx)(s.h3,{id:"metricid",children:"metricId"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"metricId: ZodString;\n"})}),"\n",(0,n.jsx)(s.p,{children:"Unique id of metric in project"}),"\n",(0,n.jsx)(s.h3,{id:"objectiveid",children:"objectiveId"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"objectiveId: ZodOptional<ZodString>;\n"})}),"\n",(0,n.jsx)(s.p,{children:"group level objective, applies to all classes"}),"\n",(0,n.jsx)(s.h3,{id:"type",children:"type"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"type: ZodString;\n"})}),"\n",(0,n.jsx)(s.p,{children:"Metric type"})]})}function p(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},28453:(e,s,c)=>{c.d(s,{R:()=>a,x:()=>t});var n=c(96540);const i={},r=n.createContext(i);function a(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);