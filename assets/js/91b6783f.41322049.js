"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7251],{21808:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>c,toc:()=>o});var s=r(74848),t=r(28453);const i={},a="RasterStatsOptions",c={id:"api/geoprocessing/interfaces/RasterStatsOptions",title:"RasterStatsOptions",description:"options accepted by rasterStats",source:"@site/docs/api/geoprocessing/interfaces/RasterStatsOptions.md",sourceDirName:"api/geoprocessing/interfaces",slug:"/api/geoprocessing/interfaces/RasterStatsOptions",permalink:"/geoprocessing/docs/next/api/geoprocessing/interfaces/RasterStatsOptions",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/interfaces/RasterStatsOptions.md",tags:[],version:"current",frontMatter:{}},l={},o=[{value:"Extends",id:"extends",level:2},{value:"Properties",id:"properties",level:2},{value:"categorical?",id:"categorical",level:3},{value:"categoryMetricProperty?",id:"categorymetricproperty",level:3},{value:"categoryMetricValues?",id:"categorymetricvalues",level:3},{value:"chunked?",id:"chunked",level:3},{value:"Inherited from",id:"inherited-from",level:4},{value:"feature?",id:"feature",level:3},{value:"filter()?",id:"filter",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Inherited from",id:"inherited-from-1",level:4},{value:"filterFn()?",id:"filterfn",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"noData?",id:"nodata",level:3},{value:"Inherited from",id:"inherited-from-2",level:4},{value:"numBands?",id:"numbands",level:3},{value:"stats?",id:"stats",level:3},{value:"Inherited from",id:"inherited-from-3",level:4}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"rasterstatsoptions",children:"RasterStatsOptions"})}),"\n",(0,s.jsx)(n.p,{children:"options accepted by rasterStats"}),"\n",(0,s.jsx)(n.h2,{id:"extends",children:"Extends"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions",children:(0,s.jsx)(n.code,{children:"CalcStatsOptions"})})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,s.jsx)(n.h3,{id:"categorical",children:"categorical?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional categorical: boolean;\n"})}),"\n",(0,s.jsx)(n.p,{children:"If categorical raster, set to true"}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"categorymetricproperty",children:"categoryMetricProperty?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:'optional categoryMetricProperty: \n  | "classId"\n  | "metricId"\n  | "geographyId"\n  | "sketchId"\n  | "groupId";\n'})}),"\n",(0,s.jsx)(n.p,{children:"If categorical raster, metric property name that categories are organized. Defaults to classId"}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"categorymetricvalues",children:"categoryMetricValues?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional categoryMetricValues: string[];\n"})}),"\n",(0,s.jsx)(n.p,{children:"If categorical raster, array of values to create metrics for"}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"chunked",children:"chunked?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional chunked: boolean;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Whether or not to chunk calculations"}),"\n",(0,s.jsx)(n.h4,{id:"inherited-from",children:"Inherited from"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions",children:(0,s.jsx)(n.code,{children:"CalcStatsOptions"})}),".",(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions#chunked",children:(0,s.jsx)(n.code,{children:"chunked"})})]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"feature",children:"feature?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional feature: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | Feature<Polygon | MultiPolygon, GeoJsonProperties> | SketchCollection<Polygon | MultiPolygon> | Sketch<Polygon | MultiPolygon>;\n"})}),"\n",(0,s.jsx)(n.p,{children:"single sketch or sketch collection filter to overlap with raster when calculating metrics."}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"filter",children:"filter()?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional filter: (index, value) => boolean;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Filter function to ignore raster values in stat calc"}),"\n",(0,s.jsx)(n.h4,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Parameter"}),(0,s.jsx)(n.th,{children:"Type"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"index"})}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"number"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"value"})}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"number"})})]})]})]}),"\n",(0,s.jsx)(n.h4,{id:"returns",children:"Returns"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"boolean"})}),"\n",(0,s.jsx)(n.h4,{id:"inherited-from-1",children:"Inherited from"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions",children:(0,s.jsx)(n.code,{children:"CalcStatsOptions"})}),".",(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions#filter",children:(0,s.jsx)(n.code,{children:"filter"})})]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"filterfn",children:"filterFn()?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional filterFn: (cellValue) => boolean;\n"})}),"\n",(0,s.jsx)(n.p,{children:"undocumented filter function (how different from filter option above?), for example a => a > 0 will filter out pixels greater than zero such that 'valid' is number of valid pixels greater than 0"}),"\n",(0,s.jsx)(n.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Parameter"}),(0,s.jsx)(n.th,{children:"Type"})]})}),(0,s.jsx)(n.tbody,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"cellValue"})}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"number"})})]})})]}),"\n",(0,s.jsx)(n.h4,{id:"returns-1",children:"Returns"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"boolean"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"nodata",children:"noData?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional noData: number;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Override nodata value, which is ignored in calculations"}),"\n",(0,s.jsx)(n.h4,{id:"inherited-from-2",children:"Inherited from"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions",children:(0,s.jsx)(n.code,{children:"CalcStatsOptions"})}),".",(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions#nodata",children:(0,s.jsx)(n.code,{children:"noData"})})]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"numbands",children:"numBands?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional numBands: number;\n"})}),"\n",(0,s.jsx)(n.p,{children:"Optional number of bands in the raster, defaults to 1, used to initialize zero values"}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"stats",children:"stats?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"optional stats: string[];\n"})}),"\n",(0,s.jsx)(n.p,{children:"Stats to calculate"}),"\n",(0,s.jsx)(n.h4,{id:"inherited-from-3",children:"Inherited from"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions",children:(0,s.jsx)(n.code,{children:"CalcStatsOptions"})}),".",(0,s.jsx)(n.a,{href:"/geoprocessing/docs/next/api/geoprocessing/interfaces/CalcStatsOptions#stats",children:(0,s.jsx)(n.code,{children:"stats"})})]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},28453:(e,n,r)=>{r.d(n,{R:()=>a,x:()=>c});var s=r(96540);const t={},i=s.createContext(t);function a(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);