import{O as a}from"./ReportDecorator-CVkrvWea.js";const d=(o,s)=>o.reduce((e,t)=>{const n=s(t);return{...e,[n]:t}},{}),r=Object.keys,j=(o,s)=>{const e=s.find(t=>t.objectiveId===o);if(e)return e;throw new Error(`Objective not found - ${o}`)},y=o=>{const s=d(o,e=>e.objectiveId);return r(s).reduce((e,t)=>{const n=s[t],c=r(n.countsToward),u=c.findIndex(i=>n.countsToward[i]!==a)-1;return{...e,[t]:c[u]}},{})};export{r as a,j as b,y as g,d as k};
