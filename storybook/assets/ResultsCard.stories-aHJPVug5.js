import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{r as K}from"./index-CDs2tPxN.js";import{R as a}from"./ResultsCard-BosgCTC5.js";import{c as Q}from"./ReportDecorator-CVkrvWea.js";import{s as W,R as s}from"./ReportContext-BTL8L5yF.js";import{S as g}from"./Skeleton-C5SgFVsI.js";import{L as X}from"./LayerToggle-CMkgBS93.js";import{C as f}from"./Collapse-Dn7_bGES.js";import{f as Y}from"./index-uY9EgaMb.js";import{D as $}from"./DataDownload-qP7mMT4R.js";import{T as G}from"./ToolbarCard-DpzyBK3c.js";import"./Card-Chsr0-0l.js";import"./styled-components.browser.esm-Bui9LJgA.js";import"./index-BAMY2Nnw.js";import"./ReportError-Gzc7TVYo.js";import"./useTranslation-BpTe-nno.js";import"./context-CnTB_i5T.js";import"./_getPrototype-CLNpD7aq.js";import"./cloneDeep-DUn4YpqL.js";import"./extends-CF3RwP-h.js";import"./index.esm-2eyhaxSG.js";import"./Dropdown-tcPmk1CW.js";import"./usePopper-D0d76HL1.js";import"./index-B-yFm4aN.js";import"./SimpleButton-DMpLUrh0.js";import"./index-BbP3371Q.js";import"./index-BKD8Dact.js";import"./util-C2ce4qgt.js";import"./useSketchProperties-CFXDSTtm.js";import"./Toolbar-BiCs23CE.js";const r=W({visibleLayers:[],exampleOutputs:[{functionName:"area",sketchName:"My Sketch",results:{area:704}}]}),i=()=>e.jsx(a,{title:"Card Title",functionName:"area",children:t=>e.jsxs("p",{children:["This zone is ",t.area," sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut nisi beatae, officiis perferendis quis inventore quisquam? Provident doloremque inventore, natus beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti eveniet."]})}),ee=["nearshore","offshore"],n=()=>{const[t,H]=K.useState("nearshore"),J=o=>{console.log("changing geography to",o.target.value),H(o.target.value)};return e.jsxs(e.Fragment,{children:[e.jsx("select",{onChange:J,children:ee.map(o=>e.jsx("option",{value:o,children:o},o))})," ",e.jsx(a,{title:"Card Title",functionName:"area",extraParams:{geography:t},children:o=>e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:["Cur geography: ",t]}),e.jsx("p",{children:"Note that smoke tests are not setup to generate output for more than one extraParams value. In fact, by default the extraParams value is not set for a story. Storybook is also not setup to load more than one output. So This story demonstrates how to use a UI switcher to control passing different values to extraParams, but it won't change the output. The approach to seeing what the output would be for different values of extraParams is to run the smoke tests is to create multiple independent smoke tests, each with different values."})]})})]})},l=()=>e.jsx(s.Provider,{value:{...r,simulateLoading:!0},children:e.jsx(a,{title:"Card Title",functionName:"area",children:t=>e.jsxs("p",{children:["This zone is ",t.area," sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur illo voluptatem temporibus totam et incidunt."]})})}),d=()=>e.jsx(s.Provider,{value:{...r,simulateLoading:!0},children:e.jsx(a,{title:"Card Title",functionName:"area",skeleton:e.jsx(te,{}),children:t=>e.jsxs("p",{children:["This zone is ",t.area," sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur illo voluptatem temporibus totam et incidunt."]})})}),te=()=>e.jsxs("div",{children:[e.jsx(g,{style:{width:"100%",height:"130px"}}),e.jsx(g,{}),e.jsx(g,{}),e.jsx(g,{style:{width:"50%"}})]}),u=()=>e.jsx(s.Provider,{value:{...r,simulateError:"Internal server error"},children:e.jsx(a,{title:"Card Title",functionName:"area",children:t=>e.jsxs("p",{children:["This zone is ",t.area," sq km."]})})}),m=()=>e.jsx(s.Provider,{value:{...r,exampleOutputs:[{functionName:"area",sketchName:"My Sketch",results:null}]},children:e.jsx(a,{title:"Card Title",functionName:"area",children:t=>e.jsxs("p",{children:["This zone is ",t.area," sq km."]})})}),ae=()=>{throw Error("error!")},c=()=>e.jsx(s.Provider,{value:{...r},children:e.jsx(a,{title:"Card Title",functionName:"area",children:t=>e.jsx(ae,{})})}),Z=e.jsxs(e.Fragment,{children:[e.jsx(X,{label:"Show EEZ Boundary",layerId:"5e80c8a8cd44abca6e5268af",simple:!0}),e.jsx($,{filename:"sample",data:Y.ranked,formats:["csv","json"],placement:"left-end"})]}),p=()=>e.jsx(s.Provider,{value:{...r},children:e.jsx(a,{title:"Card Title",functionName:"area",useChildCard:!0,children:t=>e.jsxs(G,{title:"Card Title",items:Z,children:[e.jsxs("p",{children:["This zone is ",t.area," sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut nisi beatae, officiis perferendis quis inventore quisquam? Provident doloremque inventore, natus beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti eveniet."]}),e.jsx(f,{title:"Learn More",children:e.jsx("p",{children:"Additional elements in here"})}),e.jsx(f,{title:"Show by MPA",children:e.jsx("p",{children:"Additional elements in here"})})]})})}),h=()=>e.jsx(s.Provider,{value:{...r,visibleLayers:["5e80c8a8cd44abca6e5268af"]},children:e.jsx(a,{title:"Card Title",functionName:"area",useChildCard:!0,children:t=>e.jsxs(G,{title:"Card Title",items:Z,children:[e.jsxs("p",{children:["This zone is ",t.area," sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut nisi beatae, officiis perferendis quis inventore quisquam? Provident doloremque inventore, natus beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti eveniet."]}),e.jsx(f,{title:"Learn More",children:e.jsx("p",{children:"Additional elements in here"})}),e.jsx(f,{title:"Show by MPA",children:e.jsx("p",{children:"Additional elements in here"})})]})})}),_e={component:a,title:"Components/Card/ResultsCard",decorators:[Q(r)]};i.__docgenInfo={description:"",methods:[],displayName:"basic"};n.__docgenInfo={description:"",methods:[],displayName:"extraParams"};l.__docgenInfo={description:"",methods:[],displayName:"loadingState"};d.__docgenInfo={description:"",methods:[],displayName:"customSkeleton"};u.__docgenInfo={description:"",methods:[],displayName:"errorState"};m.__docgenInfo={description:"",methods:[],displayName:"noDataState"};c.__docgenInfo={description:"",methods:[],displayName:"errorBoundary"};p.__docgenInfo={description:"",methods:[],displayName:"customCard"};h.__docgenInfo={description:"",methods:[],displayName:"customCardToggled"};var x,C,v;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`() => <ResultsCard title="Card Title" functionName="area">
    {(data: any) => <p>
        This zone is {data.area} sq km. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Ut nisi beatae, officiis perferendis quis inventore
        quisquam? Provident doloremque inventore, natus beatae quam nisi eius
        quidem deserunt, aperiam aliquid corrupti eveniet.
      </p>}
  </ResultsCard>`,...(v=(C=i.parameters)==null?void 0:C.docs)==null?void 0:v.source}}};var q,y,j;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`() => {
  const [geography, setGeography] = useState("nearshore");
  const geographySwitcher = (e: any) => {
    console.log("changing geography to", e.target.value);
    setGeography(e.target.value);
  };
  return <>
      <select onChange={geographySwitcher}>
        {geographyIds.map(geographyId => {
        return <option key={geographyId} value={geographyId}>
              {geographyId}
            </option>;
      })}
      </select>{" "}
      <ResultsCard title="Card Title" functionName="area" extraParams={{
      geography
    }}>
        {(data: any) => <>
            <p>Cur geography: {geography}</p>
            <p>
              Note that smoke tests are not setup to generate output for more
              than one extraParams value. In fact, by default the extraParams
              value is not set for a story. Storybook is also not setup to load
              more than one output. So This story demonstrates how to use a UI
              switcher to control passing different values to extraParams, but
              it won't change the output. The approach to seeing what the output
              would be for different values of extraParams is to run the smoke
              tests is to create multiple independent smoke tests, each with
              different values.
            </p>
          </>}
      </ResultsCard>
    </>;
}`,...(j=(y=n.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var T,b,P;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`() => <ReportContext.Provider value={{
  ...contextValue,
  simulateLoading: true
}}>
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>
          This zone is {data.area} sq km. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur
          corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur
          illo voluptatem temporibus totam et incidunt.
        </p>}
    </ResultsCard>
  </ReportContext.Provider>`,...(P=(b=l.parameters)==null?void 0:b.docs)==null?void 0:P.source}}};var R,S,k;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`() => <ReportContext.Provider value={{
  ...contextValue,
  simulateLoading: true
}}>
    <ResultsCard title="Card Title" functionName="area" skeleton={<DefaultSkeleton />}>
      {(data: any) => <p>
          This zone is {data.area} sq km. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur
          corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur
          illo voluptatem temporibus totam et incidunt.
        </p>}
    </ResultsCard>
  </ReportContext.Provider>`,...(k=(S=d.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var N,I,L;u.parameters={...u.parameters,docs:{...(N=u.parameters)==null?void 0:N.docs,source:{originalSource:`() => <ReportContext.Provider value={{
  ...contextValue,
  simulateError: "Internal server error"
}}>
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>This zone is {data.area} sq km.</p>}
    </ResultsCard>
  </ReportContext.Provider>`,...(L=(I=u.parameters)==null?void 0:I.docs)==null?void 0:L.source}}};var w,_,z;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`() => <ReportContext.Provider value={{
  ...contextValue,
  exampleOutputs: [{
    functionName: "area",
    sketchName: "My Sketch",
    results: null
  }]
}}>
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>This zone is {data.area} sq km.</p>}
    </ResultsCard>
  </ReportContext.Provider>`,...(z=(_=m.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var A,M,D;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`() => <ReportContext.Provider value={{
  ...contextValue
}}>
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => {
      return <ThrowComponent />;
    }}
    </ResultsCard>
  </ReportContext.Provider>`,...(D=(M=c.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};var V,E,U;p.parameters={...p.parameters,docs:{...(V=p.parameters)==null?void 0:V.docs,source:{originalSource:`() => <ReportContext.Provider value={{
  ...contextValue
}}>
    <ResultsCard title="Card Title" functionName="area" useChildCard>
      {(data: any) => <ToolbarCard title="Card Title" items={loadedRightItems}>
          <p>
            This zone is {data.area} sq km. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Ut nisi beatae, officiis perferendis
            quis inventore quisquam? Provident doloremque inventore, natus
            beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti
            eveniet.
          </p>
          <Collapse title="Learn More">
            <p>Additional elements in here</p>
          </Collapse>
          <Collapse title="Show by MPA">
            <p>Additional elements in here</p>
          </Collapse>
        </ToolbarCard>}
    </ResultsCard>
  </ReportContext.Provider>`,...(U=(E=p.parameters)==null?void 0:E.docs)==null?void 0:U.source}}};var B,O,F;h.parameters={...h.parameters,docs:{...(B=h.parameters)==null?void 0:B.docs,source:{originalSource:`() => <ReportContext.Provider value={{
  ...contextValue,
  visibleLayers: ["5e80c8a8cd44abca6e5268af"]
}}>
    <ResultsCard title="Card Title" functionName="area" useChildCard>
      {(data: any) => <ToolbarCard title="Card Title" items={loadedRightItems}>
          <p>
            This zone is {data.area} sq km. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Ut nisi beatae, officiis perferendis
            quis inventore quisquam? Provident doloremque inventore, natus
            beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti
            eveniet.
          </p>
          <Collapse title="Learn More">
            <p>Additional elements in here</p>
          </Collapse>
          <Collapse title="Show by MPA">
            <p>Additional elements in here</p>
          </Collapse>
        </ToolbarCard>}
    </ResultsCard>
  </ReportContext.Provider>`,...(F=(O=h.parameters)==null?void 0:O.docs)==null?void 0:F.source}}};const ze=["basic","extraParams","loadingState","customSkeleton","errorState","noDataState","errorBoundary","customCard","customCardToggled"];export{ze as __namedExportsOrder,i as basic,p as customCard,h as customCardToggled,d as customSkeleton,_e as default,c as errorBoundary,u as errorState,n as extraParams,l as loadingState,m as noDataState};
