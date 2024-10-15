"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[511],{37369:(e,a,s)=>{s.r(a),s.d(a,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var t=s(74848),n=s(28453);const r={},d="getRasterDatasourceById()",i={id:"api/geoprocessing/functions/getRasterDatasourceById",title:"getRasterDatasourceById()",description:"find and return raster datasource (internal or external) from passed datasources",source:"@site/docs/api/geoprocessing/functions/getRasterDatasourceById.md",sourceDirName:"api/geoprocessing/functions",slug:"/api/geoprocessing/functions/getRasterDatasourceById",permalink:"/geoprocessing/docs/next/api/geoprocessing/functions/getRasterDatasourceById",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/api/geoprocessing/functions/getRasterDatasourceById.md",tags:[],version:"current",frontMatter:{}},c={},l=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"band",id:"band",level:3},{value:"datasourceId",id:"datasourceid",level:3},{value:"formats",id:"formats",level:3},{value:"geo_type",id:"geo_type",level:3},{value:"measurementType",id:"measurementtype",level:3},{value:"metadata?",id:"metadata",level:3},{value:"metadata.description?",id:"metadatadescription",level:3},{value:"metadata.name",id:"metadataname",level:3},{value:"metadata.publishDate",id:"metadatapublishdate",level:3},{value:"metadata.publisher",id:"metadatapublisher",level:3},{value:"metadata.publishLink",id:"metadatapublishlink",level:3},{value:"metadata.version",id:"metadataversion",level:3},{value:"noDataValue?",id:"nodatavalue",level:3},{value:"precalc",id:"precalc",level:3}];function o(e){const a={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.header,{children:(0,t.jsx)(a.h1,{id:"getrasterdatasourcebyid",children:"getRasterDatasourceById()"})}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"function getRasterDatasourceById(datasourceId, datasources): object\n"})}),"\n",(0,t.jsx)(a.p,{children:"find and return raster datasource (internal or external) from passed datasources"}),"\n",(0,t.jsx)(a.h2,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsxs)(a.table,{children:[(0,t.jsx)(a.thead,{children:(0,t.jsxs)(a.tr,{children:[(0,t.jsx)(a.th,{children:"Parameter"}),(0,t.jsx)(a.th,{children:"Type"})]})}),(0,t.jsxs)(a.tbody,{children:[(0,t.jsxs)(a.tr,{children:[(0,t.jsx)(a.td,{children:(0,t.jsx)(a.code,{children:"datasourceId"})}),(0,t.jsx)(a.td,{children:(0,t.jsx)(a.code,{children:"string"})})]}),(0,t.jsxs)(a.tr,{children:[(0,t.jsx)(a.td,{children:(0,t.jsx)(a.code,{children:"datasources"})}),(0,t.jsxs)(a.td,{children:["(",(0,t.jsx)(a.code,{children:"object"})," | ",(0,t.jsx)(a.code,{children:"object"})," | ",(0,t.jsx)(a.code,{children:"object"})," & ",(0,t.jsx)(a.code,{children:"object"})," | ",(0,t.jsx)(a.code,{children:"object"})," & ",(0,t.jsx)(a.code,{children:"object"}),")[]"]})]})]})]}),"\n",(0,t.jsx)(a.h2,{id:"returns",children:"Returns"}),"\n",(0,t.jsx)(a.p,{children:(0,t.jsx)(a.code,{children:"object"})}),"\n",(0,t.jsx)(a.h3,{id:"band",children:"band"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"band: number;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Import - band within raster datasource to extract"}),"\n",(0,t.jsx)(a.h3,{id:"datasourceid",children:"datasourceId"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"datasourceId: string;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Unique id of datasource in project"}),"\n",(0,t.jsx)(a.h3,{id:"formats",children:"formats"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:'formats: ("fgb" | "json" | "tif" | "subdivided")[];\n'})}),"\n",(0,t.jsx)(a.p,{children:"Available formats"}),"\n",(0,t.jsx)(a.h3,{id:"geo_type",children:"geo_type"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:'geo_type: "vector" | "raster" = geoTypesSchema;\n'})}),"\n",(0,t.jsx)(a.p,{children:"basic geospatial type"}),"\n",(0,t.jsx)(a.h3,{id:"measurementtype",children:"measurementType"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:'measurementType: "quantitative" | "categorical" = measurementTypesSchema;\n'})}),"\n",(0,t.jsx)(a.p,{children:"Type of measurements that the raster values represent"}),"\n",(0,t.jsx)(a.h3,{id:"metadata",children:"metadata?"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"optional metadata: object;\n"})}),"\n",(0,t.jsx)(a.h3,{id:"metadatadescription",children:"metadata.description?"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"optional description: string;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Description of datasource"}),"\n",(0,t.jsx)(a.h3,{id:"metadataname",children:"metadata.name"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"name: string;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Human-readable name of datasource"}),"\n",(0,t.jsx)(a.h3,{id:"metadatapublishdate",children:"metadata.publishDate"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"publishDate: string;\n"})}),"\n",(0,t.jsx)(a.p,{children:"ISO 8601 publish date"}),"\n",(0,t.jsx)(a.h3,{id:"metadatapublisher",children:"metadata.publisher"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"publisher: string;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Publisher name"}),"\n",(0,t.jsx)(a.h3,{id:"metadatapublishlink",children:"metadata.publishLink"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"publishLink: string;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Public URL to access published data"}),"\n",(0,t.jsx)(a.h3,{id:"metadataversion",children:"metadata.version"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"version: string;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Publisher-provided version number or ISO 8601 date"}),"\n",(0,t.jsx)(a.h3,{id:"nodatavalue",children:"noDataValue?"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"optional noDataValue: number;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Nodata value"}),"\n",(0,t.jsx)(a.h3,{id:"precalc",children:"precalc"}),"\n",(0,t.jsx)(a.pre,{children:(0,t.jsx)(a.code,{className:"language-ts",children:"precalc: boolean;\n"})}),"\n",(0,t.jsx)(a.p,{children:"Optional, defines whether or not precalc should be run for this datasource"})]})}function h(e={}){const{wrapper:a}={...(0,n.R)(),...e.components};return a?(0,t.jsx)(a,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},28453:(e,a,s)=>{s.d(a,{R:()=>d,x:()=>i});var t=s(96540);const n={},r=t.createContext(n);function d(e){const a=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function i(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:d(e.components),t.createElement(r.Provider,{value:a},e.children)}}}]);