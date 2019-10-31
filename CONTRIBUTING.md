# Contributing Guide

## Conventional commit messages

We use [commitlint](https://github.com/conventional-changelog/commitlint) and [husky](https://github.com/typicode/husky) to prevent bad commit messages. For example when trying to commit with the following message `git commit -m "some changes"`. You will receive the following error:

```
⧗   input: some changes
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
```

A commit should always look like: `type(scope): subject`. The type and sbuject must have a specific value while the subject can be anything in sentence case. For example when fixing an issue with the play command the commit message could be:

`fix(play): Don't allow adding new songs while loading a playlist`

You can find a full list of available types and scopes in the [config file](.commitlintrc.yml).
