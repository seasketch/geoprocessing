# Options for running geoprocessing projects

1. Develop in a Docker container
    * Pros - All dependencies are installed already for you and known to work together.  Workspace is persisted in a volume.
    * Cons- Docker is slower than local (maybe 30%), and you have to go through some extra steps to link in data from network drives like Box.
2. Develop in a Github Codespace
    * Pros - easiest to start, works entirely in the browser from almost any computer.
    * Cons - limitations for working with large datasets
3. Develop directly on your local system
    * Pros - fastest processing speeds
    * Cons - Difficult to provide stable support for all operating systems and processors (amd64, arm64). You are responsible for installing all dependencies (particularly GDAL/OGR), with versions known to work properly together, and configuring them.

Here is the recommended setup for each operating system:

## MacOS / Linux

Suggestion - run devcontainer

```
git clone https://github.com/seasketch/geoprocessing-devcontainer
```

* Open the `geoprocessing-devcontainer` folder in VSCode.
* If you are prompted to install suggested extensions, then do so, otherwise go to the Extension panel and install the following:
  * Remote Development
  * Dev Containers
  * Docker
  * Remote Explorer
* Once you have DevContainer support, you should be prompted to ”Reopen folder to develop in a container”.  <b>*Do not do this yet.*</b>
* Under the .devcontainer folder create a .env file and paste in the example from the top-level README.md.
  * Fill in your POEditor API token for you account found here - https://poeditor.com/account/api 
* If you have a data folder to mount into the docker container from you host operating system, edit the docker-compose.yml file and uncomment the volume below this comment
  * `# Bound host volume for Box data folder`
  * It's preset to bind to your Box Sync folder in you home directory but you can change it to any path in MacOS where your data resides for all your projects.
* To start devcontainer at any time
  * `Cmd-Shift-P` to open command palette
  * type “Reopen in container” and select the Dev Container command to do so.
  * VSCode will reload, pull the latest `geoprocessing-workspace` docker image, run it, and start a remote code experience inside the container.  
* Once container starts
  * `Ctrl-J` will open a terminal inside the container.
  * Make sure data folder is accessible with `ls /data`
  * Run setup script to checkout code repositories
  * `. /common/scripts/setup.sh
* To stop devcontainer at any time and exist back to the host operating system
  * `Cmd-Shift-P` to open command palette and type `“Reopen locally”` to find command and hit Enter.
* To see and manage your devcontainers
  * Use the Remote Explorer panel in the left sidebar.
  * You can delete your devcontainers and volumes to start over while your devcontainer is not running from the Remote Explorer.
  * You can also see and delete them from the Docker Desktop app but less information on what you are looking at will be available to be able to carefully delete certain devcontainers but not others.

## Windows

Suggestion -  run WSL2 distribution.

A WSL2 distribution is similar to using a devcontainer, in that a docker environment is setup.  What a WSL2 distribution adds is full access to all of your Windows drives including the ability to mount networks drives like Box from your Windows environment into the running docker container.  This simply hasn't been found to be possible using a devcontainer directly and binding the box folder to a volume using the docker compose config file.  If you don't use Box or similar network drive solutions, then the devcontainer approach will work just fine and you can bind to any regular drive such as the C Drive.
