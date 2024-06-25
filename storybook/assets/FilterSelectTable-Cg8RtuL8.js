import{j as r}from"./jsx-runtime-qGIIFXMu.js";import{R as h}from"./index-CDs2tPxN.js";import{T as b}from"./Table-BanuEKp9.js";import{u as d,C as k}from"./CheckboxGroup-CGUa5GG0.js";import{p as S}from"./styled-components.browser.esm-Bui9LJgA.js";const F=S.div`
  input {
    margin: 0px 10px 0px 0px;
  }

  table {
    margin-bottom: 10px;
  }
  .checkbox-group {
    margin: 10px 0px 10px 0px;
  }
`;function T(n){const{filterSelect:p,data:s,...m}=n,{type:f="some",filterPosition:i="bottom",filters:c}=p,u=c.map(e=>({name:e.name,checked:e.defaultValue})),t=d(u),x=h.useMemo(()=>{const e=c.filter((a,o)=>t.checkboxes[o].checked);return s.filter(a=>e.length===0?!0:e[f]((o,g)=>o.filterFn(a)))},[s,t.checkboxes]),l=r.jsx(k,{...t});return r.jsxs(F,{className:"filter-select-table",children:[i==="top"&&l,r.jsx(b,{data:x,...m}),i==="bottom"&&l]})}T.__docgenInfo={description:`Table with customizable filter functions as CheckboxGroup that when selected
filter the rows if the function return true.  By default only 'some' filter function
has to match for it to filter the row`,methods:[],displayName:"FilterSelectTable",props:{filterSelect:{required:!0,tsType:{name:"FilterSelect",elements:[{name:"D"}],raw:"FilterSelect<D>"},description:""}},composes:["TableOptions"]};export{T as F};
