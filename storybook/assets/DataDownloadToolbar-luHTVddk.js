import{j as o}from"./jsx-runtime-qGIIFXMu.js";import{p}from"./styled-components.browser.esm-Bui9LJgA.js";import{T as i}from"./Toolbar-BiCs23CE.js";import{D as c}from"./DataDownload-qP7mMT4R.js";const m=p.div`
  & .gp-data-download-toolbar h2 {
    flex-grow: 1;
  }
`,u=({title:a,variant:e="dense",useGutters:r=!1,filename:t,formats:s,data:d})=>{const l={title:a,variant:e,useGutters:r},n={filename:t,formats:s,data:d};return o.jsx(m,{children:o.jsxs(i,{toolbarCls:"gp-data-download-toolbar",...l,children:[typeof a=="string"?o.jsx("h2",{children:a}):a,o.jsx("div",{children:o.jsx(c,{...n})})]})})};u.__docgenInfo={description:"Convenience component that creates a Toolbar with Header and DataDownload",methods:[],displayName:"DataDownloadToolbar",props:{title:{required:!0,tsType:{name:"string"},description:""},variant:{defaultValue:{value:'"dense"',computed:!1},required:!1},useGutters:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["DataDownloadProps","Omit"]};export{u as D};
