const { execSync } = require('child_process')

function versionToArray(version) {
  return version.split('.').map(versionPart => {
    try {
      return Number.parseInt(versionPart)
    } catch {
      return 0
    }
  })
}

function fetchNpmVersion(packageName) {
  return execSync(`npm show ${packageName} version`, { encoding: 'utf8' }).replace('\n', '')
}

function getPackageJson() {
  return require('../../package.json')
}

module.exports = {
  versionToArray,
  fetchNpmVersion,
  getPackageJson,
}
