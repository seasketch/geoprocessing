"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[86249],{23946:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>c,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var i=t(74848),s=t(28453);const r={},o="WindowOptions",a={id:"api/geoprocessing/interfaces/WindowOptions",title:"WindowOptions",description:"defines the new raster image to generate as a window in the source raster image.  Resolution (cell size) is determined from this",source:"@site/docs/api/geoprocessing/interfaces/WindowOptions.md",sourceDirName:"api/geoprocessing/interfaces",slug:"/api/geoprocessing/interfaces/WindowOptions",permalink:"/geoprocessing/docs/next/api/geoprocessing/interfaces/WindowOptions",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/interfaces/WindowOptions.md",tags:[],version:"current",frontMatter:{}},l={},d=[{value:"Properties",id:"properties",level:2},{value:"bottom",id:"bottom",level:3},{value:"height",id:"height",level:3},{value:"left",id:"left",level:3},{value:"resampleMethod?",id:"resamplemethod",level:3},{value:"right",id:"right",level:3},{value:"top",id:"top",level:3},{value:"width",id:"width",level:3}];function h(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"windowoptions",children:"WindowOptions"})}),"\n",(0,i.jsx)(n.p,{children:"defines the new raster image to generate as a window in the source raster image.  Resolution (cell size) is determined from this"}),"\n",(0,i.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,i.jsx)(n.h3,{id:"bottom",children:"bottom"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"bottom: number;\n"})}),"\n",(0,i.jsx)(n.p,{children:"bottom of the image window in pixel coordinates.  Should be greater than top"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"height",children:"height"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"height: number;\n"})}),"\n",(0,i.jsx)(n.p,{children:"height in pixels to make the resulting raster.  Will resample and/or use overview if not same as bottom - top"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"left",children:"left"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"left: number;\n"})}),"\n",(0,i.jsx)(n.p,{children:"left side of the image window in pixel coordinates"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"resamplemethod",children:"resampleMethod?"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"optional resampleMethod: string;\n"})}),"\n",(0,i.jsx)(n.p,{children:"method to map src raster values to result raster. Supports 'nearest' neighbor, defaults to 'bilinear'"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"right",children:"right"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"right: number;\n"})}),"\n",(0,i.jsx)(n.p,{children:"right of the image window in pixel coordinates.  Should be greater than left"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"top",children:"top"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"top: number;\n"})}),"\n",(0,i.jsx)(n.p,{children:"top of the image window in pixel coordinates"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"width",children:"width"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"width: number;\n"})}),"\n",(0,i.jsx)(n.p,{children:"width in pixels to make the resulting raster.  Will resample and/or use overview if not same as right - left"})]})}function c(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>a});var i=t(96540);const s={},r=i.createContext(s);function o(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);