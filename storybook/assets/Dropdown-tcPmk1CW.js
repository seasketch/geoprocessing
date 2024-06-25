import{j as t}from"./jsx-runtime-qGIIFXMu.js";import{r as o,R as f}from"./index-CDs2tPxN.js";import{p as i}from"./styled-components.browser.esm-Bui9LJgA.js";import{u as R}from"./usePopper-D0d76HL1.js";function g(e){const r=o.useRef(null);return o.useEffect(()=>{const n=a=>{r.current&&!r.current.contains(a.target)&&e.apply(null,[!1])};return document.addEventListener("click",n,!0),()=>{document.removeEventListener("click",n,!0)}},[e]),{ref:r}}const w=i.div`
  visibility: ${({open:e})=>e?"visible":"hidden"};
  display: ${({open:e})=>e?"flex":"none"};
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.14);
`,j=i.div`
  font-family: sans-serif;
  justify-content: flex-start;
  padding: 5px;
  &:hover {
    background-color: #efefef;
  }
  &:active {
    color: #777;
  }
  a[aria-disabled="true"] {
    color: currentColor;
    text-decoration: none;
    cursor: not-allowed;

    & button {
      cursor: not-allowed;
    }
  }
`,k=i.button`
  border: none;
  background: none;
  font-family: sans-serif;
`,D=({titleElement:e=t.jsx(t.Fragment,{}),placement:r="auto",offset:n={horizontal:0,vertical:0},children:a})=>{const[l,c]=o.useState(!1),u=o.useRef(null),d=o.useRef(null),m=()=>c(!l),{ref:v}=g(c),{horizontal:b,vertical:h}=n,{styles:p,attributes:x}=R(u.current,d.current,{placement:r,modifiers:[{name:"offset",enabled:!0,options:{offset:[b,h]}}]});function y(s){s.preventDefault(),m()}return t.jsxs(f.StrictMode,{children:[t.jsx("div",{ref:v,children:t.jsx(k,{type:"button",ref:u,onClick:y,children:e})}),t.jsx("div",{ref:d,style:p.popper,...x.popper,children:t.jsx(w,{style:p.offset,open:l,children:a&&f.Children.map(a,s=>t.jsx(j,{children:s}))})})]})};D.__docgenInfo={description:"",methods:[],displayName:"Dropdown",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},titleElement:{required:!1,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:"",defaultValue:{value:"<></>",computed:!1}},placement:{required:!1,tsType:{name:"popper.Placement"},description:"",defaultValue:{value:'"auto"',computed:!1}},offset:{required:!1,tsType:{name:"signature",type:"object",raw:"{ horizontal: number; vertical: number }",signature:{properties:[{key:"horizontal",value:{name:"number",required:!0}},{key:"vertical",value:{name:"number",required:!0}}]}},description:"",defaultValue:{value:"{ horizontal: 0, vertical: 0 }",computed:!1}}}};export{D};
