"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6334],{53961:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>a});var n=r(74848),s=r(28453);const i={},c="fgbFetchAll()",d={id:"api/dataproviders/functions/fgbFetchAll",title:"fgbFetchAll()",description:"Fetch features within bounding box and deserializes them, awaiting all of them before returning.",source:"@site/docs/api/dataproviders/functions/fgbFetchAll.md",sourceDirName:"api/dataproviders/functions",slug:"/api/dataproviders/functions/fgbFetchAll",permalink:"/geoprocessing/docs/next/api/dataproviders/functions/fgbFetchAll",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/dataproviders/functions/fgbFetchAll.md",tags:[],version:"current",frontMatter:{}},o={},a=[{value:"Type Parameters",id:"type-parameters",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function l(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"fgbfetchall",children:"fgbFetchAll()"})}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"function fgbFetchAll<F>(url, box?): Promise<F[]>\n"})}),"\n",(0,n.jsx)(t.p,{children:"Fetch features within bounding box and deserializes them, awaiting all of them before returning.\nUseful when running a spatial function on the whole set is faster than running\none at a time as the deserialize generator provides them"}),"\n",(0,n.jsx)(t.h2,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsx)(t.tr,{children:(0,n.jsx)(t.th,{children:"Type Parameter"})})}),(0,n.jsx)(t.tbody,{children:(0,n.jsx)(t.tr,{children:(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"F"})," ",(0,n.jsx)(t.em,{children:"extends"})," ",(0,n.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(t.code,{children:"Feature"})}),"<",(0,n.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(t.code,{children:"Geometry"})}),", ",(0,n.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(t.code,{children:"GeoJsonProperties"})}),">"]})})})]}),"\n",(0,n.jsx)(t.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{children:"Parameter"}),(0,n.jsx)(t.th,{children:"Type"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"url"})}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.code,{children:"string"})})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"box"}),"?"]}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/BBox",children:(0,n.jsx)(t.code,{children:"BBox"})})})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.code,{children:"Promise"}),"<",(0,n.jsx)(t.code,{children:"F"}),"[]>"]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},28453:(e,t,r)=>{r.d(t,{R:()=>c,x:()=>d});var n=r(96540);const s={},i=n.createContext(s);function c(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);