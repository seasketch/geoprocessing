import"./ReportDecorator-CVkrvWea.js";import{p as d,r as $}from"./number-BYw_ucvH.js";import{j as r}from"./jsx-runtime-qGIIFXMu.js";import{p as G}from"./styled-components.browser.esm-Bui9LJgA.js";const m=new Intl.NumberFormat("en",{style:"decimal"}),N=(e,t)=>t==="value"?e:t==="percent0dig"?d(typeof e=="string"?parseFloat(e):e,{digits:0}):t==="percent"?d(typeof e=="string"?parseFloat(e):e):t==="percent1dig"?d(typeof e=="string"?parseFloat(e):e,{digits:1}):t==="percent2dig"?d(typeof e=="string"?parseFloat(e):e,{digits:2}):t==="number"?m.format(typeof e=="string"?parseFloat(e):e):t==="number1dig"?m.format($(typeof e=="string"?parseFloat(e):e,1)):t==="number2dig"?m.format($(typeof e=="string"?parseFloat(e):e,2)):t==="integer"?m.format(parseInt(`${e}`)):t(e),o={barHeight:30,titleWidth:35},L=G.div`
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
    width: 20%;
    text-align: right;
    color: #666;
  }
  figure {
    margin: 2em auto 2em auto;
    max-width: 1100px;
    position: relative;
  }
  .graphic {
    padding-left: 10px;
  }
  .row {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 0.9em;
    width: ${e=>e.$titleWidth?e.$titleWidth:o.titleWidth}%;
    padding-right: 5px;
    text-align: right;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: right;
  }

  @keyframes expand {
    from {
      width: 0%;
    }
    to {
      width: ${e=>e.$showTitle?e.$titleWidth?e.$titleWidth:o.titleWidth:92}%;
    }
  }
  @media screen and (min-width: 768px) {
    @keyframes expand {
      from {
        width: 0%;
      }
      to {
        width: ${e=>e.$showTitle?e.$titleWidth?e.$titleWidth:o.titleWidth:92}%;
      }
    }
  }
  .chart {
    position: relative;
    overflow: visible;
    width: 0%;
    animation: expand 1.5s ease forwards;
  }

  .row + .row .chart {
    animation-delay: 0.2s;
  }
  .row + .row + .row .chart {
    animation-delay: 0.4s;
  }
  .block.yes {
    outline: 1px solid #999;
  }
  .block {
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${e=>e.$barHeight||o.barHeight}px;
    color: #333;
    font-size: 0.75em;
    float: left;
    background-color: #999;
    position: relative;
    overflow: hidden;
    opacity: 1;
    transition:
      opacity,
      0.3s ease;
    cursor: pointer;
  }

  .block:hover {
    opacity: 0.65;
  }

  .x-axis {
    text-align: center;
    padding: 1em 0 0.5em;
  }

  .legend {
    margin: 0 auto;
    padding: 0;
    font-size: 0.9em;
  }
  .legend li {
    display: inline-block;
    padding: 0.25em 0.8em;
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

  .zero-marker {
    position: absolute;
    left: -1.5px;
    height: ${e=>(e.$barHeight||o.barHeight)*1.5}px;
    width: 1.5px;
    background-color: #aaa;
    top: -${e=>(e.$barHeight||o.barHeight)*.25}px;
  }

  ${e=>e.$rowTotals.map((t,a)=>`
        .row-${a} .total-label {
          position: absolute;
          left: ${t+.75}%;
          width: 100px;
          font-size: 0.9em;
          text-shadow: 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF, 0 0 2px #FFF;
          font-weight: bold;
          color: #666;
          height: ${e.$barHeight||o.barHeight}px;
          display: flex;
          align-items: center;
        }
    `)}

  ${e=>e.$target?`
        .marker-label {
          position: absolute;
          ${e.$targetLabelPosition||"top"}: ${e.$targetLabelStyle==="normal"?"-15":"-12"}px;
          left: ${e.$target?e.$target:0}%;
          width: 100px;
          text-align: left;
          font-size: 0.7em;
          color: #999;
        }
      
        .marker {
          position: absolute;
          left: ${e.$target}%;
          height: ${(e.$barHeight||o.barHeight)+4}px;
          width: 3px;
          background-color: #000;
          opacity: 0.35;
          top: -2px;
          border-radius: 2px;
        }
    `:""}

  ${e=>e.$blockGroupColors.map((t,a)=>`
      .legend li:nth-of-type(${a+1}):before {
        background-color: ${t};
      }
    `)}

  @media screen and (min-width: 768px) {
    h6 {
      padding: 0 0.5em 0.5em 0;
      width: 6em;
      float: left;
    }
    .block {
      font-size: 1em;
    }
    .legend {
      width: 100%;
    }
  }
`,R=({rows:e,rowConfigs:t,max:a=100,barHeight:k,titleWidth:F,showLegend:S=!0,showTitle:h=!0,showTotalLabel:T=!0,showTargetLabel:j=!0,targetLabelPosition:H="top",targetLabelStyle:q="normal",target:s,blockGroupNames:v,valueFormatter:f,targetValueFormatter:b,targetReachedColor:y,...c})=>{const p=e[0].length,x=c.blockGroupStyles&&c.blockGroupStyles.length>=p?c.blockGroupStyles:[{backgroundColor:"blue"},{backgroundColor:"green"},{backgroundColor:"gray"}],l=e.reduce((n,i)=>[...n,B(i)],[]);return l.map(n=>{a-n<-.001&&console.warn(`Row sum of ${n} is greater than max: ${a}. Check your input data`)}),r.jsx(L,{$rowTotals:l,$target:s,$barHeight:k,$showTitle:h,$titleWidth:F,$blockGroupColors:x.map(n=>n.backgroundColor).slice(0,p),$targetLabelPosition:H,$targetLabelStyle:q,children:r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"graphic",children:e.map((n,i)=>{const u=t[i].title,z=typeof u=="function"?u:()=>u,C=s&&l[i]>=s;return r.jsxs("div",{className:`row row-${i}`,children:[h&&r.jsx("div",{className:"title",children:z(l[i])}),r.jsxs("div",{className:"chart",children:[n.map((W,g)=>W.map((E,w)=>r.jsx("span",{style:{width:`${E}%`,...x[g],...C&&y?{backgroundColor:y}:{}},className:`block-group-${g} block-${w} block`},`${g}${w}`))),r.jsx("div",{className:"zero-marker"}),s&&r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"marker"}),j&&i===0&&r.jsx("div",{className:"marker-label",children:b?b(s):"Target"})]}),T&&r.jsx("div",{className:"total-label",children:f?f(l[i]):l[i]})]})]},`row-${i}`)})}),S&&r.jsx("div",{className:"x-axis",children:r.jsx("ul",{className:"legend",children:v.slice(0,p).map((n,i)=>r.jsx("li",{children:n},i))})})]})})},B=e=>e.reduce((t,a)=>t+J(a),0),J=e=>e.reduce((t,a)=>t+a,0);R.__docgenInfo={description:"Horizontal stacked bar chart component",methods:[],displayName:"HorizontalStackedBar",props:{rows:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"Array",elements:[{name:"number"}],raw:"Block[]"}],raw:"BlockGroup[]"}],raw:"HorizontalStackedBarRow[]"},description:"row data"},rowConfigs:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  title: string | ((value: number) => string | JSX.Element);
}`,signature:{properties:[{key:"title",value:{name:"union",raw:"string | ((value: number) => string | JSX.Element)",elements:[{name:"string"},{name:"unknown"}],required:!0}}]}}],raw:"RowConfig[]"},description:"row config"},max:{required:!1,tsType:{name:"number"},description:"Maximum value for each row",defaultValue:{value:"100",computed:!1}},blockGroupNames:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},blockGroupStyles:{required:!1,tsType:{name:"Array",elements:[{name:"ReactCSSProperties",raw:"React.CSSProperties"}],raw:"React.CSSProperties[]"},description:"Style for each block group"},barHeight:{required:!1,tsType:{name:"number"},description:""},titleWidth:{required:!1,tsType:{name:"number"},description:""},target:{required:!1,tsType:{name:"number"},description:""},showTargetLabel:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showTitle:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showLegend:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showTotalLabel:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},targetLabelPosition:{required:!1,tsType:{name:"union",raw:'"top" | "bottom"',elements:[{name:"literal",value:'"top"'},{name:"literal",value:'"bottom"'}]},description:"",defaultValue:{value:'"top"',computed:!1}},targetLabelStyle:{required:!1,tsType:{name:"union",raw:'"normal" | "tight"',elements:[{name:"literal",value:'"normal"'},{name:"literal",value:'"tight"'}]},description:"",defaultValue:{value:'"normal"',computed:!1}},valueFormatter:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string | JSX.Element",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"union",raw:"string | JSX.Element",elements:[{name:"string"},{name:"JSX.Element"}]}}},description:""},targetValueFormatter:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string | JSX.Element",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"union",raw:"string | JSX.Element",elements:[{name:"string"},{name:"JSX.Element"}]}}},description:""},targetReachedColor:{required:!1,tsType:{name:"string"},description:""}}};export{R as H,N as v};
