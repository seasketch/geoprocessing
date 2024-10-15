"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[77321],{83149:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>n,metadata:()=>a,toc:()=>h});var r=o(74848),s=o(28453);const n={slug:"/limits"},i="Edge Cases & Limits",a={id:"EdgesAndLimits",title:"Edge Cases & Limits",description:"Zero Geography - No Overlap With MetricGroup (NaN)",source:"@site/versioned_docs/version-6.1.0/EdgesAndLimits.md",sourceDirName:".",slug:"/limits",permalink:"/geoprocessing/docs/limits",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/versioned_docs/version-6.1.0/EdgesAndLimits.md",tags:[],version:"6.1.0",frontMatter:{slug:"/limits"},sidebar:"tutorialSidebar",previous:{title:"i18n",permalink:"/geoprocessing/docs/gip/GIP-1-i18n"},next:{title:"Testing",permalink:"/geoprocessing/docs/testing"}},l={},h=[{value:"Zero Geography - No Overlap With MetricGroup (NaN)",id:"zero-geography---no-overlap-with-metricgroup-nan",level:2},{value:"Zero Geometries",id:"zero-geometries",level:2}];function c(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"edge-cases--limits",children:"Edge Cases & Limits"})}),"\n",(0,r.jsx)(t.h2,{id:"zero-geography---no-overlap-with-metricgroup-nan",children:"Zero Geography - No Overlap With MetricGroup (NaN)"}),"\n",(0,r.jsxs)(t.p,{children:["This use case happens when no features for some class of data within a datasource, overlap with a geography. This produces a zero (0) value metric in precalc. If this zero value metric gets passed as the denominator to ",(0,r.jsx)(t.code,{children:"toPercentMetric(numeratorMetrics, denominatorMetrics)"}),", the function will return a ",(0,r.jsx)(t.code,{children:"NaN"})," value, rather than 0. This is so that downstream consumers can understand this isn't just any 0. There's an opportunity to tell the user that no matter where they put their sketch within the geography, there is no way for the value to be more than zero. For example, the ClassTable component looks for ",(0,r.jsx)(t.code,{children:"NaN"})," metric values and will automatically display 0%, along with an informative popover explaining that no data class features are within the current geography."]}),"\n",(0,r.jsx)(t.h2,{id:"zero-geometries",children:"Zero Geometries"}),"\n",(0,r.jsxs)(t.p,{children:["In geoprocessing functions, sketches are clipped to the current geography using ",(0,r.jsx)(t.code,{children:"clipToGeography()"}),". A georaphy can be as large as the extent of the entire world, or be a smaller boundary within the overall planning area."]}),"\n",(0,r.jsxs)(t.p,{children:["When the geography is a subset of the larger planning area, you can have sketches that fall completely outside the geography, and the intersection of the sketch and the geography will have nothing remaining because there's no overlap. In GeoJSON, this clip result could be represented with a ",(0,r.jsx)(t.code,{children:"null"})," geometry value, but Turf and most other libraries don't handle null geometries well, so ",(0,r.jsx)(t.code,{children:"overlap"})," toolbox functions would have unexpected results."]}),"\n",(0,r.jsxs)(t.p,{children:["We could also have clipToGeography return a ",(0,r.jsx)(t.code,{children:"null"})," value for the entire sketch, but that gets complex, especially when you're processing a whole SketchCollection. What we decided to do instead is to have ",(0,r.jsx)(t.code,{children:"clipToGeography"})," return a ",(0,r.jsx)(t.code,{children:"zero"})," geometry when a sketch has no overlap with the geography. We do this using the ",(0,r.jsx)(t.code,{children:"zeroSketch"})," helper function.Given a Sketch it replaces the geometry with a polygon at [[0,0], [0,0], [0,0], [0,0]]. It's a valid geometry, but's it's located at ",(0,r.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Null_Island",children:"Null Island"}),". What happens as a result is that downstream ",(0,r.jsx)(t.code,{children:"overlap"})," toolbox functions receive a Sketch as they expect, but when they pass it to any overlap functions it will return zero value metrics, as long as Null Island is not withing the planning area."]})]})}function d(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},28453:(e,t,o)=>{o.d(t,{R:()=>i,x:()=>a});var r=o(96540);const s={},n=r.createContext(s);function i(e){const t=r.useContext(n);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(n.Provider,{value:t},e.children)}}}]);