import{j as t}from"./jsx-runtime-qGIIFXMu.js";import{f as d,h,a as s,b as p,c as u}from"./iucnProtectionLevel-KZvFkafK.js";import"./ReportDecorator-CVkrvWea.js";import{p as y}from"./styled-components.browser.esm-Bui9LJgA.js";import{u as N}from"./useTranslation-BpTe-nno.js";const I=y.div`
  td,
  th {
    padding: 5px 6px;
  }
  tr > :nth-child(n + 2) {
    text-align: center;
  }
  td {
    border: 1px solid #999;
  }
  table {
    border-collapse: collapse;
  }

  .full {
    background-color: ${d};
  }

  .high {
    background-color: ${h};
  }

  .yes,
  .yesbut,
  .variable {
    background-color: #ddd;
  }
`,v=()=>{const{t:i}=N(),o={RESEARCH_NE:i("IUCN activity - research","Research: non-extractive"),TRAD_USE_NE:i("IUCN activity - traditional use","Traditional use: non-extractive"),RESTORE_CON:i("IUCN activity - restoration","Restoration/enhancement for conservation"),TRAD_FISH_COLLECT:i("IUCN activity - traditional fishing","Traditional fishing/collection"),RECREATE_NE:i("IUCN activity - non-extractive","Non-extractive recreation"),TOURISM:i("IUCN activity - tourism","Large scale high intensity tourism"),SHIPPING:i("IUCN activity - shipping","Shipping"),RESEARCH:i("IUCN activity - research extractive","Research: extractive"),RENEWABLE_ENERGY:i("IUCN activity - renewable","Renewable energy generation"),RESTORE_OTH:i("IUCN activity - restoration","Restoration/enhancement for other reasons"),FISH_COLLECT_REC:i("IUCN activity - fishing sustainable","Fishing/collection: recreational (sustainable)"),FISH_COLLECT_LOCAL:i("IUCN activity - local fishing","Fishing/collection: local fishing (sustainable)"),FISH_AQUA_INDUSTRIAL:i("IUCN activity - industrial fishing","Industrial fishing, industrial scale aquaculture"),AQUA_SMALL:i("IUCN activity - aquaculture","Aquaculture - small scale"),WORKS:i("IUCN activity - works","Works (harbors, ports, dredging)"),UNTREATED_WATER:i("IUCN activity - untreated water","Untreated water discharge"),MINING_OIL_GAS:i("IUCN activity - extraction","Mining, oil and gas extraction"),HABITATION:i("IUCN activity - habitation","Habitation")},n={no:{id:"no",desc:i("IUCN rank - no description","No"),display:i("IUCN rank - shorthand label for no","N")},nobut:{id:"nobut",desc:i("IUCN rank - special no description","Generally no, a strong prerogative against unless special circumstances apply"),display:`${i("IUCN rank - shorthand label for no, with extra meaning","N*")}`},yes:{id:"yes",desc:i("IUCN rank - yes description","Yes"),display:i("IUCN rank - shorthand label for yes","Y")},yesbut:{id:"yesbut",desc:i("IUCN rank - special yes description","Yes because no alternative exists, but special approval is essential"),display:`${i("IUCN rank - shorthand label for yes, with extra meaning","Y*")}`},variable:{id:"variable",desc:i("IUCN rank - special 'variable' description","Variable; depends on whether this activity can be managed in such a way that it is compatible with the MPA’s objectives"),display:"*"}};return console.log(n),t.jsx(I,{children:t.jsxs("table",{children:[t.jsxs("thead",{children:[t.jsxs("tr",{children:[t.jsx("th",{}),t.jsx("th",{className:"full",colSpan:4,children:i("Full protection level label","Full")}),t.jsx("th",{className:"high",colSpan:3,children:i("High protection level label","High")})]}),t.jsxs("tr",{children:[t.jsx("th",{children:i("Activity")}),Object.keys(s).sort().map((e,a)=>t.jsx("th",{className:s[e].level,children:s[e].category},a))]})]}),t.jsx("tbody",{children:Object.values(p).map((e,a)=>t.jsxs("tr",{children:[t.jsx("td",{children:o[e.id]}),u[e.id].map((r,c)=>{const l=i(n[r].display);return t.jsx("td",{className:r,children:l},c)})]},a))})]})})};v.__docgenInfo={description:"",methods:[],displayName:"IucnMatrix"};export{v as I};
