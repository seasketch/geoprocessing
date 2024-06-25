import{j as n}from"./jsx-runtime-qGIIFXMu.js";import{R as f}from"./ReportDecorator-CVkrvWea.js";import{C as s,u as k}from"./CheckboxGroup-CGUa5GG0.js";import{a as u}from"./Card-Chsr0-0l.js";import"./index-CDs2tPxN.js";import"./ReportContext-BTL8L5yF.js";import"./index-BAMY2Nnw.js";import"./_getPrototype-CLNpD7aq.js";import"./cloneDeep-DUn4YpqL.js";import"./styled-components.browser.esm-Bui9LJgA.js";const T={component:s,title:"Components/CheckboxGroup",decorators:[f]},o=()=>{const c=k([{name:"one",checked:!1},{name:"two",checked:!1},{name:"three",checked:!1},{name:"four",checked:!1}]);return n.jsxs("div",{children:[n.jsx(s,{...c}),n.jsxs("div",{children:["Selected:"," ",c.checkboxes.map(t=>t.checked?t.name:"").join(" ")]})]})},e=()=>{const c=k([{name:"one",checked:!1},{name:"two",checked:!1},{name:"three",checked:!1},{name:"four",checked:!1}]);return n.jsx(u,{children:n.jsx("div",{style:{fontSize:10},children:n.jsx(s,{...c})})})};o.__docgenInfo={description:"",methods:[],displayName:"simple"};e.__docgenInfo={description:"Demonstrate vertical alignment is maintained",methods:[],displayName:"smallText"};var a,r,i;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const options = [{
    name: "one",
    checked: false
  }, {
    name: "two",
    checked: false
  }, {
    name: "three",
    checked: false
  }, {
    name: "four",
    checked: false
  }];
  const checkboxState = useCheckboxes(options);
  // The whole point of using a hook here is we can easily access the state externally and indepdendently of the checkbox UI component
  return <div>
      <CheckboxGroup {...checkboxState} />
      <div>
        Selected:{" "}
        {checkboxState.checkboxes.map(c => c.checked ? c.name : "").join(" ")}
      </div>
    </div>;
}`,...(i=(r=o.parameters)==null?void 0:r.docs)==null?void 0:i.source}}};var m,d,h,p,l;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const options = [{
    name: "one",
    checked: false
  }, {
    name: "two",
    checked: false
  }, {
    name: "three",
    checked: false
  }, {
    name: "four",
    checked: false
  }];
  const checkboxState = useCheckboxes(options);
  return <Card>
      <div style={{
      fontSize: 10
    }}>
        <CheckboxGroup {...checkboxState} />
      </div>
    </Card>;
}`,...(h=(d=e.parameters)==null?void 0:d.docs)==null?void 0:h.source},description:{story:"Demonstrate vertical alignment is maintained",...(l=(p=e.parameters)==null?void 0:p.docs)==null?void 0:l.description}}};const D=["simple","smallText"];export{D as __namedExportsOrder,T as default,o as simple,e as smallText};
