# github-next-version
Gets next version of project based on previous commit tag and commit messages.

# Get previous tag

Github Action that gets the latest tag from git

![Example output showing this action in action](images/output.png)

## Output

This action has two output: 
    `tag` for the latest tag this action finds.
    `version` the next version that should be used. 

The next version will be determined by commit messages since the last tag created.

Commit message conventions:
* fix: will update the 3 (patch) number of the version
* feat: will update the 2 (minor) number of the version
* BREAKING will update the 1(major) number of the version

It should always return a `version`, when there is at least one commit.
`tag` will only be set if there was a previous tag.

## Example

```yaml
name: Generate
jobs:
  generate:
    steps:
      - uses: actions/checkout@v2
      - name: 'Get Next tag'
        id: semver
        uses: "cdotyone/github-next-version@main"
        env:
          GITHUB_TOKEN: "${{ github.token }}"
        with:
          message: "${{github.event.head_commit.message}}"
```

