workflow "Build and Deploy" {
  on = "push"
  resolves = ["Deploy"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Build" {
  needs = ["Install"]
  uses = "actions/npm@master"
  args = ["run", "build"]
}

action "Deploy" {
  needs = ["Build"]
  uses = "peaceiris/actions-gh-pages@v1.1.0"
  env = {
    PUBLISH_BRANCH = "gh-pages"
    PUBLISH_DIR = "./dist"
  }
  secrets = ["GITHUB_TOKEN"]
}
