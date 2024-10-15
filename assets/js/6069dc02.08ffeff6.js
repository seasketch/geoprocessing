"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4763],{48225:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>a,contentTitle:()=>t,default:()=>p,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var n=r(74848),o=r(28453);const i={},t="clipToPolygonFeatures()",c={id:"api/geoprocessing/functions/clipToPolygonFeatures",title:"clipToPolygonFeatures()",description:"Takes a Polygon feature and returns the portion remaining after performing clipOperations",source:"@site/docs/api/geoprocessing/functions/clipToPolygonFeatures.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/clipToPolygonFeatures",permalink:"/geoprocessing/docs/api/geoprocessing/functions/clipToPolygonFeatures",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/clipToPolygonFeatures.md",tags:[],version:"current",frontMatter:{}},a={},l=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Throws",id:"throws",level:2}];function d(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"cliptopolygonfeatures",children:"clipToPolygonFeatures()"})}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"function clipToPolygonFeatures(\n   feature, \n   clipLoader, \noptions): Promise<Feature<Polygon | MultiPolygon>>\n"})}),"\n",(0,n.jsx)(s.p,{children:"Takes a Polygon feature and returns the portion remaining after performing clipOperations\nIf results in multiple polygons then returns the largest"}),"\n",(0,n.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Description"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"feature"})}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(s.code,{children:"Feature"})}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/Geometry",children:(0,n.jsx)(s.code,{children:"Geometry"})}),", ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/type-aliases/GeoJsonProperties",children:(0,n.jsx)(s.code,{children:"GeoJsonProperties"})}),">"]}),(0,n.jsx)(s.td,{children:"feature to clip"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"clipLoader"})}),(0,n.jsxs)(s.td,{children:["(",(0,n.jsx)(s.code,{children:"feature"}),") => ",(0,n.jsx)(s.code,{children:"Promise"}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/FeatureClipOperation",children:(0,n.jsx)(s.code,{children:"FeatureClipOperation"})}),"[]>"]}),(0,n.jsx)(s.td,{children:"Load clip features from datasources for clip operations"})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"options"})}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/ClipOptions",children:(0,n.jsx)(s.code,{children:"ClipOptions"})})}),(0,n.jsx)(s.td,{children:"-"})]})]})]}),"\n",(0,n.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"Promise"}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Feature",children:(0,n.jsx)(s.code,{children:"Feature"})}),"<",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/Polygon",children:(0,n.jsx)(s.code,{children:"Polygon"})})," | ",(0,n.jsx)(s.a,{href:"/geoprocessing/docs/api/geoprocessing/interfaces/MultiPolygon",children:(0,n.jsx)(s.code,{children:"MultiPolygon"})}),">>"]}),"\n",(0,n.jsx)(s.h2,{id:"throws",children:"Throws"}),"\n",(0,n.jsx)(s.p,{children:"if input feature to clip is not a polygon or if enforceMaxSize is true and clipped feature is larger than maxSize, defaults to 500K km"})]})}function p(e={}){const{wrapper:s}={...(0,o.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},28453:(e,s,r)=>{r.d(s,{R:()=>t,x:()=>c});var n=r(96540);const o={},i=n.createContext(o);function t(e){const s=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:t(e.components),n.createElement(i.Provider,{value:s},e.children)}}}]);