import{j as t}from"./jsx-runtime-qGIIFXMu.js";import{p as s}from"./styled-components.browser.esm-Bui9LJgA.js";const n=s.span`
  background-color: ${e=>e.color?e.color:"#DDD"};
  padding: 3px 5px;
  border-radius: ${e=>e.size?`${e.size}px`:"17px"};
  min-width: ${e=>e.size?`${e.size}px`:"17px"};
  max-width: ${e=>e.size?`${e.size}px`:"17px"};
  height: ${e=>e.size?`${e.size+4}px`:"21px"};
  display: flex;
  justify-content: center;
  align-items: center;
`,o=({children:e,color:r,size:i})=>t.jsx(n,{color:r,size:i,children:e}),c=({children:e,group:r,groupColorMap:i})=>t.jsx(o,{color:i[r],children:e});o.__docgenInfo={description:"Circle with user-defined component inside",methods:[],displayName:"Circle",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},color:{required:!1,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"number"},description:""}}};c.__docgenInfo={description:"Circle with user-defined group colors",methods:[],displayName:"GroupCircle",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"React component to put inside the circle"},group:{required:!0,tsType:{name:"string"},description:"Group to use for this circle"},groupColorMap:{required:!0,tsType:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>"},description:"Mapping of group names to color"}}};export{o as C,c as G,n as S};
