import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{C as a}from"./Card-Chsr0-0l.js";import{G as s}from"./GroupCircleRow-ClzzeiZJ.js";import{R as n}from"./ReportDecorator-CVkrvWea.js";import{T as c}from"./Table-BanuEKp9.js";import{f as l}from"./index-uY9EgaMb.js";import"./index-CDs2tPxN.js";import"./Circle-mHCIeQdA.js";import"./styled-components.browser.esm-Bui9LJgA.js";import"./index-BAMY2Nnw.js";import"./ReportContext-BTL8L5yF.js";import"./_getPrototype-CLNpD7aq.js";import"./cloneDeep-DUn4YpqL.js";import"./extends-CF3RwP-h.js";import"./index.esm-2eyhaxSG.js";import"./DataDownload-qP7mMT4R.js";import"./Dropdown-tcPmk1CW.js";import"./usePopper-D0d76HL1.js";import"./index-B-yFm4aN.js";import"./SimpleButton-DMpLUrh0.js";import"./index-BbP3371Q.js";import"./index-BKD8Dact.js";import"./util-C2ce4qgt.js";import"./useSketchProperties-CFXDSTtm.js";import"./useTranslation-BpTe-nno.js";import"./context-CnTB_i5T.js";import"./Toolbar-BiCs23CE.js";const u=o=>o&&o[0].toLocaleUpperCase()+o.slice(1)||"",S={component:s,title:"Components/Table/GroupCircleRow",decorators:[n]},d={high:"#BEE4BE",med:"#FFE1A3",low:"#F7A6B4"},r=()=>{const o=[{Header:"Group assignments",accessor:t=>e.jsx(s,{group:t.group,groupColorMap:d,circleText:`${u(t.group[0])}`,rowText:t.name})}];return e.jsx(a,{title:"Report Title",children:e.jsx(c,{columns:o,data:l.humanUse})})};r.__docgenInfo={description:"",methods:[],displayName:"simple"};var p,i,m;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  const columns: Column<HumanUse>[] = [{
    Header: "Group assignments",
    accessor: row => <GroupCircleRow group={row.group} groupColorMap={groupColorMap} circleText={\`\${capitalize(row.group[0])}\`} rowText={row.name} />
  }];
  return <Card title="Report Title">
      <Table columns={columns} data={fixtures.humanUse} />
    </Card>;
}`,...(m=(i=r.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const k=["simple"];export{k as __namedExportsOrder,S as default,r as simple};
