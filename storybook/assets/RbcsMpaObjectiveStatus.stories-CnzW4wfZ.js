import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{O as h,b,a as x}from"./ReportDecorator-CVkrvWea.js";import{p as n}from"./number-BYw_ucvH.js";import{C as w}from"./CardDecorator-JG7Qo-Oa.js";import"./SimpleButton-DMpLUrh0.js";import"./HorizontalStackedBar-BAux7rfy.js";import{p as y}from"./styled-components.browser.esm-Bui9LJgA.js";import"./WatersDiagram-BjxOGr2F.js";import"./SketchAttributesCard-yUnbj6En.js";import"./IucnDesignationTable-CzyQm-pt.js";import"./IucnLevelCircle-C5CyLrAM.js";import"./IucnLevelPill-Bb1tIbfH.js";import"./IucnMatrix-CkhY5OBy.js";import"./Table-BanuEKp9.js";import"./ClassTable-QBMNWMeC.js";import"./FilterSelectTable-Cg8RtuL8.js";import"./SketchClassTable-CQZ_ilSv.js";import"./ReportTableStyled-DeNLJsmW.js";import"./GroupCircleRow-ClzzeiZJ.js";import"./TranslatorAsync-BVbRhhEu.js";import"./index-CDs2tPxN.js";import"./ReportContext-BTL8L5yF.js";import"./Card-Chsr0-0l.js";import"./Circle-mHCIeQdA.js";import"./Collapse-Dn7_bGES.js";import"./CheckboxGroup-CGUa5GG0.js";import"./DataDownload-qP7mMT4R.js";import"./DataDownloadToolbar-luHTVddk.js";import"./Dropdown-tcPmk1CW.js";import"./InfoStatus-wkkNfxVv.js";import"./KeySection-Cfa_nIIg.js";import"./LayerToggle-CMkgBS93.js";import{O as M}from"./ObjectiveStatus-cLiXvBX0.js";import"./Pill-BCTf2KEs.js";import"./ResultsCard-BosgCTC5.js";import"./ReportError-Gzc7TVYo.js";import"./ReportPage-DYQW_yI4.js";import"./SegmentControl-CR3tewjT.js";import"./Skeleton-C5SgFVsI.js";import"./Toolbar-BiCs23CE.js";import"./ToolbarCard-DpzyBK3c.js";import"./VerticalSpacer-1NsnhAiq.js";import"./Tooltip-Dnjx2KNy.js";import"./GeographySwitcher-T8rkfZuJ.js";import"./PointyCircle-BX3ZCbTF.js";import"./RbcsIcons-Dh7A4Hcc.js";import"./RbcsLearnMore-DYxMy2CJ.js";import"./RbcsMpaClassPanel-D1ctz2_o.js";import"./RbcsZoneClassPanel-Dd-UxV36.js";import{a as f}from"./objective-Cx9S2_iI.js";import"./index-BAMY2Nnw.js";import"./_getPrototype-CLNpD7aq.js";import"./cloneDeep-DUn4YpqL.js";import"./useTranslation-BpTe-nno.js";import"./context-CnTB_i5T.js";import"./useSketchProperties-CFXDSTtm.js";import"./iucnProtectionLevel-KZvFkafK.js";import"./extends-CF3RwP-h.js";import"./index.esm-2eyhaxSG.js";import"./helpers-BzaOjzWG.js";import"./_baseIteratee-DiQvJByy.js";import"./InfoCircleFill.esm-WQjR5DY7.js";import"./CheckCircleFill.esm-Dm2DhJsT.js";import"./iframe-CDEMpSoA.js";import"../sb-preview/runtime.js";import"./index-BbP3371Q.js";import"./index-BKD8Dact.js";import"./util-C2ce4qgt.js";import"./usePopper-D0d76HL1.js";import"./index-B-yFm4aN.js";import"./rbcs-BHXFcvGv.js";y.div`
  h3,
  h6 {
    margin: 0;
    line-height: 1em;
  }
  h3 {
    margin-bottom: 1em;
  }
  h6 {
    font-size: 0.8em;
    padding: 0 0.5em 0.5em 0;
    width: 5em;
    text-align: right;
    color: #666;
  }
  figure {
    margin: 1em auto;
    max-width: 1100px;
    position: relative;
  }
  .graphic {
    padding-left: 10px;
  }

  .chart {
    position: relative;
    overflow: visible;
    width: 0%;
    animation: expand 1.5s ease forwards;
  }

  .x-axis {
    text-align: center;
    padding: 0em 0 0.5em;
  }

  .legend {
    margin: 0 auto;
    padding: 0;
    font-size: 0.9em;
  }
  .legend li {
    display: inline-block;
    padding: 0.25em 1em;
    line-height: 1em;
  }
  .legend li:before {
    content: "";
    margin-right: 0.5em;
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #334d5c;
  }

  ${t=>t.blockGroupColors.map((r,o)=>`
      .legend li:nth-of-type(${o+1}):before {
        background-color: ${r};
      }
    `)}

  @media screen and (min-width: 768px) {
    h6 {
      padding: 0 0.5em 0.5em 0;
      width: 5em;
      float: left;
    }
    .legend {
      width: 80%;
    }
  }
`;const v=new URLSearchParams(window.location.search);v.get("service");v.get("frameId")||window.name;const p=({level:t,objective:r,renderMsg:o})=>{const j=o?o(r,t):P(r,t);return e.jsx(M,{status:r.countsToward[t],msg:j})},P=(t,r)=>t.countsToward[r]===h?e.jsxs(e.Fragment,{children:["This MPA counts towards protecting"," ",e.jsx("b",{children:n(t.target)})," of planning area."]}):t.countsToward[r]===b?e.jsxs(e.Fragment,{children:["This MPA ",e.jsx("b",{children:"does not"})," count towards protecting"," ",e.jsx("b",{children:n(t.target)})," of planning area."]}):e.jsxs(e.Fragment,{children:["This MPA ",e.jsx("b",{children:"may"})," count towards protecting"," ",e.jsx("b",{children:n(t.target)})," of planning area."]});p.__docgenInfo={description:"",methods:[],displayName:"RbcsMpaObjectiveStatus",props:{level:{required:!0,tsType:{name:"rbcsMpaProtectionLevels[number]",raw:"typeof rbcsMpaProtectionLevels[number]"},description:"RBCS protection level for MPA to give status for"},objective:{required:!0,tsType:{name:"RbcsObjective"},description:"RBCS objective to weigh protection level against"},renderMsg:{required:!1,tsType:{name:"signature",type:"function",raw:`(
  objective: RbcsObjective,
  level: RbcsMpaProtectionLevel
) => JSX.Element`,signature:{arguments:[{type:{name:"RbcsObjective"},name:"objective"},{type:{name:"rbcsMpaProtectionLevels[number]",raw:"typeof rbcsMpaProtectionLevels[number]"},name:"level"}],return:{name:"JSX.Element"}}},description:"optional custom objective message"}}};const De={component:p,title:"Components/Rbcs/RbcsMpaObjective",decorators:[w,x]},i={objectiveId:"eez",shortDesc:"30% protected",target:.3,countsToward:{"Fully Protected Area":"yes","Highly Protected Area":"yes","Moderately Protected Area":"maybe","Poorly Protected Area":"no","Unprotected Area":"no"}},s=()=>{const t=f(i.countsToward);return e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:["Based on the following objective ",JSON.stringify(i),":"]}),t.map((r,o)=>e.jsxs("div",{children:[e.jsx("p",{children:`If MPA has protection level: ${r}`}),e.jsx(p,{level:r,objective:i})]},o))]})},a=()=>{const t=f(i.countsToward);return e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:["Based on the following objective ",JSON.stringify(i),":"]}),t.map((r,o)=>e.jsxs("div",{children:[e.jsx("p",{children:`If MPA has protection level: ${r}`}),e.jsx(p,{level:r,objective:i,renderMsg:()=>R(i,r)})]},o))]})},R=(t,r)=>t.countsToward[r]===h?e.jsxs(e.Fragment,{children:["This most definitely counts towards protecting"," ",e.jsx("b",{children:n(t.target)})," of Lunar waters 🌙."]}):t.countsToward[r]===b?e.jsxs(e.Fragment,{children:["This most definitely ",e.jsx("b",{children:"does not"})," count towards protecting"," ",e.jsx("b",{children:n(t.target)})," of Lunar waters 🌙."]}):e.jsxs(e.Fragment,{children:["This most definitely ",e.jsx("b",{children:"may"})," count towards protecting"," ",e.jsx("b",{children:n(t.target)})," of Lunar waters 🌙."]});s.__docgenInfo={description:"",methods:[],displayName:"simple"};a.__docgenInfo={description:"",methods:[],displayName:"customMessageRenderProp"};var m,c,d;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const levels = getKeys(objective.countsToward);
  return <>
      <p>Based on the following objective {JSON.stringify(objective)}:</p>
      {levels.map((level, index) => <div key={index}>
          <p>{\`If MPA has protection level: \${level}\`}</p>
          <RbcsMpaObjectiveStatus level={level} objective={objective} />
        </div>)}
    </>;
}`,...(d=(c=s.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var l,g,u;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`() => {
  const levels = getKeys(objective.countsToward);
  return <>
      <p>Based on the following objective {JSON.stringify(objective)}:</p>
      {levels.map((level, index) => <div key={index}>
          <p>{\`If MPA has protection level: \${level}\`}</p>
          <RbcsMpaObjectiveStatus level={level} objective={objective} renderMsg={() => customRenderMsg(objective, level)} />
        </div>)}
    </>;
}`,...(u=(g=a.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const Ke=["simple","customMessageRenderProp"];export{Ke as __namedExportsOrder,a as customMessageRenderProp,De as default,s as simple};
