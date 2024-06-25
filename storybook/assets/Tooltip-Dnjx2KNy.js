import{j as t}from"./jsx-runtime-qGIIFXMu.js";import{r as o,R as v}from"./index-CDs2tPxN.js";import{p as n}from"./styled-components.browser.esm-Bui9LJgA.js";import{u as y}from"./usePopper-D0d76HL1.js";const g=n.div`
  visibility: ${({$visible:r})=>r?"visible":"hidden"};
  max-width: 200px;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  font-size: 12px;
  font-weight: normal;
`,T=n.button`
  border: none;
  background: none;
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
`,R=n.div`
  text-align: center;
  padding: 5px;
`,z=({children:r,placement:l="auto",offset:u={horizontal:0,vertical:0},text:p,width:c=200})=>{const[d,i]=o.useState(!1),s=o.useRef(null),e=o.useRef(null),{horizontal:f,vertical:m}=u,{styles:a,attributes:x}=y(s.current,e.current,{placement:l,modifiers:[{name:"offset",enabled:!0,options:{offset:[f,m]}}]}),h=()=>{i(!0),e.current&&(e.current.style.zIndex="100")},b=()=>{i(!1),e.current&&(e.current.style.zIndex="-100")};return t.jsxs(v.StrictMode,{children:[t.jsx(T,{ref:s,style:r.props.style,onMouseOver:h,onMouseLeave:b,children:r}),t.jsx("div",{ref:e,style:{zIndex:-100,...a.popper},...x.popper,children:t.jsx(g,{style:{...a.offset,width:c},$visible:d,children:t.jsx(R,{children:p})})})]})};z.__docgenInfo={description:"",methods:[],displayName:"Tooltip",props:{text:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""},placement:{required:!1,tsType:{name:"popper.Placement"},description:"",defaultValue:{value:'"auto"',computed:!1}},offset:{required:!1,tsType:{name:"signature",type:"object",raw:"{ horizontal: number; vertical: number }",signature:{properties:[{key:"horizontal",value:{name:"number",required:!0}},{key:"vertical",value:{name:"number",required:!0}}]}},description:"",defaultValue:{value:"{ horizontal: 0, vertical: 0 }",computed:!1}},width:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"200",computed:!1}}}};export{z as T};
