import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{C as l}from"./Card-Chsr0-0l.js";import{u as j}from"./ReportDecorator-CVkrvWea.js";import{f as R,p as o}from"./styled-components.browser.esm-Bui9LJgA.js";import{S as i}from"./Skeleton-C5SgFVsI.js";import{R as S}from"./ReportError-Gzc7TVYo.js";import{u as v}from"./useTranslation-BpTe-nno.js";const N=R`
  0% {
      background-position: 100% 0%;
    }
  100% {
    background-position: 0% 0%;
  }
`,k=o.div.attrs(r=>({$duration:1}))`
  background: #ddd;
  height: 4px;
  background: linear-gradient(90deg, #ddd 50%, white 50%);
  background-size: 200% 200%;
  background-position: 0%;
  animation: ${N} linear;
  animation-iteration-count: once;
  /* animation-timing-function: ease-in-out; */
  animation-duration: ${r=>r.$duration+"s"};
  position: relative;
`,C=o.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  overflow: hidden;
  border-radius: 0px 0px 4px 4px;
`,T=()=>e.jsxs("div",{children:[e.jsx(i,{}),e.jsx(i,{}),e.jsx(i,{}),e.jsx(i,{style:{width:"25%"}})]}),V=o.div`
  display: inline-block;
  font-weight: bold;
  font-size: 18px;
  line-height: 1em;
  background-color: #ea4848;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  color: white;
  text-align: center;
  margin-right: 8px;
  ::before {
    position: relative;
    bottom: -1px;
    content: "!";
  }
`;o.div`
  height: 20px;
  margin-top: 5px;
  padding-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  font-style: italic;
  width: 100%;
  text-align: center;
  display: none;
`;function q({functionName:r,skeleton:m,children:c,title:f,titleStyle:g={},style:h={},useChildCard:x=!1,extraParams:b={}}){if(!r)throw new Error("No function specified for ResultsCard");const{t:w}=v(),y=w("ResultsCard - no result message","Report run completed, but no results returned"),s={style:h,title:f,titleStyle:g};let{task:t,loading:d,error:a}=j(r,b),u=5;t&&t.estimate&&(u=Math.round(t.estimate/1e3)),t&&t.estimate,t&&!t.data&&!d&&(t.error?a=t.error:a=y);let n;if(a)n=e.jsx(l,{...s,children:e.jsxs("div",{role:"alert",children:[e.jsx(V,{}),a]})});else if(d)n=e.jsxs(l,{...s,children:[m||e.jsx(T,{}),e.jsx(C,{children:e.jsx(k,{$duration:u})})]});else if(t&&t.data){const p=c(t.data);x?n=e.jsx(e.Fragment,{children:p}):n=e.jsx(l,{...s,children:p})}else throw new Error;return e.jsx(S,{children:n})}q.__docgenInfo={description:"",methods:[],displayName:"ResultsCard",props:{functionName:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"signature",type:"function",raw:"(results: T) => ReactNode",signature:{arguments:[{type:{name:"T"},name:"results"}],return:{name:"ReactNode"}}},description:""},skeleton:{required:!1,tsType:{name:"ReactNode"},description:""},title:{required:!1,tsType:{name:"union",raw:"string | ReactNode",elements:[{name:"string"},{name:"ReactNode"}]},description:""},titleStyle:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}},style:{required:!1,tsType:{name:"object"},description:"",defaultValue:{value:"{}",computed:!1}},useChildCard:{required:!1,tsType:{name:"boolean"},description:"Assumes caller will provide card in children to use results (e.g. ToolbarCard with DataDownload). Shows a simple card until loading complete",defaultValue:{value:"false",computed:!1}},extraParams:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"union",raw:`| string
| number
| boolean
| null
| { [x: string]: JSONValue }
| Array<JSONValue>`,elements:[{name:"string"},{name:"number"},{name:"boolean"},{name:"null"},{name:"signature",type:"object",raw:"{ [x: string]: JSONValue }",signature:{properties:[{key:{name:"string"},value:{name:"JSONValue",required:!0}}]}},{name:"Array",elements:[{name:"JSONValue"}],raw:"Array<JSONValue>"}]}],raw:"Record<string, JSONValue>"},description:"Additional runtime parameters from report client for geoprocessing function.",defaultValue:{value:"{}",computed:!1}}}};export{q as R};
