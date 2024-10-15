"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[34761],{2322:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>c,contentTitle:()=>d,default:()=>p,frontMatter:()=>i,metadata:()=>o,toc:()=>a});var n=s(74848),t=s(28453);const i={},d="booleanOverlap()",o={id:"api/geoprocessing/functions/booleanOverlap",title:"booleanOverlap()",description:"booleanOverlap(featureAInput, featureBInput, idProperty)",source:"@site/docs/api/geoprocessing/functions/booleanOverlap.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/booleanOverlap",permalink:"/geoprocessing/docs/api/geoprocessing/functions/booleanOverlap",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/booleanOverlap.md",tags:[],version:"current",frontMatter:{}},c={},a=[{value:"booleanOverlap(featureAInput, featureBInput, idProperty)",id:"booleanoverlapfeatureainput-featurebinput-idproperty",level:2},{value:"Type Parameters",id:"type-parameters",level:3},{value:"Parameters",id:"parameters",level:3},{value:"Returns",id:"returns",level:3},{value:"booleanOverlap(featureAInput, featureBInput, idProperty)",id:"booleanoverlapfeatureainput-featurebinput-idproperty-1",level:2},{value:"Type Parameters",id:"type-parameters-1",level:3},{value:"Parameters",id:"parameters-1",level:3},{value:"Returns",id:"returns-1",level:3},{value:"booleanOverlap(featureAInput, featureBInput, idProperty)",id:"booleanoverlapfeatureainput-featurebinput-idproperty-2",level:2},{value:"Type Parameters",id:"type-parameters-2",level:3},{value:"Parameters",id:"parameters-2",level:3},{value:"Returns",id:"returns-2",level:3},{value:"booleanOverlap(featureAInput, featureBInput, idProperty)",id:"booleanoverlapfeatureainput-featurebinput-idproperty-3",level:2},{value:"Type Parameters",id:"type-parameters-3",level:3},{value:"Parameters",id:"parameters-3",level:3},{value:"Returns",id:"returns-3",level:3}];function l(e){const r={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.header,{children:(0,n.jsx)(r.h1,{id:"booleanoverlap",children:"booleanOverlap()"})}),"\n",(0,n.jsx)(r.h2,{id:"booleanoverlapfeatureainput-featurebinput-idproperty",children:"booleanOverlap(featureAInput, featureBInput, idProperty)"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"function booleanOverlap<B>(\n   featureAInput, \n   featureBInput, \nidProperty?): Promise<B[]>\n"})}),"\n",(0,n.jsx)(r.p,{children:"Returns all B items that overlap with a A items\nNot all Feature types are supported, see typedoc\nA and B must have the same geometry dimension (single or multi). Builds on @turf/boolean-overlap."}),"\n",(0,n.jsx)(r.h3,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsx)(r.tr,{children:(0,n.jsx)(r.th,{children:"Type Parameter"})})}),(0,n.jsx)(r.tbody,{children:(0,n.jsx)(r.tr,{children:(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," ",(0,n.jsx)(r.em,{children:"extends"})," ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(r.code,{children:"Feature"})}),"<",(0,n.jsx)(r.code,{children:"any"}),", ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(r.code,{children:"GeoJsonProperties"})}),">"]})})})]}),"\n",(0,n.jsx)(r.h3,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:"Parameter"}),(0,n.jsx)(r.th,{children:"Type"}),(0,n.jsx)(r.th,{children:"Description"})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureAInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(r.code,{children:"Feature"})}),"<",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})}),", ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(r.code,{children:"GeoJsonProperties"})}),"> | ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(r.code,{children:"Feature"})}),"<",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})}),", ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(r.code,{children:"GeoJsonProperties"})}),">[]"]}),(0,n.jsx)(r.td,{children:"-"})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureBInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," | ",(0,n.jsx)(r.code,{children:"B"}),"[]"]}),(0,n.jsx)(r.td,{children:"-"})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"idProperty"}),"?"]}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"string"})}),(0,n.jsx)(r.td,{children:"property in Feature B to track if overlap already found. Useful if multiple features have same property value and you only want the first match."})]})]})]}),"\n",(0,n.jsx)(r.h3,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:"Promise"}),"<",(0,n.jsx)(r.code,{children:"B"}),"[]>"]}),"\n",(0,n.jsx)(r.h2,{id:"booleanoverlapfeatureainput-featurebinput-idproperty-1",children:"booleanOverlap(featureAInput, featureBInput, idProperty)"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"function booleanOverlap<B>(\n   featureAInput, \n   featureBInput, \nidProperty?): Promise<B[]>\n"})}),"\n",(0,n.jsx)(r.h3,{id:"type-parameters-1",children:"Type Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsx)(r.tr,{children:(0,n.jsx)(r.th,{children:"Type Parameter"})})}),(0,n.jsx)(r.tbody,{children:(0,n.jsx)(r.tr,{children:(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," ",(0,n.jsx)(r.em,{children:"extends"})," ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(r.code,{children:"Feature"})}),"<",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})}),", ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(r.code,{children:"GeoJsonProperties"})}),">"]})})})]}),"\n",(0,n.jsx)(r.h3,{id:"parameters-1",children:"Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:"Parameter"}),(0,n.jsx)(r.th,{children:"Type"})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureAInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})}),"[]"]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureBInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," | ",(0,n.jsx)(r.code,{children:"B"}),"[]"]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"idProperty"}),"?"]}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"string"})})]})]})]}),"\n",(0,n.jsx)(r.h3,{id:"returns-1",children:"Returns"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:"Promise"}),"<",(0,n.jsx)(r.code,{children:"B"}),"[]>"]}),"\n",(0,n.jsx)(r.h2,{id:"booleanoverlapfeatureainput-featurebinput-idproperty-2",children:"booleanOverlap(featureAInput, featureBInput, idProperty)"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"function booleanOverlap<B>(\n   featureAInput, \n   featureBInput, \nidProperty?): Promise<B[]>\n"})}),"\n",(0,n.jsx)(r.h3,{id:"type-parameters-2",children:"Type Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsx)(r.tr,{children:(0,n.jsx)(r.th,{children:"Type Parameter"})})}),(0,n.jsx)(r.tbody,{children:(0,n.jsx)(r.tr,{children:(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," ",(0,n.jsx)(r.em,{children:"extends"})," ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})})]})})})]}),"\n",(0,n.jsx)(r.h3,{id:"parameters-2",children:"Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:"Parameter"}),(0,n.jsx)(r.th,{children:"Type"})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureAInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(r.code,{children:"Feature"})}),"<",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})}),", ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(r.code,{children:"GeoJsonProperties"})}),"> | ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(r.code,{children:"Feature"})}),"<",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})}),", ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(r.code,{children:"GeoJsonProperties"})}),">[]"]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureBInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," | ",(0,n.jsx)(r.code,{children:"B"}),"[]"]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"idProperty"}),"?"]}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"string"})})]})]})]}),"\n",(0,n.jsx)(r.h3,{id:"returns-2",children:"Returns"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:"Promise"}),"<",(0,n.jsx)(r.code,{children:"B"}),"[]>"]}),"\n",(0,n.jsx)(r.h2,{id:"booleanoverlapfeatureainput-featurebinput-idproperty-3",children:"booleanOverlap(featureAInput, featureBInput, idProperty)"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"function booleanOverlap<B>(\n   featureAInput, \n   featureBInput, \nidProperty?): Promise<B[]>\n"})}),"\n",(0,n.jsx)(r.h3,{id:"type-parameters-3",children:"Type Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsx)(r.tr,{children:(0,n.jsx)(r.th,{children:"Type Parameter"})})}),(0,n.jsx)(r.tbody,{children:(0,n.jsx)(r.tr,{children:(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," ",(0,n.jsx)(r.em,{children:"extends"})," ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})})]})})})]}),"\n",(0,n.jsx)(r.h3,{id:"parameters-3",children:"Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:"Parameter"}),(0,n.jsx)(r.th,{children:"Type"})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureAInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})})," | ",(0,n.jsx)(r.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(r.code,{children:"Geometry"})}),"[]"]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"featureBInput"})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"B"})," | ",(0,n.jsx)(r.code,{children:"B"}),"[]"]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"idProperty"}),"?"]}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"string"})})]})]})]}),"\n",(0,n.jsx)(r.h3,{id:"returns-3",children:"Returns"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:"Promise"}),"<",(0,n.jsx)(r.code,{children:"B"}),"[]>"]})]})}function p(e={}){const{wrapper:r}={...(0,t.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},28453:(e,r,s)=>{s.d(r,{R:()=>d,x:()=>o});var n=s(96540);const t={},i=n.createContext(t);function d(e){const r=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),n.createElement(i.Provider,{value:r},e.children)}}}]);