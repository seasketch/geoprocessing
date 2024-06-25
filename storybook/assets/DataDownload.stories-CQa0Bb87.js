import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{D as a}from"./DataDownload-qP7mMT4R.js";import{f as s}from"./index-uY9EgaMb.js";import{S as x}from"./SimpleButton-DMpLUrh0.js";import"./index-CDs2tPxN.js";import"./Dropdown-tcPmk1CW.js";import"./styled-components.browser.esm-Bui9LJgA.js";import"./index-BAMY2Nnw.js";import"./usePopper-D0d76HL1.js";import"./index-B-yFm4aN.js";import"./index-BbP3371Q.js";import"./index-BKD8Dact.js";import"./util-C2ce4qgt.js";import"./useSketchProperties-CFXDSTtm.js";import"./ReportContext-BTL8L5yF.js";import"./extends-CF3RwP-h.js";import"./index.esm-2eyhaxSG.js";import"./useTranslation-BpTe-nno.js";import"./context-CnTB_i5T.js";const R={component:a,title:"Components/DataDownload",decorators:[]},t=()=>e.jsx(e.Fragment,{children:e.jsx(a,{filename:"sample",data:s.ranked,formats:["csv","json"]})}),r=()=>e.jsx(e.Fragment,{children:e.jsx(a,{filename:"sample",data:s.nested})}),o=()=>e.jsx(e.Fragment,{children:e.jsx(a,{filename:"sample",data:s.ranked,formats:["csv","json"],titleElement:e.jsx(x,{children:"➥ Export"})})});t.__docgenInfo={description:"",methods:[],displayName:"simple"};r.__docgenInfo={description:"",methods:[],displayName:"flattenNested"};o.__docgenInfo={description:"",methods:[],displayName:"button"};var n,m,i;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  return <>
      <DataDownload filename="sample" data={fixtures.ranked} formats={["csv", "json"]} />
    </>;
}`,...(i=(m=t.parameters)==null?void 0:m.docs)==null?void 0:i.source}}};var p,d,l;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  return <>
      <DataDownload filename="sample" data={fixtures.nested} />
    </>;
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var c,u,f;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  return <>
      <DataDownload filename="sample" data={fixtures.ranked} formats={["csv", "json"]} titleElement={<SimpleButton>➥ Export</SimpleButton>} />
    </>;
}`,...(f=(u=o.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};const q=["simple","flattenNested","button"];export{q as __namedExportsOrder,o as button,R as default,r as flattenNested,t as simple};
