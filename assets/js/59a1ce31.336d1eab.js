"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[38803],{69812:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>l});var s=t(74848),i=t(28453);const r={},c="VectorDataSourceOptions",a={id:"api/geoprocessing/interfaces/VectorDataSourceOptions",title:"VectorDataSourceOptions",description:"Properties",source:"@site/docs/api/geoprocessing/interfaces/VectorDataSourceOptions.md",sourceDirName:"api/geoprocessing/interfaces",slug:"/api/geoprocessing/interfaces/VectorDataSourceOptions",permalink:"/geoprocessing/docs/next/api/geoprocessing/interfaces/VectorDataSourceOptions",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/interfaces/VectorDataSourceOptions.md",tags:[],version:"current",frontMatter:{}},o={},l=[{value:"Properties",id:"properties",level:2},{value:"cacheSize",id:"cachesize",level:3},{value:"Default",id:"default",level:4},{value:"Memberof",id:"memberof",level:4},{value:"dissolvedFeatureCacheExcessLimit",id:"dissolvedfeaturecacheexcesslimit",level:3},{value:"Default",id:"default-1",level:4},{value:"Memberof",id:"memberof-1",level:4},{value:"hintPrefetchLimit",id:"hintprefetchlimit",level:3},{value:"Default",id:"default-2",level:4},{value:"Memberof",id:"memberof-2",level:4}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"vectordatasourceoptions",children:"VectorDataSourceOptions"})}),"\n",(0,s.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,s.jsx)(n.h3,{id:"cachesize",children:"cacheSize"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"cacheSize: number;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Max number of feature bundles to keep in memory.\nCalls to .fetch() will not return more than the contents these bundles, so\nthis acts as an effective limit on subsequent analysis."}),"\n",(0,s.jsx)(n.h4,{id:"default",children:"Default"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"250\n"})}),"\n",(0,s.jsx)(n.h4,{id:"memberof",children:"Memberof"}),"\n",(0,s.jsx)(n.p,{children:"VectorDataSourceOptions"}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"dissolvedfeaturecacheexcesslimit",children:"dissolvedFeatureCacheExcessLimit"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"dissolvedFeatureCacheExcessLimit: number;\n"})}),"\n",(0,s.jsx)(n.p,{children:"When features are requested by fetch, bundled features with matching\nunion_id will be dissolved into a single feature. This dissolved feature is\nexpensive to create and so may be cached. A cache may contain more bundles\nthan needed, and this variable sets a cap on that number."}),"\n",(0,s.jsx)(n.h4,{id:"default-1",children:"Default"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"3\n"})}),"\n",(0,s.jsx)(n.h4,{id:"memberof-1",children:"Memberof"}),"\n",(0,s.jsx)(n.p,{children:"VectorDataSourceOptions"}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"hintprefetchlimit",children:"hintPrefetchLimit"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"hintPrefetchLimit: number;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Source will only preload bundles when the bounding box provided to hint()\ncontains less than hintPrefetchLimit bundles."}),"\n",(0,s.jsx)(n.h4,{id:"default-2",children:"Default"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"8\n"})}),"\n",(0,s.jsx)(n.h4,{id:"memberof-2",children:"Memberof"}),"\n",(0,s.jsx)(n.p,{children:"VectorDataSourceOptions"})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>c,x:()=>a});var s=t(96540);const i={},r=s.createContext(i);function c(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);