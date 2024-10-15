"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[76162],{51111:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>a,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var c=s(74848),n=s(28453);const o={},r="getSketchToMpaProtectionLevel()",i={id:"api/geoprocessing/functions/getSketchToMpaProtectionLevel",title:"getSketchToMpaProtectionLevel()",description:"Returns object mapping sketch id to MPA classification",source:"@site/docs/api/geoprocessing/functions/getSketchToMpaProtectionLevel.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/getSketchToMpaProtectionLevel",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/getSketchToMpaProtectionLevel",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/getSketchToMpaProtectionLevel.md",tags:[],version:"current",frontMatter:{}},a={},l=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function d(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(t.header,{children:(0,c.jsx)(t.h1,{id:"getsketchtompaprotectionlevel",children:"getSketchToMpaProtectionLevel()"})}),"\n",(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:"language-ts",children:"function getSketchToMpaProtectionLevel(sketch, metrics): Record<string, RbcsMpaProtectionLevel>\n"})}),"\n",(0,c.jsx)(t.p,{children:"Returns object mapping sketch id to MPA classification\ngiven sketch for rbcsMpa or collection of sketches for rbcsMpas with rbcs activity userAttributes,\nand area metrics for each sketch, assumes each mpa is a single zone mpa"}),"\n",(0,c.jsx)(t.h2,{id:"parameters",children:"Parameters"}),"\n",(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:"Parameter"}),(0,c.jsx)(t.th,{children:"Type"}),(0,c.jsx)(t.th,{children:"Description"})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:"sketch"})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/NullSketch",children:(0,c.jsx)(t.code,{children:"NullSketch"})})," | ",(0,c.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/Sketch",children:(0,c.jsx)(t.code,{children:"Sketch"})}),"<",(0,c.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/SketchGeometryTypes",children:(0,c.jsx)(t.code,{children:"SketchGeometryTypes"})}),"> | ",(0,c.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/NullSketchCollection",children:(0,c.jsx)(t.code,{children:"NullSketchCollection"})})," | ",(0,c.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/SketchCollection",children:(0,c.jsx)(t.code,{children:"SketchCollection"})}),"<",(0,c.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/SketchGeometryTypes",children:(0,c.jsx)(t.code,{children:"SketchGeometryTypes"})}),">"]}),(0,c.jsx)(t.td,{children:"sketch or sketch collection with GEAR_TYPES (multi), BOATING (single), and AQUACULTURE (single) user attributes"})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:"metrics"})}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:"object"}),"[]"]}),(0,c.jsx)(t.td,{children:"-"})]})]})]}),"\n",(0,c.jsx)(t.h2,{id:"returns",children:"Returns"}),"\n",(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:"Record"}),"<",(0,c.jsx)(t.code,{children:"string"}),", ",(0,c.jsx)(t.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/RbcsMpaProtectionLevel",children:(0,c.jsx)(t.code,{children:"RbcsMpaProtectionLevel"})}),">"]})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(d,{...e})}):d(e)}},28453:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>i});var c=s(96540);const n={},o=c.createContext(n);function r(e){const t=c.useContext(o);return c.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:r(e.components),c.createElement(o.Provider,{value:t},e.children)}}}]);