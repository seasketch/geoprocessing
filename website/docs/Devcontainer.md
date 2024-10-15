# Devcontainer

There are multiple options for developing a geoprocessing project in a devcontainer

1. Develop in a Docker container
   - Pros - All dependencies are installed already for you and known to work together. Workspace is persisted in a volume.
   - Cons- Docker is slower than local (maybe 30%), and you have to go through some extra steps to link in data from network drives like Box.
2. Develop in a Github Codespace
   - Pros - easiest to start, works entirely in the browser from almost any computer.
   - Cons - limitations for working with large datasets
3. Develop directly on your local system
   - Pros - fastest processing speeds
   - Cons - Difficult to provide stable support for all operating systems and processors (amd64, arm64). You are responsible for installing all dependencies (particularly GDAL/OGR), with versions known to work properly together, and configuring them.

## 1. Develop in a Docker Container

Here is the recommended setup for each operating system:

### MacOS / Linux

Suggestion - run `geoprocessing-workspace` docker image in devcontainer

```
git clone https://github.com/seasketch/geoprocessing-devcontainer
```

- Open the `geoprocessing-devcontainer` folder in VSCode.
- If you are prompted to install suggested extensions, then do so, otherwise go to the Extension panel and install the following:
  - Remote Development
  - Dev Containers
  - Docker
  - Remote Explorer
- Once you have DevContainer support, you should be prompted to ”Reopen folder to develop in a container”. <b>_Do not do this yet._</b>
- Under the .devcontainer folder create a .env file and paste in the example from the top-level README.md.
  - Fill in your POEditor API token for you account found here - https://poeditor.com/account/api
- If you have a data folder to mount into the docker container from you host operating system, edit the docker-compose.yml file and uncomment the volume below this comment
  - `# Bound host volume for Box data folder`
  - It's preset to bind to your Box Sync folder in you home directory but you can change it to any path in MacOS where your data resides for all your projects.
- To start devcontainer at any time
  - `Cmd-Shift-P` to open command palette
  - type “Reopen in container” and select the Dev Container command to do so.
  - VSCode will reload, pull the latest `geoprocessing-workspace` docker image, run it, and start a remote code experience inside the container.
- Once container starts
  - `Ctrl-J` will open a terminal inside the container.
  - Make sure data folder is accessible with `ls /data`
  - Run setup script to checkout code repositories
  - `. /common/scripts/setup.sh
- To stop devcontainer at any time and exist back to the host operating system
  - `Cmd-Shift-P` to open command palette and type `“Reopen locally”` to find command and hit Enter.
- To see and manage your devcontainers
  - Use the Remote Explorer panel in the left sidebar.
  - You can delete your devcontainers and volumes to start over while your devcontainer is not running from the Remote Explorer.
  - You can also see and delete them from the Docker Desktop app but less information on what you are looking at will be available to be able to carefully delete certain devcontainers but not others.

### Windows

Suggestion - Import `geoprocessing-workspace` docker image as WSL2 distribution

A WSL2 distribution is similar to using a devcontainer, in that it runs a docker image, but uses a faster Linux kernel built into Windows. It also adds better access between the Windows filesystem and the container including the ability to mount networks drives like Box or Google Drive into the docker container for a synced experience using somethign called `drivefs`. Network Drive access hasn't been found to be possible using a devcontainer directly and binding the box folder to a volume using the docker compose config file. If you don't use Box or similar network drive solutions, then the devcontainer approach will work just fine and you can bind to any regular drive such as the C Drive.

- From the existing windows setup tutorial, you should already have Docker Desktop, WSL2, and Git for Windows installed.
- The docker container will already come with nvm, npm, node 16, java client, gdal/ogr dependencies.

Instructions based on https://learn.microsoft.com/en-us/windows/wsl/use-custom-distro

#### Install distro

- backup your existing Geoprocessing if needed
  - `wsl --export Geoprocessing <filename.tar>`
- Delete your old distribution
  - `wsl --unregister Geoprocessing`
- Install latest Geoprocessing distribution
  - `mkdir C:\WslDistributions\Geoprocessing`
  - Download tar from folder with latest timestamp at https://ucsb.box.com/s/k9477fqzzn0yel5kf5kj2y81tst09f4i to this folder
  - `wsl --import Geoprocessing C:\WslDistributions\Geoprocessing\ C:\tmp\geoprocessing-workspace_20230627\geoprocessing-workspace_20230627_65bd30ba63a3.tar`
- Start and setup distro
  - With powershell or another terminal open click Setting gear on right side
  - Profiles -> Add new profile
  - Duplicate ubuntu profile
  - Change name to Geoprocessing
  - Change Terminal command \* `C:\WINDOWS\system32\wsl.exe -d Ubuntu` becomes `C:\WINDOWS\system32\wsl.exe -u vscode -d Geoprocessing
Setup`
- Configure user account to use on startup
  - `nano vi /etc/wsl.config`
  - Paste these two lines

```
[user]
default = vscode
```

- Stop and restart the WSL distro
  - `wsl --terminate <distroname>`
  - Go to Terminal app in Windows, open new Geoprocessing tab
  - You should now be logged in as vscode user
- Final setup

```bash
sudo mkdir /workspaces
sudo chmod 777 /workspaces
cd /workspaces
git clone https://github.com/seasketch/geoprocessing.git
cd geoprocessing
code .
Ctrl-J to open terminal (should open as vscode user)
npm install
npm test
```

Follow regular tutorial instructions for git credential/config setup
Run script to clone to /workspaces/geoprocessing, npm install, and code .

- Mount box directory from host OS

```bash
sudo mkdir /mnt/box
sudo mount -t drvfs 'C:\Users/twelch.SWISH\box' /mnt/box
```

## 2. Develop in Github Codespace

- Browse to https://github.com/seasketch/geoprocessing-devcontainer
- Click `Use this template` button and then `Open in codespace`
