"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9248],{11995:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>o,contentTitle:()=>a,default:()=>l,frontMatter:()=>c,metadata:()=>i,toc:()=>d});var t=n(74848),r=n(28453);const c={},a="genTaskCacheKey()",i={id:"api/geoprocessing/functions/genTaskCacheKey",title:"genTaskCacheKey()",description:"Generates a cache key for a geoprocessing request, given sketch properties and optional extra parameters (must be JSON compatible object)",source:"@site/docs/api/geoprocessing/functions/genTaskCacheKey.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/genTaskCacheKey",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/genTaskCacheKey",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/genTaskCacheKey.md",tags:[],version:"current",frontMatter:{}},o={},d=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}];function h(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"gentaskcachekey",children:"genTaskCacheKey()"})}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-ts",children:"function genTaskCacheKey(\n   service, \n   props, \n   extraParams): string\n"})}),"\n",(0,t.jsx)(s.p,{children:"Generates a cache key for a geoprocessing request, given sketch properties and optional extra parameters (must be JSON compatible object)\nExtra parameters are canonicalized and hashed using md5 to ensure cache key is consistent.  Canonicalization ensures object keys are consistent\nbut not arrays.  If you use arrays as extraParam values, make sure the order stays the same and sort first if needed to generate a consistent cache key."}),"\n",(0,t.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:"Parameter"}),(0,t.jsx)(s.th,{children:"Type"}),(0,t.jsx)(s.th,{children:"Description"})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"service"})}),(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"string"})}),(0,t.jsx)(s.td,{children:"-"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"props"})}),(0,t.jsx)(s.td,{children:(0,t.jsx)(s.a,{href:"/geoprocessing/docs/next/api/geoprocessing/type-aliases/SketchProperties",children:(0,t.jsx)(s.code,{children:"SketchProperties"})})}),(0,t.jsx)(s.td,{children:"Properties of sketch to generate cache key for"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"extraParams"})}),(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.code,{children:"Record"}),"<",(0,t.jsx)(s.code,{children:"string"}),", ",(0,t.jsx)(s.code,{children:"unknown"}),">"]}),(0,t.jsx)(s.td,{children:"Extra parameters to include in cache key"})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.code,{children:"string"})})]})}function l(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},28453:(e,s,n)=>{n.d(s,{R:()=>a,x:()=>i});var t=n(96540);const r={},c=t.createContext(r);function a(e){const s=t.useContext(c);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),t.createElement(c.Provider,{value:s},e.children)}}}]);