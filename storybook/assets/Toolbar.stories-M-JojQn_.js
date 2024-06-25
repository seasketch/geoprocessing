import{j as o}from"./jsx-runtime-qGIIFXMu.js";import{T as l}from"./Toolbar-BiCs23CE.js";import{C as s}from"./Card-Chsr0-0l.js";import{S as r}from"./SimpleButton-DMpLUrh0.js";import{R as B}from"./ReportDecorator-CVkrvWea.js";import{D as y}from"./DataDownloadToolbar-luHTVddk.js";import{f as g}from"./index-uY9EgaMb.js";import"./index-CDs2tPxN.js";import"./styled-components.browser.esm-Bui9LJgA.js";import"./index-BAMY2Nnw.js";import"./ReportContext-BTL8L5yF.js";import"./_getPrototype-CLNpD7aq.js";import"./cloneDeep-DUn4YpqL.js";import"./DataDownload-qP7mMT4R.js";import"./Dropdown-tcPmk1CW.js";import"./usePopper-D0d76HL1.js";import"./index-B-yFm4aN.js";import"./index-BbP3371Q.js";import"./index-BKD8Dact.js";import"./util-C2ce4qgt.js";import"./useSketchProperties-CFXDSTtm.js";import"./extends-CF3RwP-h.js";import"./index.esm-2eyhaxSG.js";import"./useTranslation-BpTe-nno.js";import"./context-CnTB_i5T.js";const V={component:l,title:"Components/Toolbar",decorators:[B]},e=()=>o.jsxs(s,{children:[o.jsxs(l,{variant:"dense",useGutters:!1,children:[o.jsx("h2",{style:{flexGrow:1},children:"Toolbar Title"}),o.jsxs("div",{children:[o.jsx(r,{children:"⬇"}),o.jsx(r,{children:"➥"})]})]}),o.jsx("p",{children:"Body"})]}),t=()=>o.jsxs(s,{children:[o.jsxs(l,{titleAlign:"center",style:{backgroundColor:"#eee"},children:[o.jsx("h2",{style:{flexGrow:1},children:"Header Toolbar"}),o.jsxs("div",{children:[o.jsx(r,{children:"⬇"}),o.jsx(r,{children:"➥"})]})]}),o.jsx("p",{children:"Body"})]}),a=()=>o.jsxs(s,{title:"Card Title",children:[o.jsx("p",{children:"Body"}),o.jsxs(l,{variant:"dense",titleAlign:"center",style:{backgroundColor:"#eee"},children:[o.jsx("h2",{style:{flexGrow:1},children:"Footer Toolbar"}),o.jsxs("div",{children:[o.jsx(r,{children:"⬇"}),o.jsx(r,{children:"➥"})]})]})]}),n=()=>o.jsx(s,{children:o.jsx(y,{title:"Data Download Toolbar",filename:"ranked",data:g.ranked})});e.__docgenInfo={description:"",methods:[],displayName:"headerToolbar"};t.__docgenInfo={description:"",methods:[],displayName:"regularGutterToolbar"};a.__docgenInfo={description:"",methods:[],displayName:"denseGutterToolbar"};n.__docgenInfo={description:"",methods:[],displayName:"dataDownloadToolbar"};var i,d,p;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`() => <Card>
    <Toolbar variant="dense" useGutters={false}>
      <h2 style={{
      flexGrow: 1
    }}>Toolbar Title</h2>
      <div>
        <SimpleButton>⬇</SimpleButton>
        <SimpleButton>➥</SimpleButton>
      </div>
    </Toolbar>
    <p>Body</p>
  </Card>`,...(p=(d=e.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var m,c,u;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`() => <Card>
    <Toolbar titleAlign="center" style={{
    backgroundColor: "#eee"
  }}>
      <h2 style={{
      flexGrow: 1
    }}>Header Toolbar</h2>
      <div>
        <SimpleButton>⬇</SimpleButton>
        <SimpleButton>➥</SimpleButton>
      </div>
    </Toolbar>
    <p>Body</p>
  </Card>`,...(u=(c=t.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var h,T,b;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`() => <Card title="Card Title">
    <p>Body</p>
    <Toolbar variant="dense" titleAlign="center" style={{
    backgroundColor: "#eee"
  }}>
      <h2 style={{
      flexGrow: 1
    }}>Footer Toolbar</h2>
      <div>
        <SimpleButton>⬇</SimpleButton>
        <SimpleButton>➥</SimpleButton>
      </div>
    </Toolbar>
  </Card>`,...(b=(T=a.parameters)==null?void 0:T.docs)==null?void 0:b.source}}};var x,f,j;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  return <Card>
      <DataDownloadToolbar title="Data Download Toolbar" filename="ranked" data={fixtures.ranked} />
    </Card>;
}`,...(j=(f=n.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};const W=["headerToolbar","regularGutterToolbar","denseGutterToolbar","dataDownloadToolbar"];export{W as __namedExportsOrder,n as dataDownloadToolbar,V as default,a as denseGutterToolbar,e as headerToolbar,t as regularGutterToolbar};
