"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[95886],{87946:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>t,metadata:()=>l,toc:()=>a});var o=s(74848),i=s(28453);const t={},r="Tutorial Introduction",l={id:"tutorials/Tutorials",title:"Tutorial Introduction",description:"These tutorials will teach you the fundamentals of creating and deploying a seasketch geoprocessing project. They expect you already have a basic working knowledge of your computer, its operating system, command line interfaces, and web application development.",source:"@site/docs/tutorials/Tutorials.md",sourceDirName:"tutorials",slug:"/tutorials/",permalink:"/geoprocessing/docs/next/tutorials/",draft:!1,unlisted:!1,editUrl:"https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/docs/tutorials/Tutorials.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Concepts",permalink:"/geoprocessing/docs/next/concepts"},next:{title:"Create New Project",permalink:"/geoprocessing/docs/next/tutorials/newproject"}},c={},a=[{value:"Assumptions",id:"assumptions",level:2},{value:"Initial System Setup",id:"initial-system-setup",level:2},{value:"Install Options",id:"install-options",level:3},{value:"If Install Option #1 - Local Docker Environment",id:"if-install-option-1---local-docker-environment",level:3},{value:"Option #2 - MacOS Bare Metal / Windows WSL",id:"option-2---macos-bare-metal--windows-wsl",level:3},{value:"MacOS",id:"macos",level:4},{value:"Windows",id:"windows",level:4},{value:"Final Steps",id:"final-steps",level:3}];function d(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"tutorial-introduction",children:"Tutorial Introduction"})}),"\n",(0,o.jsxs)(n.p,{children:["These tutorials will teach you the fundamentals of creating and deploying a seasketch ",(0,o.jsx)(n.code,{children:"geoprocessing"})," project. They expect you already have a basic working knowledge of your computer, its operating system, command line interfaces, and web application development."]}),"\n",(0,o.jsx)(n.h2,{id:"assumptions",children:"Assumptions"}),"\n",(0,o.jsx)(n.p,{children:"Unless otherwise instructed, assume:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"You are working within the VSCode editor, with your top-level directory open as the project workspace"}),"\n",(0,o.jsx)(n.li,{children:"All commands are entered within a VSCode terminal, usually with the top-level project directory as the current working directory"}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"initial-system-setup",children:"Initial System Setup"}),"\n",(0,o.jsxs)(n.p,{children:["This tutorial gets your system ready to ",(0,o.jsx)(n.a,{href:"/geoprocessing/docs/next/tutorials/newproject",children:"create a new geoprocessing project"})," or ",(0,o.jsx)(n.a,{href:"/geoprocessing/docs/next/tutorials/existingproject",children:"setup an existing project"}),"."]}),"\n",(0,o.jsx)(n.p,{children:"Examples of existing projects for reference and inspiration. Note, some may use older versions of the geoprocessing library and may look a little different."}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"https://github.com/seasketch/fsm-reports",children:"FSM Reports"})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"https://github.com/seasketch/samoa-reports",children:"Samoa Reports"})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"https://github.com/seasketch/maldives-nearshore-reports",children:"Maldives Nearshore Reports"})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"https://github.com/seasketch/azores-nearshore-reports",children:"Azores Nearshore Reports"})}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"You will need a computer running at least:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Windows 11"}),"\n",(0,o.jsx)(n.li,{children:"MacOS 11.6.8 Big Sur"}),"\n",(0,o.jsx)(n.li,{children:"Linux: untested but recent versions of Linux such as Ubuntu, Debian, or Fedora should be possible that are capable of running VSCode and Docker Desktop."}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Web browser:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Chrome is the most common but Firefox, Safari, Edge can also work. Their developer tools will all be a little different."}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"install-options",children:"Install Options"}),"\n",(0,o.jsx)(n.p,{children:"You have 3 options for how to develop geoprocessing projects"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:["Local Docker environment","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Docker provides a sandboxed Ubuntu Linux environment on your local computer, setup specifically for geoprocessing projects."}),"\n",(0,o.jsx)(n.li,{children:"Best for: intermediate to power users doing development every day"}),"\n",(0,o.jsxs)(n.li,{children:["Pros","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Provides a fully configured environment, with installation of many of the third-party dependencies already take care of."}),"\n",(0,o.jsx)(n.li,{children:"Docker workspace is isolated from your host operating system. You can remove or recreate these environment as needed."}),"\n",(0,o.jsx)(n.li,{children:"You can work completely offline once you are setup."}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Cons","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"You will need to get comfortable with Docker Desktop software."}),"\n",(0,o.jsx)(n.li,{children:"Docker is slower than running directly on your system (maybe 30%)"}),"\n",(0,o.jsx)(n.li,{children:"Syncing data from network drives like Box into the Docker container is more challenging."}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["MacOS Bare Metal / Windows WSL","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"All geoprocessing dependencies are installed and maintained directly by you on your local computer operating system. For MacOS this means no virtualization is done. For Windows, this means running Ubuntu via WSL2 aka the Windows Subsystem for Linux."}),"\n",(0,o.jsx)(n.li,{children:"Best for - power user."}),"\n",(0,o.jsx)(n.li,{children:"Pros - fastest speeds because you are running without virtualization (aka bare metal)"}),"\n",(0,o.jsx)(n.li,{children:"Cons - prone to instability and issues due to progression of dependency versions or operating system changes. Difficult to test and ensure stable support for all operating systems and processors (amd64, arm64)."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Choose an option and follow the instructions below to get started. You can try out different options over time."}),"\n",(0,o.jsx)(n.h3,{id:"if-install-option-1---local-docker-environment",children:"If Install Option #1 - Local Docker Environment"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://www.docker.com/products/docker-desktop/",children:"Docker Desktop"})," for either Apple chip or Intel chip as appropriate to your system and make sure it's running.","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["If you don't know which you have, click the apple icon in the top left and select ",(0,o.jsx)(n.code,{children:"About This Mac"})," and look for ",(0,o.jsx)(n.code,{children:"Processor"})]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://code.visualstudio.com",children:"VS Code"})," and open it"]}),"\n",(0,o.jsx)(n.li,{children:"Clone the geoprocessing devcontainer repository to your system"}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/seasketch/geoprocessing-devcontainer\n"})}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsx)(n.p,{children:"Open the geoprocessing-devcontainer folder in VSCode"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"File"})," -> ",(0,o.jsx)(n.code,{children:"Open Folder"})," -> geoprocessing-devcontainer folder"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsx)(n.p,{children:"If you are prompted to install suggested extensions, then do so, otherwise go to the Extension panel and install the following:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Remote Development"}),"\n",(0,o.jsx)(n.li,{children:"Dev Containers"}),"\n",(0,o.jsx)(n.li,{children:"Docker"}),"\n",(0,o.jsx)(n.li,{children:"Remote Explorer"}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:["Once you have DevContainer support, you should be prompted to \u201dReopen folder to develop in a container\u201d. ",(0,o.jsx)("b",{children:(0,o.jsx)(n.em,{children:"Do not do this yet."})})]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:["Under the ",(0,o.jsx)(n.code,{children:".devcontainer/local-dev"})," folder, make a copy of the ",(0,o.jsx)(n.code,{children:".env.template"})," file and rename it to ",(0,o.jsx)(n.code,{children:".env"}),"."]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Fill in your POEditor API token for you account, which you can find here - ",(0,o.jsx)(n.a,{href:"https://poeditor.com/account/api",children:"https://poeditor.com/account/api"}),". If you don't have one, then follow the instructions to ",(0,o.jsx)(n.a,{href:"/geoprocessing/docs/next/gip/GIP-1-i18n#setup-poeditor-as-an-independent-developer",children:"create your own"}),"."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:["If you have a data folder to mount into the docker container from your host operating system, edit the ",(0,o.jsx)(n.code,{children:".devcontainer/local-dev/docker-compose.yml"})," file and uncomment the volume below this comment"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"# Bound host volume for Box data folder"})}),"\n",(0,o.jsx)(n.li,{children:"The volume is preset to bind to your Box Sync folder in you home directory but you can change it to any path in your operating system where your data resides for all your projects."}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsx)(n.p,{children:"To start the devcontainer at any time"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Cmd-Shift-P"})," to open command palette"]}),"\n",(0,o.jsx)(n.li,{children:"type \u201cReopen in container\u201d and select the Dev Container command to do so."}),"\n",(0,o.jsxs)(n.li,{children:["VSCode will reload, pull the latest ",(0,o.jsx)(n.code,{children:"geoprocessing-workspace"})," docker image, run it, and start a remote code experience inside the container."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsx)(n.p,{children:"Once container starts"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["It will automatically clone the geoprocessing repository into your environment under ",(0,o.jsx)(n.code,{children:"/workspaces/geoprocessing"}),", and then run ",(0,o.jsx)(n.code,{children:"npm install"})," to install all dependencies. Wait for this process to finish which can take up to 3-4 minutes the first time."]}),"\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Ctrl-J"})," will open a terminal inside the container."]}),"\n",(0,o.jsxs)(n.li,{children:["Navigate to geoprocessing and verify tests run successfully.","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"cd /workspaces/geoprocessing"})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"npm run test"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"If success, then you're now ready to create a new geoprocessing project in your devcontainer environment."}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["To stop devcontainer at any time","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"Cmd-Shift-P"})," to open command palette and type ",(0,o.jsx)(n.code,{children:"\u201cDevContainers: Rebuild and Reopen locally\u201d"})," to find command and hit Enter."]}),"\n",(0,o.jsxs)(n.li,{children:["Choose ",(0,o.jsx)(n.code,{children:"Local Workspace"})]}),"\n",(0,o.jsx)(n.li,{children:"Your devcontainer will now bootstrap, downloading the geoprocessing docker image and installing everything."}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Notice the bottom left blue icon in your vscode window. It may say ",(0,o.jsx)(n.code,{children:"Opening remote connection"})," and eventually will say ",(0,o.jsx)(n.code,{children:"Dev Container: Geoprocessing"}),". This is telling you that this VSCode window is running in a devcontainer environment."]}),"\n",(0,o.jsxs)(n.li,{children:["To exit your devcontainer:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Click the blue icon in the bottom left, and click ",(0,o.jsx)(n.code,{children:"Reopen locally"}),". This will bring VSCode back out of the devcontainer session."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["To delete a devcontainer:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:'This is often the easiest way to "start over" with your devcontainer.'}),"\n",(0,o.jsx)(n.li,{children:"First, make sure you've pushed all of your code work to Github."}),"\n",(0,o.jsx)(n.li,{children:"Make sure you stop your active VSCODE devcontainer session."}),"\n",(0,o.jsx)(n.li,{children:"Open the Remote Explorer panel in the left sidebar."}),"\n",(0,o.jsx)(n.li,{children:"You can right-click and delete any existing devcontainers and volumes to start over."}),"\n",(0,o.jsx)(n.li,{children:"You can also see and delete them from the Docker Desktop app, but it might not be obvious which containers and volumes are which. The VSCode Remote Explorer window gives you that context."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"Manage Devcontainers",src:s(17383).A+"",title:"Manage Devcontainers",width:"582",height:"962"})}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["To upgrade your devcontainer:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["The devcontainer settings in this repository may change/improve over time. You can always pull the latest changes for your ",(0,o.jsx)(n.code,{children:"geoprocessing-devcontainer"})," repository, and then ",(0,o.jsx)(n.code,{children:"Cmd-Shift-P"})," to open command palette and type ",(0,o.jsx)(n.code,{children:"\u201cDevContainers: Rebuild and Reopen locally\u201d"}),"."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["To upgrade the ",(0,o.jsx)(n.code,{children:"geoprocessing-workspace"})," Docker image","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["This devcontainer builds on the ",(0,o.jsx)(n.code,{children:"geoprocessing-workspace"})," Docker image published at ",(0,o.jsx)(n.a,{href:"https://hub.docker.com/r/seasketch/geoprocessing-workspace/tags",children:"Docker Hub"}),". It will always install the latest version of this image when you setup your devcontainer for the first time."]}),"\n",(0,o.jsxs)(n.li,{children:["It is up to you to upgrade it after the initial installation. The most likely situation is:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["You see some changes in the ",(0,o.jsx)(n.a,{href:"https://github.com/seasketch/docker-gp-workspace/blob/main/Changelog.md",children:"Changelog"})," that you want to utilize."]}),"\n",(0,o.jsxs)(n.li,{children:["You are upgrading the ",(0,o.jsx)(n.code,{children:"geoprocessing"})," library for your project to a newer version and it requires additional software that isn't in your current devcontainer. This situation should be flagged in the geoprocessing ",(0,o.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/CHANGELOG.md",children:"changelog"}),"."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["In both cases you should be able to simply update your docker image to the latest. The easiest way to do this is to:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Push all of your unsaved work in your devcontainer to Github. This is in case the Docker ",(0,o.jsx)(n.code,{children:"named volume"})," where your code lives (which is separate from the devcontainer) is somehow lost. There are also ways to make a backup of a named volume and recover it if needed but that is an advanced exercise not discussed at this time."]}),"\n",(0,o.jsx)(n.li,{children:"Stop your devcontainer session"}),"\n",(0,o.jsxs)(n.li,{children:["Go to the ",(0,o.jsx)(n.code,{children:"Images"})," menu in Docker Desktop, finding your ",(0,o.jsx)(n.code,{children:"seasketch/geoprocessing-workspace"}),"."]}),"\n",(0,o.jsxs)(n.li,{children:['If it shows as "IN USE" then switch to the ',(0,o.jsx)(n.code,{children:"Containers"})," menu and stop all containers using ",(0,o.jsx)(n.code,{children:"seasketch/geoprocessing-workspace"}),"."]}),"\n",(0,o.jsxs)(n.li,{children:["Now switch back to ",(0,o.jsx)(n.code,{children:"Images"})," and pull a new version of the ",(0,o.jsx)(n.code,{children:"seasketch/geoprocessing-image"})," by hovering your cursor over the image, clicking the 3-dot menu on the right side and the clicking ",(0,o.jsx)(n.code,{children:"Pull"}),". This will pull the newest version of this image."]}),"\n",(0,o.jsxs)(n.li,{children:["Once complete, you should be able to restart your devcontainer and it will be running the latest ",(0,o.jsx)(n.code,{children:"geoprocessing-workspace"}),"."]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"option-2---macos-bare-metal--windows-wsl",children:"Option #2 - MacOS Bare Metal / Windows WSL"}),"\n",(0,o.jsx)(n.h4,{id:"macos",children:"MacOS"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:["Install ",(0,o.jsx)(n.a,{href:"https://nodejs.org/en/download/",children:"Node JS"})," >= v20.0.0"]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.a,{href:"https://github.com/nvm-sh/nvm",children:"nvm"})," is great for this, then ",(0,o.jsx)(n.code,{children:"nvm install v20"}),". May ask you to first install XCode developer tools as well which is available through the App Store or follow the instructions provided when you try to install nvm."]}),"\n",(0,o.jsxs)(n.li,{children:["Then open your Terminal app of choice and run ",(0,o.jsx)(n.code,{children:"node -v"})," to check your node version"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:["Install ",(0,o.jsx)(n.a,{href:"https://code.visualstudio.com",children:"VS Code"})]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Install recommended ",(0,o.jsx)(n.a,{href:"https://code.visualstudio.com/docs/editor/extension-marketplace",children:"extensions"})," when prompted. If not prompted, go to the ",(0,o.jsx)(n.code,{children:"Extensions"})," panel on the left side and install the extensions named in ",(0,o.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/templates/project/.vscode/extensions.json",children:"this file"})]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:["Install ",(0,o.jsx)(n.a,{href:"https://www.npmjs.com/",children:"NPM"})," package manager >= v10.5.0 after installing node. The version that comes with node may not be recent enough."]}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"npm --version"})," to check"]}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"npm install -g latest"})}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:["Install ",(0,o.jsx)(n.a,{href:"https://www.java.com/en/download/",children:"Java runtime"})," for MacOS (required by AWS CDK library)"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsx)(n.p,{children:"Create a free Github account if you don't have one already"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Set your git username"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.h4,{id:"windows",children:"Windows"}),"\n",(0,o.jsxs)(n.p,{children:["For Windows, you won't actually be running bare metal. your ",(0,o.jsx)(n.code,{children:"geoprocessing"})," project and the underlying code run in a Docker container running Ubuntu Linux. This is done using the Windows Subsystem for Linux (WSL2) so performance is actually quite good. Docker Desktop and VSCode both know how to work seamlessly with WSL2. Some of the building blocks you will install in Windows (Git, AWSCLI) and link them into the Ubuntu Docker container. The rest will be installed directly in the Ubuntu Docker container."]}),"\n",(0,o.jsx)(n.p,{children:"In Windows:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/windows/wsl/install",children:"WSL2 with Ubuntu distribution"})]}),"\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://docs.docker.com/desktop/windows/wsl/",children:"Docker Desktop with WSL2 support"})," and make sure Docker is running"]}),"\n",(0,o.jsxs)(n.li,{children:["Open start menu -> ",(0,o.jsx)(n.code,{children:"Ubuntu on Windows"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"This will start a bash shell in your Ubuntu Linux home directory"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"In Ubuntu:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://stackoverflow.com/questions/63866813/what-is-the-proper-way-of-using-jdk-on-wsl2-on-windows-10",children:"Java runtime"})," in Ubuntu (required by AWS CDK library)"]}),"\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-git",children:"Git in Ubuntu and Windows"})]}),"\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode",children:"VS Code"})," in Windows and setup with WSL2.","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Install recommended ",(0,o.jsx)(n.a,{href:"https://code.visualstudio.com/docs/editor/extension-marketplace",children:"extensions"})," when prompted. If not prompted, go to the ",(0,o.jsx)(n.code,{children:"Extensions"})," panel on the left side and install the extensions named in ",(0,o.jsx)(n.a,{href:"https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/templates/project/.vscode/extensions.json",children:"this file"})]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://nodejs.org/en/download/",children:"Node JS"})," >= v16.0.0 in Ubuntu","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.a,{href:"https://github.com/nvm-sh/nvm",children:"nvm"})," is great for this, then ",(0,o.jsx)(n.code,{children:"nvm install v16"}),"."]}),"\n",(0,o.jsxs)(n.li,{children:["Then open your Terminal app of choice and run ",(0,o.jsx)(n.code,{children:"node -v"})," to check version"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Install ",(0,o.jsx)(n.a,{href:"https://www.npmjs.com/",children:"NPM"})," package manager >= v8.5.0 after installing node. The version that comes with node may not be recent enough.","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.code,{children:"npm --version"})," to check"]}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"npm install -g latest"})}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"final-steps",children:"Final Steps"}),"\n",(0,o.jsxs)(n.p,{children:["Whichever option you chose, if you haven't already, establish the ",(0,o.jsx)(n.a,{href:"https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git?platform=mac",children:"username"})," and email address git should associate with your commits."]}),"\n",(0,o.jsx)(n.p,{children:"You can set these per repository, or set them globall on your system for all repositories and override them as needed. Here's the commands to set globally for your environment."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:'git config --global user.name "Your Name"\ngit config --global user.email "yourusername@yourprovider.com"\n'})}),"\n",(0,o.jsx)(n.p,{children:"Now verify it was set:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"# If you set global - all repos\ncat ~/.gitconfig\n\n# If you set local - current repo\ncat .git/config\n"})}),"\n",(0,o.jsxs)(n.p,{children:["At this point your system is ready for you to ",(0,o.jsx)(n.code,{children:"create a new project"}),", or ",(0,o.jsx)(n.code,{children:"setup an existing project"})]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},17383:(e,n,s)=>{s.d(n,{A:()=>o});const o=s.p+"assets/images/ManageDevcontainers-27e4bf8f272ef4623eb9840cf4782470.jpg"},28453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>l});var o=s(96540);const i={},t=o.createContext(i);function r(e){const n=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),o.createElement(t.Provider,{value:n},e.children)}}}]);