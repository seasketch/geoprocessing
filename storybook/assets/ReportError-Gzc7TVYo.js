var l=Object.defineProperty;var c=(e,t,r)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var s=(e,t,r)=>c(e,typeof t!="symbol"?t+"":t,r);import{j as o}from"./jsx-runtime-qGIIFXMu.js";import{R as m}from"./index-CDs2tPxN.js";import{C as d}from"./Card-Chsr0-0l.js";import{p as h}from"./styled-components.browser.esm-Bui9LJgA.js";import{u as f}from"./useTranslation-BpTe-nno.js";const u=h.div`
  display: inline-block;
  font-weight: bold;
  font-size: 18px;
  line-height: 1em;
  background-color: #ea4848;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  color: white;
  text-align: center;
  margin-right: 8px;
  ::before {
    position: relative;
    bottom: -1px;
    content: "!";
  }
`,g=()=>{const{t:e}=f();return o.jsxs(d,{children:[o.jsxs("div",{role:"alert",children:[o.jsx(u,{}),e("ReportError - message part 1","Something went wrong. Please close this report and try again.")]}),o.jsx("p",{children:e("ReportError - message part 2","If the error persists, please report it.")})]})};class a extends m.Component{constructor(){super(...arguments);s(this,"state",{hasError:!1,error:{message:"",stack:""},info:{componentStack:""}});s(this,"componentDidCatch",(r,n)=>{this.setState({error:r,info:n})})}render(){const{hasError:r,error:n,info:i}=this.state;r&&console.info(n.message,i);const{children:p}=this.props;return r?o.jsx(g,{}):p}}s(a,"getDerivedStateFromError",r=>({hasError:!0}));a.__docgenInfo={description:"",methods:[{name:"getDerivedStateFromError",docblock:null,modifiers:["static"],params:[{name:"error",optional:!1,type:null}],returns:null},{name:"componentDidCatch",docblock:null,modifiers:[],params:[{name:"error",optional:!1,type:null},{name:"info",optional:!1,type:null}],returns:null}],displayName:"ReportError",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};export{a as R};
