# Cloud Drive Syncing

## Box Sync

This is useful if you manage your spatial data in Box and collaborators sync it to their local computers. This lets you bring your Box Drive folder into your Ubuntu docker container so that you can symlink it to your `data/src` folder and import data in a consistent way across all users.

Note, this could be used with other drive share systems such as Google Drive.

First, ensure you have Box Drive installed, and you have enabled sync of your data to your local computer.

### MacOS

Open a terminal and assuming your username is `alex` check that the following path exists

```bash
ls /Users/alex/Library/CloudStorage/Box-Box
```

If you see the top-level of your synced files, then you are good to go.

### Ubuntu on Windows WSL2

Source - https://github.com/microsoft/WSL/issues/4310

```bash
C:\Users\alex\box
```

Now add the following [to your bashrc](#editing-a-file-in-ubuntu-using-nano-text-editor):

```bash
if ! findmnt -M /mnt/box &>/dev/null; then
    sudo mount -t drvfs 'C:\Users\alex\box' /mnt/box
fi
```

On every Ubuntu shell startup you will nowbe prompted for your root password. Once entered the drive mount will be performed.

Now verify your box files are accessible from Linux

```bash
ls /mnt/box
```
