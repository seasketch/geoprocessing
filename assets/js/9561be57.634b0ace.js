"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[65561],{39003:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>n,metadata:()=>a,toc:()=>d});var s=o(74848),r=o(28453);const n={},i="Setup an exising geoprocessing project",a={id:"tutorials/existingproject",title:"Setup an exising geoprocessing project",description:"This use case is where a geoprocessing project already exists, but it was developed on a different computer.",source:"@site/docs/tutorials/existingproject.md",sourceDirName:"tutorials",slug:"/tutorials/existingproject",permalink:"/geoprocessing/docs/next/tutorials/existingproject",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/tutorials/existingproject.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Create New Project",permalink:"/geoprocessing/docs/next/tutorials/newproject"},next:{title:"Deploy Project",permalink:"/geoprocessing/docs/next/tutorials/deploy"}},c={},d=[{value:"Link your source data",id:"link-your-source-data",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"setup-an-exising-geoprocessing-project",children:"Setup an exising geoprocessing project"})}),"\n",(0,s.jsx)(t.p,{children:"This use case is where a geoprocessing project already exists, but it was developed on a different computer."}),"\n",(0,s.jsx)(t.p,{children:"First, clone your existing geoprocessing project to your work environment, whether this is in your local docker devcontainer, Windows WSL, or bare metal on your operating system."}),"\n",(0,s.jsx)(t.h2,{id:"link-your-source-data",children:"Link your source data"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["figure out ",(0,s.jsx)(t.a,{href:"#link-project-data",children:"which option"})," was used to bring data into your geoprocessing project, and follow the steps to set it up."]}),"\n"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Option 1, you're good to go, the data should already be in ",(0,s.jsx)(t.code,{children:"data/src"})," and src paths in ",(0,s.jsx)(t.code,{children:"project/datasources.json"})," should have relative paths pointing into it."]}),"\n",(0,s.jsxs)(t.li,{children:["Option 2, Look at ",(0,s.jsx)(t.code,{children:"project/datasources.json"})," for the existing datasource paths and if your data file paths and operating system match you may be good to go. Try re-importing your data as below, and if it fails consider migrating to Option 1 or 3."]}),"\n",(0,s.jsxs)(t.li,{children:["Option 3, if you're running a devcontainer you'll need to have made your data available in workspace by mounting it from the host operating system via docker-compose.yml (see installation tutorial) or have somehow synced or downloaded it directly to your container. Either way, you then just need to symlink the ",(0,s.jsx)(t.code,{children:"data/src"})," directory in your project to your data. Make sure you point it to the right level of your data folder. Check the src paths in ",(0,s.jsx)(t.code,{children:"project/datasources.json"}),". If for example the source paths start with ",(0,s.jsx)(t.code,{children:"data/src/Data_Received/..."})," and your data directory is at ",(0,s.jsx)(t.code,{children:"/Users/alex/Library/CloudStorage/Box-Box/ProjectX/Data_Received"}),", you want to create your symlink as such"]}),"\n"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"ln -s /Users/alex/Library/CloudStorage/Box-Box/ProjectX data/src\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Assuming ",(0,s.jsx)(t.code,{children:"data/src"})," is now populated, you need to ensure everything is in order."]}),"\n",(0,s.jsx)(t.p,{children:"2.Reimport your data"}),"\n",(0,s.jsxs)(t.p,{children:["This will re-import, transform, and export your data to ",(0,s.jsx)(t.code,{children:"data/dist"}),", which is probably currently empty."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"npm run reimport:data\n"})}),"\n",(0,s.jsx)(t.p,{children:"Say yes to reimporting all datasources, and no to publishing them (we'll get to that)."}),"\n",(0,s.jsx)(t.p,{children:"If you see error, look at what they say. If they say datasources are not being found at their path, then something is wrong with your drive sync (files might be missing), or with your symlink if you used option 3."}),"\n",(0,s.jsxs)(t.p,{children:["If all is well, you should see no error, and ",(0,s.jsx)(t.code,{children:"data/dist"})," should be populated with files. In the Version Control panel your datasources.json file will have changes, including some updated timestamps."]}),"\n",(0,s.jsx)(t.p,{children:"But what if git changes show a lot of red and green?"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"You should look closer at what's happening. If parts of the smoke test output (examples directory JSON files) are being re-ordered, that may just be because Javascript is being a little bit different in how it generates JSON files from another computer that previously ran the tests."}),"\n",(0,s.jsx)(t.li,{children:"If you are seeing changes to your precalc values in precalc.json, then your datasources may be different from the last person that ran it. You will want to make sure you aren't using an outdated older version. If you are using an updated more recent version, then convince yourself the changes are what you expect, for example total area increases or decreases."}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"What if you just can't your data synced properly, and you just need to move forward?"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["If the project was deployed to AWS, then there will be a copy of the published data in the ",(0,s.jsx)(t.code,{children:"datasets"})," bucket in AWS S3."]}),"\n",(0,s.jsxs)(t.li,{children:["To copy this data from AWS back to your ",(0,s.jsx)(t.code,{children:"data/dist"})," directory use the following, assuming your git repo is named ",(0,s.jsx)(t.code,{children:"fsm-reports-test"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:(0,s.jsx)(t.code,{children:"aws s3 sync s3://gp-fsm-reports-test-datasets data/dist"})}),"\n"]}),"\n"]}),"\n"]})]})}function u(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},28453:(e,t,o)=>{o.d(t,{R:()=>i,x:()=>a});var s=o(96540);const r={},n=s.createContext(r);function i(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);