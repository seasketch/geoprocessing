# Tutorial Introduction

These tutorials will teach you the fundamentals of creating and deploying a seasketch `geoprocessing` project. They expect you already have a basic working knowledge of your computer, its operating system, command line interfaces, and web application development.

## Assumptions

Unless otherwise instructed, assume:

- You are working within the VSCode editor, with your top-level directory open as the project workspace
- All commands are entered within a VSCode terminal, usually with the top-level project directory as the current working directory

## Initial System Setup

This tutorial gets your system ready to [create a new geoprocessing project](./newproject.md) or [setup an existing project](./existingproject.md).

Examples of existing projects for reference and inspiration. Note, some may use older versions of the geoprocessing library and may look a little different.

- [FSM Reports](https://github.com/seasketch/fsm-reports)
- [Samoa Reports](https://github.com/seasketch/samoa-reports)
- [Maldives Nearshore Reports](https://github.com/seasketch/maldives-nearshore-reports)
- [Azores Nearshore Reports](https://github.com/seasketch/azores-nearshore-reports)

You will need a computer running at least:

- Windows 11
- MacOS 11.6.8 Big Sur
- Linux: untested but recent versions of Linux such as Ubuntu, Debian, or Fedora should be possible that are capable of running VSCode and Docker Desktop.

Web browser:

- Chrome is the most common but Firefox, Safari, Edge can also work. Their developer tools will all be a little different.

### Install Options

You have 3 options for how to develop geoprocessing projects

1. Local Docker environment
   - Docker provides a sandboxed Ubuntu Linux environment on your local computer, setup specifically for geoprocessing projects.
   - Best for: intermediate to power users doing development every day
   - Pros
     - Provides a fully configured environment, with installation of many of the third-party dependencies already take care of.
     - Docker workspace is isolated from your host operating system. You can remove or recreate these environment as needed.
     - You can work completely offline once you are setup.
   - Cons
     - You will need to get comfortable with Docker Desktop software.
     - Docker is slower than running directly on your system (maybe 30%)
     - Syncing data from network drives like Box into the Docker container is more challenging.
2. MacOS Bare Metal / Windows WSL
   - All geoprocessing dependencies are installed and maintained directly by you on your local computer operating system. For MacOS this means no virtualization is done. For Windows, this means running Ubuntu via WSL2 aka the Windows Subsystem for Linux.
   - Best for - power user.
   - Pros - fastest speeds because you are running without virtualization (aka bare metal)
   - Cons - prone to instability and issues due to progression of dependency versions or operating system changes. Difficult to test and ensure stable support for all operating systems and processors (amd64, arm64).

Choose an option and follow the instructions below to get started. You can try out different options over time.

### If Install Option #1 - Local Docker Environment

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for either Apple chip or Intel chip as appropriate to your system and make sure it's running.
  - If you don't know which you have, click the apple icon in the top left and select `About This Mac` and look for `Processor`
- Install [VS Code](https://code.visualstudio.com) and open it
- Clone the geoprocessing devcontainer repository to your system

```bash
git clone https://github.com/seasketch/geoprocessing-devcontainer
```

- Open the geoprocessing-devcontainer folder in VSCode

  - `File` -> `Open Folder` -> geoprocessing-devcontainer folder

- If you are prompted to install suggested extensions, then do so, otherwise go to the Extension panel and install the following:
  - Remote Development
  - Dev Containers
  - Docker
  - Remote Explorer
- Once you have DevContainer support, you should be prompted to ”Reopen folder to develop in a container”. <b>_Do not do this yet._</b>
- Under the `.devcontainer/local-dev` folder, make a copy of the `.env.template` file and rename it to `.env`.
  - Fill in your POEditor API token for you account, which you can find here - https://poeditor.com/account/api. If you don't have one, then follow the instructions to [create your own](../gip//GIP-1-i18n.md#setup-poeditor-as-an-independent-developer).
- If you have a data folder to mount into the docker container from your host operating system, edit the `.devcontainer/local-dev/docker-compose.yml` file and uncomment the volume below this comment
  - `# Bound host volume for Box data folder`
  - The volume is preset to bind to your Box Sync folder in you home directory but you can change it to any path in your operating system where your data resides for all your projects.
- To start the devcontainer at any time
  - `Cmd-Shift-P` to open command palette
  - type “Reopen in container” and select the Dev Container command to do so.
  - VSCode will reload, pull the latest `geoprocessing-workspace` docker image, run it, and start a remote code experience inside the container.
- Once container starts
  - It will automatically clone the geoprocessing repository into your environment under `/workspaces/geoprocessing`, and then run `npm install` to install all dependencies. Wait for this process to finish which can take up to 3-4 minutes the first time.
  - `Ctrl-J` will open a terminal inside the container.
  - Navigate to geoprocessing and verify tests run successfully.
    - `cd /workspaces/geoprocessing`
    - `npm run test`

If success, then you're now ready to create a new geoprocessing project in your devcontainer environment.

- To stop devcontainer at any time
  - `Cmd-Shift-P` to open command palette and type `“DevContainers: Rebuild and Reopen locally”` to find command and hit Enter.
  - Choose `Local Workspace`
  - Your devcontainer will now bootstrap, downloading the geoprocessing docker image and installing everything.
- Notice the bottom left blue icon in your vscode window. It may say `Opening remote connection` and eventually will say `Dev Container: Geoprocessing`. This is telling you that this VSCode window is running in a devcontainer environment.
- To exit your devcontainer:
  - Click the blue icon in the bottom left, and click `Reopen locally`. This will bring VSCode back out of the devcontainer session.
- To delete a devcontainer:
  - This is often the easiest way to "start over" with your devcontainer.
  - First, make sure you've pushed all of your code work to Github.
  - Make sure you stop your active VSCODE devcontainer session.
  - Open the Remote Explorer panel in the left sidebar.
  - You can right-click and delete any existing devcontainers and volumes to start over.
  - You can also see and delete them from the Docker Desktop app, but it might not be obvious which containers and volumes are which. The VSCode Remote Explorer window gives you that context.

![Manage Devcontainers](assets/ManageDevcontainers.jpg "Manage Devcontainers")

- To upgrade your devcontainer:
  - The devcontainer settings in this repository may change/improve over time. You can always pull the latest changes for your `geoprocessing-devcontainer` repository, and then `Cmd-Shift-P` to open command palette and type `“DevContainers: Rebuild and Reopen locally”`.
- To upgrade the `geoprocessing-workspace` Docker image
  - This devcontainer builds on the `geoprocessing-workspace` Docker image published at [Docker Hub](https://hub.docker.com/r/seasketch/geoprocessing-workspace/tags). It will always install the latest version of this image when you setup your devcontainer for the first time.
  - It is up to you to upgrade it after the initial installation. The most likely situation is:
    - You see some changes in the [Changelog](https://github.com/seasketch/docker-gp-workspace/blob/main/Changelog.md) that you want to utilize.
    - You are upgrading the `geoprocessing` library for your project to a newer version and it requires additional software that isn't in your current devcontainer. This situation should be flagged in the geoprocessing [changelog](https://github.com/seasketch/geoprocessing/blob/dev/CHANGELOG.md).
  - In both cases you should be able to simply update your docker image to the latest. The easiest way to do this is to:
    - Push all of your unsaved work in your devcontainer to Github. This is in case the Docker `named volume` where your code lives (which is separate from the devcontainer) is somehow lost. There are also ways to make a backup of a named volume and recover it if needed but that is an advanced exercise not discussed at this time.
    - Stop your devcontainer session
    - Go to the `Images` menu in Docker Desktop, finding your `seasketch/geoprocessing-workspace`.
    - If it shows as "IN USE" then switch to the `Containers` menu and stop all containers using `seasketch/geoprocessing-workspace`.
    - Now switch back to `Images` and pull a new version of the `seasketch/geoprocessing-image` by hovering your cursor over the image, clicking the 3-dot menu on the right side and the clicking `Pull`. This will pull the newest version of this image.
    - Once complete, you should be able to restart your devcontainer and it will be running the latest `geoprocessing-workspace`.

### Option #2 - MacOS Bare Metal / Windows WSL

#### MacOS

- Install [Node JS](https://nodejs.org/en/download/) >= v20.0.0
  - [nvm](https://github.com/nvm-sh/nvm) is great for this, then `nvm install v20`. May ask you to first install XCode developer tools as well which is available through the App Store or follow the instructions provided when you try to install nvm.
  - Then open your Terminal app of choice and run `node -v` to check your node version
- Install [VS Code](https://code.visualstudio.com)

  - Install recommended [extensions](https://code.visualstudio.com/docs/editor/extension-marketplace) when prompted. If not prompted, go to the `Extensions` panel on the left side and install the extensions named in [this file](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/templates/project/.vscode/extensions.json)

- Install [NPM](https://www.npmjs.com/) package manager >= v10.5.0 after installing node. The version that comes with node may not be recent enough.

  - `npm --version` to check
  - `npm install -g latest`

- Install [Java runtime](https://www.java.com/en/download/) for MacOS (required by AWS CDK library)

- Create a free Github account if you don't have one already
  - Set your git username

#### Windows

For Windows, you won't actually be running bare metal. your `geoprocessing` project and the underlying code run in a Docker container running Ubuntu Linux. This is done using the Windows Subsystem for Linux (WSL2) so performance is actually quite good. Docker Desktop and VSCode both know how to work seamlessly with WSL2. Some of the building blocks you will install in Windows (Git, AWSCLI) and link them into the Ubuntu Docker container. The rest will be installed directly in the Ubuntu Docker container.

In Windows:

- Install [WSL2 with Ubuntu distribution](https://learn.microsoft.com/en-us/windows/wsl/install)
- Install [Docker Desktop with WSL2 support](https://docs.docker.com/desktop/windows/wsl/) and make sure Docker is running
- Open start menu -> `Ubuntu on Windows`
  - This will start a bash shell in your Ubuntu Linux home directory

In Ubuntu:

- Install [Java runtime](https://stackoverflow.com/questions/63866813/what-is-the-proper-way-of-using-jdk-on-wsl2-on-windows-10) in Ubuntu (required by AWS CDK library)
- Install [Git in Ubuntu and Windows](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-git)
- Install [VS Code](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode) in Windows and setup with WSL2.
  - Install recommended [extensions](https://code.visualstudio.com/docs/editor/extension-marketplace) when prompted. If not prompted, go to the `Extensions` panel on the left side and install the extensions named in [this file](https://github.com/seasketch/geoprocessing/blob/dev/packages/geoprocessing/templates/project/.vscode/extensions.json)
- Install [Node JS](https://nodejs.org/en/download/) >= v16.0.0 in Ubuntu
  - [nvm](https://github.com/nvm-sh/nvm) is great for this, then `nvm install v16`.
  - Then open your Terminal app of choice and run `node -v` to check version
- Install [NPM](https://www.npmjs.com/) package manager >= v8.5.0 after installing node. The version that comes with node may not be recent enough.
  - `npm --version` to check
  - `npm install -g latest`

### Final Steps

Whichever option you chose, if you haven't already, establish the [username](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git?platform=mac) and email address git should associate with your commits.

You can set these per repository, or set them globall on your system for all repositories and override them as needed. Here's the commands to set globally for your environment.

```bash
git config --global user.name "Your Name"
git config --global user.email "yourusername@yourprovider.com"
```

Now verify it was set:

```bash
# If you set global - all repos
cat ~/.gitconfig

# If you set local - current repo
cat .git/config
```

At this point your system is ready for you to `create a new project`, or `setup an existing project`
