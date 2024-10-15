"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[92388],{15943:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>t,default:()=>h,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var r=n(74848),o=n(28453);const i={},t="clip()",c={id:"api/geoprocessing/functions/clip",title:"~~clip()~~",description:"Performs clip operation on features",source:"@site/docs/api/geoprocessing/functions/clip.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/clip",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/clip",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/clip.md",tags:[],version:"current",frontMatter:{}},d={},l=[{value:"Type Parameters",id:"type-parameters",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Deprecated",id:"deprecated",level:2}];function a(e){const s={a:"a",code:"code",del:"del",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.header,{children:(0,r.jsx)(s.h1,{id:"clip",children:(0,r.jsx)(s.del,{children:"clip()"})})}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-ts",children:"function clip<P>(\n   features, \n   operation, \n   options): Feature<Polygon | MultiPolygon> | null\n"})}),"\n",(0,r.jsx)(s.p,{children:"Performs clip operation on features"}),"\n",(0,r.jsx)(s.h2,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{children:"Type Parameter"}),(0,r.jsx)(s.th,{children:"Default type"})]})}),(0,r.jsx)(s.tbody,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsxs)(s.td,{children:[(0,r.jsx)(s.code,{children:"P"})," ",(0,r.jsx)(s.em,{children:"extends"})," ",(0,r.jsx)(s.code,{children:"undefined"})," | ",(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,r.jsx)(s.code,{children:"GeoJsonProperties"})})]}),(0,r.jsx)(s.td,{children:(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,r.jsx)(s.code,{children:"GeoJsonProperties"})})})]})})]}),"\n",(0,r.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{children:"Parameter"}),(0,r.jsx)(s.th,{children:"Type"}),(0,r.jsx)(s.th,{children:"Description"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"features"})}),(0,r.jsxs)(s.td,{children:[(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/FeatureCollection",children:(0,r.jsx)(s.code,{children:"FeatureCollection"})}),"<",(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Polygon",children:(0,r.jsx)(s.code,{children:"Polygon"})})," | ",(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/MultiPolygon",children:(0,r.jsx)(s.code,{children:"MultiPolygon"})}),", ",(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,r.jsx)(s.code,{children:"GeoJsonProperties"})}),">"]}),(0,r.jsx)(s.td,{children:"FeatureCollection of Polygons or MultiPolygons. First feature is the subject, the rest are the clippers"})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"operation"})}),(0,r.jsxs)(s.td,{children:[(0,r.jsx)(s.code,{children:'"union"'})," | ",(0,r.jsx)(s.code,{children:'"intersection"'})," | ",(0,r.jsx)(s.code,{children:'"xor"'})," | ",(0,r.jsx)(s.code,{children:'"difference"'})]}),(0,r.jsx)(s.td,{children:'one of "union", "intersection", "xor", "difference"'})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"options"})}),(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"object"})}),(0,r.jsx)(s.td,{children:"optional properties to set on the resulting feature"})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsxs)(s.td,{children:[(0,r.jsx)(s.code,{children:"options.properties"}),"?"]}),(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"P"})}),(0,r.jsx)(s.td,{children:"-"})]})]})]}),"\n",(0,r.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Feature",children:(0,r.jsx)(s.code,{children:"Feature"})}),"<",(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Polygon",children:(0,r.jsx)(s.code,{children:"Polygon"})})," | ",(0,r.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/MultiPolygon",children:(0,r.jsx)(s.code,{children:"MultiPolygon"})}),"> | ",(0,r.jsx)(s.code,{children:"null"})]}),"\n",(0,r.jsx)(s.p,{children:"clipped Feature of Polygon or MultiPolygon"}),"\n",(0,r.jsx)(s.h2,{id:"deprecated",children:"Deprecated"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"use turf modules instead, now with support for operating against an array of features"}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,o.R)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},28453:(e,s,n)=>{n.d(s,{R:()=>t,x:()=>c});var r=n(96540);const o={},i=r.createContext(o);function t(e){const s=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:t(e.components),r.createElement(i.Provider,{value:s},e.children)}}}]);