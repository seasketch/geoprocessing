import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{r as l}from"./index-CDs2tPxN.js";import{R as t}from"./ReportPage-DYQW_yI4.js";import{R as d}from"./ReportDecorator-CVkrvWea.js";import{S as m}from"./SegmentControl-CR3tewjT.js";import"./ReportContext-BTL8L5yF.js";import"./index-BAMY2Nnw.js";import"./_getPrototype-CLNpD7aq.js";import"./cloneDeep-DUn4YpqL.js";const T={component:t,title:"Components/ReportPage",decorators:[d]},a=()=>{const[n,i]=l.useState("page1");return e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{marginTop:5},children:e.jsx(m,{value:n,onClick:p=>i(p),segments:[{id:"page1",label:"Page 1"},{id:"page2",label:"Page 2"}]})}),e.jsx(t,{hidden:n!=="page1",children:e.jsx("div",{children:"One"})}),e.jsx(t,{hidden:n!=="page2",children:e.jsx("div",{children:"Two"})})]})};a.__docgenInfo={description:"",methods:[],displayName:"simple"};var r,o,s;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const [tab, setTab] = useState<string>("page1");
  const enableAllTabs = false;
  return <>
      <div style={{
      marginTop: 5
    }}>
        <SegmentControl value={tab} onClick={segment => setTab(segment)} segments={[{
        id: "page1",
        label: "Page 1"
      }, {
        id: "page2",
        label: "Page 2"
      }]} />
      </div>
      <ReportPage hidden={!enableAllTabs && tab !== "page1"}>
        <div>One</div>
      </ReportPage>
      <ReportPage hidden={!enableAllTabs && tab !== "page2"}>
        <div>Two</div>
      </ReportPage>
    </>;
}`,...(s=(o=a.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const j=["simple"];export{j as __namedExportsOrder,T as default,a as simple};
