import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{R as p}from"./index-CDs2tPxN.js";import{p as a}from"./styled-components.browser.esm-Bui9LJgA.js";const r=a.div`
  .collapse-header {
    margin-top: 15px;
    display: flex;
    height: 20px;
  }

  .collapse-icon-container {
    margin-left: -3px;
  }

  .collapse-icon-button {
    display: block;
    border: 0;
    margin-bottom: 10px;
    padding-left: 0px;
    background-color: transparent;
    font-size: 15px;
    height: 20px;
    width: 25px;
    color: #777;
    cursor: pointer;
  }

  .collapse-text-button {
    display: block;
    border: 0;
    margin-bottom: 10px;
    padding-left: 0px;
    background-color: transparent;
    font-size: 15px;
    height: 20px;
    font-weight: bold;
    color: #777;
    cursor: pointer;
  }

  .collapse-content {
    margin-left: 15px;
    background-color: transparent;
    & p {
      margin: 10px 0px;
    }
  }

  .collapse-content.collapsed {
    display: none;
  }

  .collapsed-content.expanded {
    display: block;
  }
`,c=({collapsed:l=!0,children:s,title:n})=>{const[o,t]=p.useState(l);return e.jsxs(r,{children:[e.jsxs("div",{className:"collapse-header",children:[e.jsx("div",{className:"collapse-icon-container",children:e.jsx("button",{className:"collapse-icon-button",onClick:()=>t(!o),children:o?"▶":"▼"})}),e.jsx("button",{className:"collapse-text-button",onClick:()=>t(!o),children:n})]}),e.jsx("div",{className:`collapse-content ${o?"collapsed":"expanded"}`,"aria-expanded":o,children:s})]})};a.div`
  margin-top: 15px;
  & .collapse-header {
    margin-top: 0px;
  }
`;c.__docgenInfo={description:"",methods:[],displayName:"Collapse",props:{title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};export{c as C};
