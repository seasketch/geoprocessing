import{j as n}from"./jsx-runtime-qGIIFXMu.js";import{R as Se}from"./index-CDs2tPxN.js";import{T as a}from"./Table-BanuEKp9.js";import{F as ke}from"./FilterSelectTable-Cg8RtuL8.js";import{a as Fe}from"./ReportDecorator-CVkrvWea.js";import{C as _e}from"./CardDecorator-JG7Qo-Oa.js";import{f as r,g as Pe}from"./index-uY9EgaMb.js";import{p as Ie}from"./styled-components.browser.esm-Bui9LJgA.js";import"./extends-CF3RwP-h.js";import"./index.esm-2eyhaxSG.js";import"./DataDownload-qP7mMT4R.js";import"./Dropdown-tcPmk1CW.js";import"./usePopper-D0d76HL1.js";import"./index-B-yFm4aN.js";import"./SimpleButton-DMpLUrh0.js";import"./index-BbP3371Q.js";import"./index-BKD8Dact.js";import"./util-C2ce4qgt.js";import"./index-BAMY2Nnw.js";import"./useSketchProperties-CFXDSTtm.js";import"./ReportContext-BTL8L5yF.js";import"./useTranslation-BpTe-nno.js";import"./context-CnTB_i5T.js";import"./Toolbar-BiCs23CE.js";import"./CheckboxGroup-CGUa5GG0.js";import"./_getPrototype-CLNpD7aq.js";import"./cloneDeep-DUn4YpqL.js";import"./Card-Chsr0-0l.js";const cn={component:a,title:"Components/Table/Table",decorators:[_e,Fe]},C=Ie.div`
  .dark {
    background-color: #000;
    color: #eee;
  }
  .med {
    background-color: #ddd;
  }
  .light {
    background-color: #efefef;
  }

  .centered th:not(:first-child) {
    text-align: center;
  }

  .centered td:not(:first-child) {
    text-align: center;
  }

  .squeeze {
    font-size: 11px;
  }
`,De=new Intl.NumberFormat("en",{style:"percent"}),c=()=>{const e=[{Header:"Name",accessor:"name"},{Header:"Count",accessor:"count"}];return n.jsx(a,{columns:e,data:r.humanUse})},b=()=>{const e=new Intl.NumberFormat("en",{style:"percent",minimumFractionDigits:2}),t=[{Header:"ID",accessor:"id"},{Header:"Count",Cell:o=>n.jsx("div",{children:"Number.format(cell.value)"}),accessor:"count"},{Header:"High",accessor:o=>e.format(o.high)},{Header:"Med",accessor:o=>e.format(o.med)},{Header:"Low",accessor:o=>e.format(o.low)},{Header:"Comment",accessor:"comment"}];return n.jsx(C,{children:n.jsx(a,{className:"squeeze",columns:t,data:r.randomCategorical})})},l=()=>{const e=[{Header:"Name",accessor:"fullName"},{Header:"Area",accessor:"value"},{Header:"Rank",accessor:"rank"}];return n.jsx(C,{children:n.jsx(a,{className:"centered",columns:e,data:r.ranked})})},d=()=>{const e=[{Header:"Name",accessor:"fullName",style:{width:"70%"}},{Header:"Area",accessor:"value"},{Header:"Rank",accessor:"rank"}];return n.jsx(a,{columns:e,data:r.ranked})},m=()=>{const e=[{Header:"Name",accessor:"name"},{Header:"Count",accessor:"count"},{Header:"Percent of Activity",accessor:t=>De.format(t.perc)}];return n.jsx(a,{columns:e,data:r.humanUse})},i=()=>{const e=[{Header:"Name",accessor:"fullName",style:{width:"60%"}},{Header:"Area",accessor:"value",style:{width:"20%"}},{Header:"Rank",accessor:"rank"}];return n.jsx(a,{initialState:{pageSize:2},columns:e,data:r.ranked})},u=()=>{const e=[{Header:"Name",style:{backgroundColor:"#000",color:"#eee"},columns:[{Header:"Place Name",accessor:"name",style:{backgroundColor:"#efefef"}}]},{Header:"Count",accessor:"count",style:{backgroundColor:"#ddd"}}];return n.jsx(a,{columns:e,data:r.humanUse})},p=()=>{const e=Se.useMemo(()=>[{Header:"Name",className:"dark",columns:[{Header:"Place Name",accessor:"name",className:"light"}]},{Header:"Count",accessor:"count",className:"med"}],[]);return n.jsx(C,{children:n.jsx(a,{columns:e,data:r.humanUse})})},f=()=>{const e=[{Header:"Name",accessor:"name"},{Header:"Count",accessor:"count"}],t=s=>s.id==="name"?{style:{color:"green"}}:{},o=s=>s.id==="count"?{style:{fontStyle:"italic"}}:{},xe=s=>s.values.count>1?{style:{fontWeight:"bold"}}:{},Te=s=>s.column.id==="count"&&s.value>1?{style:{backgroundColor:"#aaa"}}:{};return n.jsx(a,{columns:e,data:r.humanUse,headerProps:t,columnProps:o,rowProps:xe,cellProps:Te})},h=()=>{const e={type:"every",filters:[{name:"Show only count < 500K",defaultValue:!1,filterFn:o=>o.count<2e6},{name:"Show only odd IDs",defaultValue:!0,filterFn:o=>parseInt(o.id)%2!==0}]},t=[{Header:"ID",accessor:"id"},{Header:"Count",accessor:"count"}];return n.jsx(ke,{filterSelect:e,columns:Se.useMemo(()=>t,[]),data:Pe()})},y=()=>{const e=[{Header:"Name",accessor:"name"},{Header:"Count",accessor:"count"}];return n.jsx(a,{title:"Table Title",columns:e,data:r.humanUse})},g=()=>{const e=[{Header:"Name",accessor:"name"},{Header:"Count",accessor:"count"}];return n.jsx(a,{title:"Table Title",downloadEnabled:!0,downloadFilename:"humanUse",columns:e,data:r.humanUse})},H=()=>{const e=[{Header:"Name",accessor:"name"},{Header:"Count",accessor:"count"}];return n.jsx(a,{title:"Table Title",downloadEnabled:!0,downloadFilename:"humanUse",columns:e,data:[]})};c.__docgenInfo={description:`Types don't have to be specified for table Columns or data in simple use cases
but it provides you with Intellisense and can help avoid unexpected behavior
If the columns or data change they can/should be wrapped in React.useMemo to avoid
extra renders or infinite call stack errors,`,methods:[],displayName:"simple"};b.__docgenInfo={description:"",methods:[],displayName:"squeeze"};l.__docgenInfo={description:"",methods:[],displayName:"centered"};d.__docgenInfo={description:"",methods:[],displayName:"setWidth"};m.__docgenInfo={description:"Beware the formatted value is what's used by sort function, Cell function can be better",methods:[],displayName:"formattedPercColumn"};i.__docgenInfo={description:"",methods:[],displayName:"paging"};u.__docgenInfo={description:"",methods:[],displayName:"configDrivenStyle"};p.__docgenInfo={description:"",methods:[],displayName:"classDrivenStyle"};f.__docgenInfo={description:"Any prop can be overridden with these functions, for example onClick, onEnter",methods:[],displayName:"dataDrivenProps"};h.__docgenInfo={description:"",methods:[],displayName:"filterCheckboxes"};y.__docgenInfo={description:"",methods:[],displayName:"tableWithTitle"};g.__docgenInfo={description:"",methods:[],displayName:"tableWithDownload"};H.__docgenInfo={description:"",methods:[],displayName:"tableWithNoData"};var N,w,v,S,x;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "name"
  }, {
    Header: "Count",
    accessor: "count"
  }];
  return <Table columns={columns} data={fixtures.humanUse} />;
}`,...(v=(w=c.parameters)==null?void 0:w.docs)==null?void 0:v.source},description:{story:`Types don't have to be specified for table Columns or data in simple use cases
but it provides you with Intellisense and can help avoid unexpected behavior
If the columns or data change they can/should be wrapped in React.useMemo to avoid
extra renders or infinite call stack errors,`,...(x=(S=c.parameters)==null?void 0:S.docs)==null?void 0:x.description}}};var T,k,F;b.parameters={...b.parameters,docs:{...(T=b.parameters)==null?void 0:T.docs,source:{originalSource:`() => {
  const Percent2 = new Intl.NumberFormat("en", {
    style: "percent",
    minimumFractionDigits: 2
  });
  const columns: Column<Categorical>[] = [{
    Header: "ID",
    accessor: "id"
  }, {
    Header: "Count",
    Cell: cell => <div>Number.format(cell.value)</div>,
    // Not working?
    accessor: "count"
  }, {
    Header: "High",
    accessor: row => Percent2.format(row.high)
  }, {
    Header: "Med",
    accessor: row => Percent2.format(row.med)
  }, {
    Header: "Low",
    accessor: row => Percent2.format(row.low)
  }, {
    Header: "Comment",
    accessor: "comment"
  }];
  return <TableStyled>
      <Table className="squeeze" columns={columns} data={fixtures.randomCategorical} />
    </TableStyled>;
}`,...(F=(k=b.parameters)==null?void 0:k.docs)==null?void 0:F.source}}};var _,P,I,D,j;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "fullName"
  }, {
    Header: "Area",
    accessor: "value"
  }, {
    Header: "Rank",
    accessor: "rank"
  }];
  return <TableStyled>
      <Table className="centered" columns={columns} data={fixtures.ranked} />
    </TableStyled>;
}`,...(I=(P=l.parameters)==null?void 0:P.docs)==null?void 0:I.source},description:{story:"Centered",...(j=(D=l.parameters)==null?void 0:D.docs)==null?void 0:j.description}}};var U,R,W,A,z;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "fullName",
    style: {
      width: "70%"
    }
  }, {
    Header: "Area",
    accessor: "value"
  }, {
    Header: "Rank",
    accessor: "rank"
  }];
  return <Table columns={columns} data={fixtures.ranked} />;
}`,...(W=(R=d.parameters)==null?void 0:R.docs)==null?void 0:W.source},description:{story:"Set width",...(z=(A=d.parameters)==null?void 0:A.docs)==null?void 0:z.description}}};var E,M,q,V,B;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`() => {
  const columns: Column<HumanUse>[] = [{
    Header: "Name",
    accessor: "name"
  }, {
    Header: "Count",
    accessor: "count"
  }, {
    Header: "Percent of Activity",
    accessor: row => Percent.format(row.perc)
  }];
  return <Table columns={columns} data={fixtures.humanUse} />;
}`,...(q=(M=m.parameters)==null?void 0:M.docs)==null?void 0:q.source},description:{story:`Formatted column ***
Beware the formatted value is what's used by sort function, Cell function can be better`,...(B=(V=m.parameters)==null?void 0:V.docs)==null?void 0:B.description}}};var K,L,O,G,J;i.parameters={...i.parameters,docs:{...(K=i.parameters)==null?void 0:K.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "fullName",
    style: {
      width: "60%"
    }
  },
  // Fixed width prevents dynamic variation between pages
  {
    Header: "Area",
    accessor: "value",
    style: {
      width: "20%"
    }
  }, {
    Header: "Rank",
    accessor: "rank"
  }];
  return <Table initialState={{
    pageSize: 2
  }} columns={columns} data={fixtures.ranked} />;
}`,...(O=(L=i.parameters)==null?void 0:L.docs)==null?void 0:O.source},description:{story:"Paging",...(J=(G=i.parameters)==null?void 0:G.docs)==null?void 0:J.description}}};var Q,X,Y,Z,$;u.parameters={...u.parameters,docs:{...(Q=u.parameters)==null?void 0:Q.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    style: {
      backgroundColor: "#000",
      color: "#eee"
    },
    columns: [{
      Header: "Place Name",
      accessor: "name",
      style: {
        backgroundColor: "#efefef"
      }
    }]
  }, {
    Header: "Count",
    accessor: "count",
    style: {
      backgroundColor: "#ddd"
    }
  }];
  return <Table columns={columns} data={fixtures.humanUse} />;
}`,...(Y=(X=u.parameters)==null?void 0:X.docs)==null?void 0:Y.source},description:{story:"Style override",...($=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:$.description}}};var ee,ne,ae,oe,re;p.parameters={...p.parameters,docs:{...(ee=p.parameters)==null?void 0:ee.docs,source:{originalSource:`() => {
  const columns: Column[] = React.useMemo(() => [{
    Header: "Name",
    className: "dark",
    columns: [{
      Header: "Place Name",
      accessor: "name",
      className: "light"
    }]
  }, {
    Header: "Count",
    accessor: "count",
    className: "med"
  }], []);
  return <TableStyled>
      <Table columns={columns} data={fixtures.humanUse} />
    </TableStyled>;
}`,...(ae=(ne=p.parameters)==null?void 0:ne.docs)==null?void 0:ae.source},description:{story:"Class-driven styling",...(re=(oe=p.parameters)==null?void 0:oe.docs)==null?void 0:re.description}}};var se,te,ce,le,de;f.parameters={...f.parameters,docs:{...(se=f.parameters)==null?void 0:se.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "name"
  }, {
    Header: "Count",
    accessor: "count"
  }];
  const headerFn = header => header.id === "name" ? {
    style: {
      color: "green"
    }
  } : {};
  const colFn = column => column.id === "count" ? {
    style: {
      fontStyle: "italic"
    }
  } : {};
  const rowFn = row => row.values.count > 1 ? {
    style: ({
      fontWeight: "bold"
    } as CSSProperties)
  } : {};
  const cellFn = cell => cell.column.id === "count" && cell.value > 1 ? {
    style: {
      backgroundColor: "#aaa"
    }
  } : {};
  return <Table columns={columns} data={fixtures.humanUse} headerProps={headerFn} columnProps={colFn} rowProps={rowFn} cellProps={cellFn} />;
}`,...(ce=(te=f.parameters)==null?void 0:te.docs)==null?void 0:ce.source},description:{story:`Data-driven styling
Any prop can be overridden with these functions, for example onClick, onEnter`,...(de=(le=f.parameters)==null?void 0:le.docs)==null?void 0:de.description}}};var me,ie,ue,pe,fe;h.parameters={...h.parameters,docs:{...(me=h.parameters)==null?void 0:me.docs,source:{originalSource:`() => {
  const filterSelect: FilterSelect<Categorical> = {
    type: "every",
    filters: [{
      name: "Show only count < 500K",
      defaultValue: false,
      filterFn: row => row.count < 2_000_000
    }, {
      name: "Show only odd IDs",
      defaultValue: true,
      filterFn: row => parseInt(row.id) % 2 !== 0
    }]
  };
  const columns: Column<Categorical>[] = [{
    Header: "ID",
    accessor: "id"
  }, {
    Header: "Count",
    accessor: "count"
  }];
  return <FilterSelectTable filterSelect={filterSelect} columns={React.useMemo(() => columns, [])} data={getRandomCategorical()} />;
}`,...(ue=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:ue.source},description:{story:"Filtering",...(fe=(pe=h.parameters)==null?void 0:pe.docs)==null?void 0:fe.description}}};var he,be,ye;y.parameters={...y.parameters,docs:{...(he=y.parameters)==null?void 0:he.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "name"
  }, {
    Header: "Count",
    accessor: "count"
  }];
  return <Table title="Table Title" columns={columns} data={fixtures.humanUse} />;
}`,...(ye=(be=y.parameters)==null?void 0:be.docs)==null?void 0:ye.source}}};var ge,He,Ce;g.parameters={...g.parameters,docs:{...(ge=g.parameters)==null?void 0:ge.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "name"
  }, {
    Header: "Count",
    accessor: "count"
  }];
  return <Table title="Table Title" downloadEnabled={true} downloadFilename="humanUse" columns={columns} data={fixtures.humanUse} />;
}`,...(Ce=(He=g.parameters)==null?void 0:He.docs)==null?void 0:Ce.source}}};var Ne,we,ve;H.parameters={...H.parameters,docs:{...(Ne=H.parameters)==null?void 0:Ne.docs,source:{originalSource:`() => {
  const columns: Column[] = [{
    Header: "Name",
    accessor: "name"
  }, {
    Header: "Count",
    accessor: "count"
  }];
  return <Table title="Table Title" downloadEnabled={true} downloadFilename="humanUse" columns={columns} data={[]} />;
}`,...(ve=(we=H.parameters)==null?void 0:we.docs)==null?void 0:ve.source}}};const ln=["simple","squeeze","centered","setWidth","formattedPercColumn","paging","configDrivenStyle","classDrivenStyle","dataDrivenProps","filterCheckboxes","tableWithTitle","tableWithDownload","tableWithNoData"];export{ln as __namedExportsOrder,l as centered,p as classDrivenStyle,u as configDrivenStyle,f as dataDrivenProps,cn as default,h as filterCheckboxes,m as formattedPercColumn,i as paging,d as setWidth,c as simple,b as squeeze,g as tableWithDownload,H as tableWithNoData,y as tableWithTitle};
