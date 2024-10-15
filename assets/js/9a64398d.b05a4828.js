"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[33967],{22131:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>d});var n=t(74848),c=t(28453);const r={},i="flattenBySketchAllClass()",l={id:"api/geoprocessing/functions/flattenBySketchAllClass",title:"flattenBySketchAllClass()",description:"Flattens class sketch metrics into array of objects, one for each sketch,",source:"@site/docs/api/geoprocessing/functions/flattenBySketchAllClass.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/flattenBySketchAllClass",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/flattenBySketchAllClass",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/flattenBySketchAllClass.md",tags:[],version:"current",frontMatter:{}},o={},d=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function a(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,c.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"flattenbysketchallclass",children:"flattenBySketchAllClass()"})}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"function flattenBySketchAllClass(\n   metrics, \n   classes, \n   sketches, \n   sortFn?): Record<string, string | number>[]\n"})}),"\n",(0,n.jsx)(s.p,{children:"Flattens class sketch metrics into array of objects, one for each sketch,\nwhere each object contains sketch id, sketch name, and all metric values for each class"}),"\n",(0,n.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Description"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"metrics"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"object"}),"[]"]}),(0,n.jsx)(s.td,{children:"List of metrics, expects one metric per sketch and class combination"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"classes"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"object"}),"[]"]}),(0,n.jsx)(s.td,{children:"Data classes represented in metrics"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"sketches"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/NullSketch",children:(0,n.jsx)(s.code,{children:"NullSketch"})}),"[] | ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Sketch",children:(0,n.jsx)(s.code,{children:"Sketch"})}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/SketchGeometryTypes",children:(0,n.jsx)(s.code,{children:"SketchGeometryTypes"})}),">[]"]}),(0,n.jsx)(s.td,{children:"Sketches contained in metrics"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"sortFn"}),"?"]}),(0,n.jsxs)(s.td,{children:["(",(0,n.jsx)(s.code,{children:"a"}),", ",(0,n.jsx)(s.code,{children:"b"}),") => ",(0,n.jsx)(s.code,{children:"number"})]}),(0,n.jsx)(s.td,{children:"Function to sort class configs using Array.sort (defaults to alphabetical by display name)"})]})]})]}),"\n",(0,n.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"Record"}),"<",(0,n.jsx)(s.code,{children:"string"}),", ",(0,n.jsx)(s.code,{children:"string"})," | ",(0,n.jsx)(s.code,{children:"number"}),">[]"]}),"\n",(0,n.jsx)(s.p,{children:"An array of objects with flattened sketch metrics"})]})}function h(e={}){const{wrapper:s}={...(0,c.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},28453:(e,s,t)=>{t.d(s,{R:()=>i,x:()=>l});var n=t(96540);const c={},r=n.createContext(c);function i(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);