import{j as t}from"./jsx-runtime-qGIIFXMu.js";import"./ReportDecorator-CVkrvWea.js";import{p as d}from"./number-BYw_ucvH.js";import{T as p}from"./Table-BanuEKp9.js";import{p as r}from"./styled-components.browser.esm-Bui9LJgA.js";import{R as f}from"./ReportTableStyled-DeNLJsmW.js";import{u as h}from"./useTranslation-BpTe-nno.js";const u=r(f)`
  .styled {
    font-size: 13px;

    td:last-child,
    th:last-child {
      text-align: right;
    }
  }
`,y=r(u)`
  & {
    width: 100%;
    overflow-x: scroll;
  }

  & th:first-child,
  & td:first-child {
    position: sticky;
    left: 0;
    background: #efefef;
  }

  & th,
  & td {
  }

  .styled {
    font-size: 12px;
`,b=({rows:a,metricGroup:o,formatPerc:n=!1})=>{const{t:l}=h(),i=l("MPA"),c=o.classes.map(e=>({Header:e.display,accessor:s=>n?d(isNaN(s[e.classId])?0:s[e.classId]):s[e.classId]})),m=[{Header:i,accessor:e=>t.jsx("div",{style:{width:120},children:e.sketchName})},...c];return t.jsx(y,{children:t.jsx(p,{className:"styled",columns:m,data:a.sort((e,s)=>e.sketchName.localeCompare(s.sketchName))})})};b.__docgenInfo={description:`Table displaying sketch class metrics, one table row per sketch
@param SketchClassTableProps
@returns`,methods:[],displayName:"SketchClassTable",props:{rows:{required:!0,tsType:{name:"Array",elements:[{name:"Record",elements:[{name:"string"},{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]}],raw:"Record<string, string | number>"}],raw:"Record<string, string | number>[]"},description:"Table rows, expected to have sketchName property and one property for each classId in classes"},metricGroup:{required:!0,tsType:{name:"z.infer",elements:[{name:"metricGroupSchema"}],raw:"z.infer<typeof metricGroupSchema>"},description:"Data class definitions"},formatPerc:{required:!1,tsType:{name:"boolean"},description:"Whether to format values as percentages, defaults to false",defaultValue:{value:"false",computed:!1}}}};export{b as S};
