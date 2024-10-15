"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[68777],{34232:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var l=t(74848),r=t(28453);const a={},i="ClassTableColumnConfig",s={id:"api/client-ui/interfaces/ClassTableColumnConfig",title:"ClassTableColumnConfig",description:"Properties",source:"@site/docs/api/client-ui/interfaces/ClassTableColumnConfig.md",sourceDirName:"api/client-ui/interfaces",slug:"/api/client-ui/interfaces/ClassTableColumnConfig",permalink:"/geoprocessing/docs/next/api/client-ui/interfaces/ClassTableColumnConfig",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/client-ui/interfaces/ClassTableColumnConfig.md",tags:[],version:"current",frontMatter:{}},o={},c=[{value:"Properties",id:"properties",level:2},{value:"chartOptions?",id:"chartoptions",level:3},{value:"colStyle?",id:"colstyle",level:3},{value:"columnLabel?",id:"columnlabel",level:3},{value:"metricId?",id:"metricid",level:3},{value:"percentFormatterOptions?",id:"percentformatteroptions",level:3},{value:"targetValueFormatter?",id:"targetvalueformatter",level:3},{value:"type",id:"type",level:3},{value:"valueFormatter?",id:"valueformatter",level:3},{value:"valueLabel?",id:"valuelabel",level:3},{value:"width?",id:"width",level:3}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.header,{children:(0,l.jsx)(n.h1,{id:"classtablecolumnconfig",children:"ClassTableColumnConfig"})}),"\n",(0,l.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,l.jsx)(n.h3,{id:"chartoptions",children:"chartOptions?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional chartOptions: Partial<HorizontalStackedBarProps>;\n"})}),"\n",(0,l.jsx)(n.p,{children:"override options for metricChart column type"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"colstyle",children:"colStyle?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional colStyle: CSSProperties;\n"})}),"\n",(0,l.jsx)(n.p,{children:"additional style properties for column"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"columnlabel",children:"columnLabel?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional columnLabel: string;\n"})}),"\n",(0,l.jsx)(n.p,{children:"column header label"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"metricid",children:"metricId?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional metricId: string;\n"})}),"\n",(0,l.jsx)(n.p,{children:"metricId to use for column - metricGoal will access its values via the metricGroup"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"percentformatteroptions",children:"percentFormatterOptions?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional percentFormatterOptions: PercentEdgeOptions;\n"})}),"\n",(0,l.jsx)(n.p,{children:"config options for percent value formatting.  see percentWithEdge function for more details"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"targetvalueformatter",children:"targetValueFormatter?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional targetValueFormatter: TargetFormatter;\n"})}),"\n",(0,l.jsx)(n.p,{children:"formatting of target value based on the location of the row in the table"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"type",children:"type"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:'type: \n  | "class"\n  | "metricValue"\n  | "metricChart"\n  | "metricGoal"\n  | "layerToggle";\n'})}),"\n",(0,l.jsx)(n.p,{children:"column display type"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"valueformatter",children:"valueFormatter?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional valueFormatter: ValueFormatter;\n"})}),"\n",(0,l.jsx)(n.p,{children:"formatting to apply to values in column row, defaults to as-is 'value' formatting."}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"valuelabel",children:"valueLabel?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional valueLabel: string | (value) => string;\n"})}),"\n",(0,l.jsx)(n.p,{children:"unit string to display after value, or a format function that is passed the row value"}),"\n",(0,l.jsx)(n.hr,{}),"\n",(0,l.jsx)(n.h3,{id:"width",children:"width?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"optional width: number;\n"})}),"\n",(0,l.jsx)(n.p,{children:"column percent width out of 100"})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>s});var l=t(96540);const r={},a=l.createContext(r);function i(e){const n=l.useContext(a);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),l.createElement(a.Provider,{value:n},e.children)}}}]);