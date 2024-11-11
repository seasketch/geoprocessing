# Devcontainers

A [devcontainer](https://containers.dev/) is a Docker container wrapped in some additional features to create a more full-featured development environment.

The geoprocessing framework uses it as its primary environment for project development for its stability.

## Exit Devcontainer

To exit a devcontainer session in VSCode, click the blue icon in the bottom left, and then `Reopen locally`. This will bring VSCode back out of the devcontainer session.

## Delete Devcontainer

To delete a devcontainer and start over:

- First, make sure you've pushed all of your code work to Github.
- Exit your active VSCODE devcontainer session.
- Open the Remote Explorer panel in the left sidebar.
- Right-click and delete the appropriate devcontainers and volumes to start over. You can also see and delete them from the Docker Desktop app, but it is not obvious which containers and volumes are the ones you want.
- Press `Ctrl-J` or `Ctrl-backtick` to open a new terminal
  - The terminal will be in the `/workspaces` folder on the Ubuntu filesystem inside the container. It is completely separate from your host operating system.
  - Type the command `lsb_release -a` to see the Ubuntu version.

## Upgrade Devcontainer

To upgrade your devcontainer:

- The devcontainer settings in this repository may change/improve over time. You can always pull the latest changes for your `geoprocessing-devcontainer` repository, and then `Cmd-Shift-P` to open command palette and type `“DevContainers: Rebuild and Reopen locally”`.

To upgrade the `geoprocessing-workspace` Docker image:

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

## Mount A Data Volume

If you are using Windows WSL, you will already have access to your Windows filesystem in Ubuntu via the `/mnt` path.

MacOS takes a little more work. You will need to uncomment a line in the geprocessing-devcontainer/docker-compose.yml file.

If you have a data folder to mount into your Ubuntu devcontainer from your host operating system, edit the `.devcontainer/local-dev/docker-compose.yml` file and uncomment the volume below this comment:

- `# Bound host volume for Box data folder`

The volume in this example, is preset to bind to your Box Sync folder in your home directory but you can change it to any path in your operating system where your data resides for all your projects.
