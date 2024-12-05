# Link Project Data

In order to `import` and `publish` datasets needed in your reports, they will need to be accessible on your local computer. There are multiple ways to do this, choose the appropriate one for you.

## Option 1. Keep your data where it is

Nothing to do, you will keep your data where it is on your local computer, and provide a direct path to this location on import.

Pros:

- Simple. Can start with this and progress to more elaborate strategies
- Keeps your data separate from your code
- Can import data from different parts of your filesystem

Cons:

- Can make it hard to collaborate with others because they'll have to match your file structure, which may not be possible for some reason.

## Option 2. Keep your data in your project repository

Copy your datasources directly into the `data/src` directory.

Pros:

- Data and relative import paths are consistent between collaborators
- Data can be kept under version control along with your code. Just check out and it's ready to go.

Cons:

- You have an additional copy of your data to maintain. You may not have a way to tell if your data is out of data or not from the source of truth.
- The github repository can get big fast if you have or produce large datasets.
- If your data should not be shared publicly, then the code repo will need to be kept private, which works against the idea of transparent and open science.
- If any file is larger than 100MB it will require use of [Git LFS](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
  - Maximum of 5gb file size

MacOS this could be as easy as:

```bash
cp -r /my/project/data data/src
```

Windows, you can copy files from your Windows C drive into Ubuntu Linux using the following:

```bash
cp -r /mnt/c/my_project_data data/src
```

Change the `.gitignore` file to allow you to commit your data/src and data/dist directory to Git. Remove the following lines:

```bash
data/src/**
data/dist/**
```

It's up to you to not make sensitive data public. By choosing this option, you are possibly committing to it always being private and under managed access control.

## Option 3. Link Data

A symbolic link, is a file that points to another directory on your system. What you can do is create a symbolic link at `data/src` that points to the top-level directory where you data is maintained elsewhere on your system.

Pros:

- Keeps your data separate from your code but accessed in a consistent way through the `data/src` path.
- Works with cloud-based drive share products like Box and Google Drive which can be your centralized source of truth.

Cons:

- Symbolic links can be a little harder to understand and manage, but are well documented.
- People managing the source of truth that is linked to may update or remove the data, or change the file structure and not tell you. Running `reimport` scripts will fail and `datasources.json` paths will need to be updated to the correct place.

Steps:

- First, if you use a Cloud Drive product to share and sync data files, make sure your data is synced and you know the path to access it. See [access Cloud Drive folder](./tutorials/clouddrive.md)
- Assuming you are using MacOS and your username is `alex`, your path would be `/Users/alex/Library/CloudStorage/Box-Box`

To create the symbolic link, open a terminal and make sure you are in the top-level directory of your geoprocessing project:

```bash
ln -s /Users/alex/Library/CloudStorage/Box-Box data/src
```

Confirm that the symbolic link is in place, points back to your data, and you can see your data files

```bash
ls -al data
ls -al data/src
```

If you put your link in the wrong folder or pointed it to the wrong place, you can always just `rm data/src` to remove it, then start over. It will only remove the symbolic link and not the data it points to.

#### In Summary

None of these options solve the need for collaborators to manage data carefully, to communicate changes, and to ensure that updates are carried all the way through the data pipeline in a coordinated fashion. The data won't keep itself in sync.

For all of these options, you can tell if your data is out of sync:

- `data/src` is out of date if the `Date modified` timestamp for a file is older than the timestamp for the same file wherever you source and copy your data from.
- `data/dist` is out of date with `data/src` if the `Date modified` timestamp for a file is older than the timestamp for the same file in `data/src`.
