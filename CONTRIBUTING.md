# Git Workflow

<div align="center">

English · [Brazilian Portuguese](./CONTRIBUTIING-PT-BR.md)

</div>

The Feature Branch Workflow assumes a central repository, and main represents the official project history. Instead of committing directly on their local main branch, developers create a new branch every time they start work on a new feature. Feature branches should have descriptive names, like add-expense or issue-913. The idea is to give a clear, highly-focused purpose to each branch. Git makes no technical distinction between the main branch and feature branches, so developers can edit, stage, and commit changes to a feature branch.

In addition, feature branches can (and should) be pushed to the central repository. This makes it possible to share a feature with other developers without touching any official code. Since main is the only “special” branch, storing several feature branches on the central repository doesn’t pose any problems. Of course, this is also a convenient way to back up everybody’s local commits.

## How it works?

1. **Checkout release branch**

All feature branches ared created from the latest code of a project.

```bash
git checkout main
git fetch origin
git reset --hard origin/main
```

This switches to the `main` branch, pulls the latest commits and resets the local changes of `main` to match the latest version

2. **Create a new branch**

Use a separate branch to each feature or issue you work on. After creating a branch, check it out locally so that any changes you make will be on that branch.

```bash
git checkout -b issue-xxxx
```

This checks out a branch called `issue-xxxx` based on `main`, and the -b flag tells Git to create the branch if it doesn’t already exist.

3. **Update, add, commit, and push changes**

On this branch, edit, stage, and commit changes in the usual fashion, building up the feature with as many commits as necessary. Work on the feature and make commits like you would any time you use Git. When ready, push your commits.

```bash
git status
git add <some-file>
git commit -m "type: message"
```

4. **Push feature branch to remote**

It’s a good idea to push the feature branch up to the central repository. This serves as a convenient backup, when collaborating with other developers, this would give them access to view commits to the new branch.

```bash
git push -u origin issue-xxxx
```

This command pushes `issue-xxxx` to the central repository (origin), and the -u flag adds it as a remote tracking branch. After setting up the tracking branch, git push can be invoked without any parameters to automatically push the issue-xxxx branch to the central repository.