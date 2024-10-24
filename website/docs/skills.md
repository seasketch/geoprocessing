# Skill Building

There are a number of required skills for using this framework successfully. If you don't have this knowledge, then skill building and potentially mentorship may be needed for you to succeed. Here is a list of resources that can help you get started:

- [Git and Github](https://www.youtube.com/watch?v=RGOj5yH7evk)
- [Node JS](https://www.freecodecamp.org/news/what-is-node-js/) development
- [VSCode](https://www.youtube.com/watch?v=WPqXP_kLzpo) integrated development environment (IDE)
- [Code debugging](https://www.freecodecamp.org/news/what-is-debugging-how-to-debug-code/)
- [Bash](https://www.freecodecamp.org/news/linux-command-line-bash-tutorial/) command line
- [React](https://www.freecodecamp.org/learn/front-end-development-libraries/#react) user interface development
- [Typescript](https://www.freecodecamp.org/news/programming-in-typescript/) code development
- [QGIS](https://www.qgis.org/en/site/) and [tutorials](https://www.qgistutorials.com/en/)
- [GDAL](https://gdal.org/index.html) and [tutorials](https://gdal.org/tutorials/index.html)

Essential tips For configuring this framework using a specific operating system (usually Ubuntu).

## Other Tips

### Editing a file in Ubuntu using nano text editor

Assume you want to add some lines of text to a file called `foo.txt` in your home directory using nano.

1. Open a Ubuntu shell
2. `nano ~/foo.txt`
3. Copy and paste the following lines into the file

```text
This is file foo
It doesn't do much
```

4. Save and exit with `Ctrl-O` and `Enter`
5. Look at your results

```bash
echo ~/foo.txt
```

6. Now delete the file with `rm ~/.foo.txt`

### Editing your startup bash script in Ubuntu

On occasion, you'll need to modify your Ubuntu bash shell environment to load something on startup. Building on the last tip, you can edit your `.bashrc` file

1. Open a Ubuntu shell
2. `nano ~/.bashrc`
3. Add or paste in your configuration. This can be done at the top or bottom of the file usually.
4. Save and exit with `Ctrl-O` and `Enter`
5. Reload your bashrc with `source ~/.bashrc` or you can just close and restart your Ubuntu shell.

/Users/MAC-OS-USER/Library/CloudStorage/Box-Box

### Access Cloud Drive folder

This is useful if you manage your spatial data in Box and collaborators sync it to their local computers. This lets you bring your Box Drive folder into your Ubuntu docker container so that you can symlink it to your `data/src` folder and import data in a consistent way across all users.

Note, this could be used with other drive share systems such as Google Drive.

First, ensure you have Box Drive installed, and you have enabled sync of your data to your local computer.

#### MacOS

Open a terminal and assuming your username is `alex` check that the following path exists

```bash
ls /Users/alex/Library/CloudStorage/Box-Box
```

If you see the top-level of your synced files, then you are good to go.

#### Ubuntu on Windows WSL2

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
