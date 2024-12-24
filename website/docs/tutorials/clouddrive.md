# Cloud Drive Syncing

## Box Drive Sync

The Box Drive software application lets you manage your spatial data in a centralized Box folder, and then collaborators can sync it to their local computers. You are then able to access this Box Drive in your Docker container or WSL Geoprocessing distribution using the filesystem bridge. Specifically, you can symlink a Box subfolder to your projects `data/src` folder and access your data in a consistent way.

Note, this could potentially be used with other drive share systems such as Google Drive.

First, ensure you have Box Drive installed, and you have enabled sync of your data to your local computer.

### MacOS

Open a terminal and assuming your username is `alex` check that the following path exists

```bash
ls /Users/alex/Library/CloudStorage/Box-Box
```

If you see the top-level of your synced files, then you are good to go.

### Windows WSL Ubuntu

[WSL Ubuntu](./Tutorials.md#ubuntu-direct-install) seems to have the ability to access your Box drive folder over the WSL filesystem bridge. This does not seem to be true for the [WSL Geoprocessing Distribution](./Tutorials.md#geoprocessing-distribution).

Source - https://github.com/microsoft/WSL/issues/4310

Assume your box folder is installed on your Windows system at this path

```bash
C:\Users\alex\box
```

Use Windows Explorer or Powershell to confirm the name of your folder.

Now add the following to your .bashrc file in the home directory of WSL Ubuntu

```bash
if ! findmnt -M /mnt/box &>/dev/null; then
    sudo mount -t drvfs 'C:\Users\alex\box' /mnt/box
fi
```

On every Ubuntu shell startup you will now be prompted for your root password. Close and reopen your Ubuntu shell. Once your password is entered the drive mount will be performed.

Now verify your box files are accessible from Linux

```bash
ls /mnt/box
```
