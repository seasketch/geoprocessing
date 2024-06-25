import{j as r}from"./jsx-runtime-qGIIFXMu.js";import{S as p}from"./Circle-mHCIeQdA.js";import{p as t}from"./styled-components.browser.esm-Bui9LJgA.js";const l=t(p)`
  border: 3px solid white;
  border-top-left-radius: ${e=>e.size?`${e.size}px`:"17px"};
  border-top-right-radius: 0;
  border-bottom-left-radius: ${e=>e.size?`${e.size}px`:"17px"};
  border-bottom-right-radius: ${e=>e.size?`${e.size}px`:"17px"};
  box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.15);
  color: white;
  font-weight: bold;
  text-shadow: 0px 0px 2px #333;
`,n=({children:e,color:o,size:i})=>r.jsx(l,{color:o,size:i,children:e}),a=t.span`
  background-color: green;
  background-image: linear-gradient(
    ${e=>e.$bottomColor||"#aaa"}
      ${e=>`${100-e.$perc}%`},
    ${e=>e.$topColor||"green"}
      ${e=>`${100-e.$perc}%`}
  );
  padding: 3px 5px;
  border-radius: ${e=>e.$size?`${e.$size}px`:"17px"};
  min-width: ${e=>e.$size?`${e.$size}px`:"17px"};
  max-width: ${e=>e.$size?`${e.$size}px`:"17px"};
  height: ${e=>e.$size?`${e.$size+4}px`:"21px"};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid white;
  border-top-left-radius: ${e=>e.$size?`${e.$size}px`:"17px"};
  border-top-right-radius: 0;
  border-bottom-left-radius: ${e=>e.$size?`${e.$size}px`:"17px"};
  border-bottom-right-radius: ${e=>e.$size?`${e.$size}px`:"17px"};
  box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.15);
  color: white;
  font-weight: bold;
  text-shadow: 0px 0px 2px #333;
`,c=({children:e,topColor:o,bottomColor:i,perc:s,size:d})=>r.jsx(a,{$topColor:o,$bottomColor:i,$perc:s,$size:d,children:e});n.__docgenInfo={description:"Circle with pointy top right corner",methods:[],displayName:"PointyCircle"};c.__docgenInfo={description:"Two-color reg-based classification circle for collection index value",methods:[],displayName:"TwoColorPointyCircle",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},bottomColor:{required:!1,tsType:{name:"string"},description:"Bottom color of circle"},topColor:{required:!1,tsType:{name:"string"},description:"Top color of circle"},perc:{required:!0,tsType:{name:"number"},description:"Percent height bottom color will take up"},size:{required:!1,tsType:{name:"number"},description:"Radius of circle in pixels, minimum 5"}}};export{n as P,c as T};
