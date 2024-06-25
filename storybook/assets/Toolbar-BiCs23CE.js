import{j as p}from"./jsx-runtime-qGIIFXMu.js";import{p as f}from"./styled-components.browser.esm-Bui9LJgA.js";import{g as c}from"./index-CDs2tPxN.js";var u={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(s){(function(){var a={}.hasOwnProperty;function o(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];r&&(e=l(e,n(r)))}return e}function n(e){if(typeof e=="string"||typeof e=="number")return e;if(typeof e!="object")return"";if(Array.isArray(e))return o.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var r in e)a.call(e,r)&&e[r]&&(t=l(t,r));return t}function l(e,t){return t?e?e+" "+t:e+t:e}s.exports?(o.default=o,s.exports=o):window.classNames=o})()})(u);var d=u.exports;const m=c(d),g=f.div`
  &.gp-toolbar {
    display: flex;
    position: relative;
    justify-content: space-between;
  }

  & h2 {
    font-family: sans-serif;
    font-size: 14px;
    color: rgb(116, 116, 116);
    margin: 0px;
    font-weight: 400;
  }

  &.gp-toolbar-gutter {
    padding: 0px 16px 0px 16px;
  }

  &.gp-toolbar-regular {
    min-height: 42px;
  }

  &.gp-toolbar-dense {
    min-height: 30px;
  }
`,i=({children:s,variant:a="regular",useGutters:o=!0,toolbarCls:n="",titleAlign:l="baseline",style:e={},...t})=>{const r=m("gp-toolbar",{"gp-toolbar-gutter":o,"gp-toolbar-regular":a==="regular","gp-toolbar-dense":a==="dense"},n);return p.jsx(g,{className:r,...t,style:{...e,alignItems:l},children:s})},y=i;i.__docgenInfo={description:"",methods:[],displayName:"Toolbar",props:{variant:{defaultValue:{value:'"regular"',computed:!1},required:!1},useGutters:{defaultValue:{value:"true",computed:!1},required:!1},toolbarCls:{defaultValue:{value:'""',computed:!1},required:!1},titleAlign:{defaultValue:{value:'"baseline"',computed:!1},required:!1},style:{defaultValue:{value:"{}",computed:!1},required:!1}}};export{y as T};
