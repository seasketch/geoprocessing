"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[22166],{37251:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>l,frontMatter:()=>c,metadata:()=>o,toc:()=>a});var n=r(74848),s=r(28453);const c={},i="toPercentMetric()",o={id:"api/geoprocessing/functions/toPercentMetric",title:"toPercentMetric()",description:"Matches numerator metrics with denominator metrics and divides their value,",source:"@site/docs/api/geoprocessing/functions/toPercentMetric.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/toPercentMetric",permalink:"/geoprocessing/docs/api/geoprocessing/functions/toPercentMetric",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/toPercentMetric.md",tags:[],version:"current",frontMatter:{}},d={},a=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function h(e){const t={code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"topercentmetric",children:"toPercentMetric()"})}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"function toPercentMetric(\n   numerators, \n   denominators, \n   options): object[]\n"})}),"\n",(0,n.jsx)(t.p,{children:"Matches numerator metrics with denominator metrics and divides their value,\nreturning a new array of percent metrics.  If denominator metric has value of 0, returns NaN\nMatches on the optional idProperty given, otherwise defaulting to classId\nDeep copies and maintains all other properties from the numerator metric"}),"\n",(0,n.jsx)(t.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{children:"Parameter"}),(0,n.jsx)(t.th,{children:"Type"}),(0,n.jsx)(t.th,{children:"Description"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"numerators"})}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"object"}),"[]"]}),(0,n.jsx)(t.td,{children:"array of metrics, to be used as numerators (often sketch metrics)"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"denominators"})}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"object"}),"[]"]}),(0,n.jsx)(t.td,{children:"array of metrics, to be used as denominators (often planning region metrics)"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"options"})}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"object"})}),(0,n.jsx)(t.td,{children:"-"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"options.debug"}),"?"]}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"boolean"})}),(0,n.jsx)(t.td,{children:"-"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"options.idProperty"}),"?"]}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"string"})}),(0,n.jsx)(t.td,{children:"-"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"options.metricIdOverride"}),"?"]}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"string"})}),(0,n.jsx)(t.td,{children:"-"})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.code,{children:"object"}),"[]"]}),"\n",(0,n.jsx)(t.p,{children:"Metric[] of percent values"})]})}function l(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},28453:(e,t,r)=>{r.d(t,{R:()=>i,x:()=>o});var n=r(96540);const s={},c=n.createContext(s);function i(e){const t=n.useContext(c);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),n.createElement(c.Provider,{value:t},e.children)}}}]);