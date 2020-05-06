const { execSync } = require('child_process')
const { writeFileSync } = require('fs')

function fetchNpmVersion(packageName) {
  return execSync(`npm show ${packageName} version`, { encoding: 'utf8' })
}

function versionToArray(version) {
  return version.split('.').map(versionPart => {
    try {
      return Number.parseInt(versionPart)
    } catch {
      return 0
    }
  })
}

// true if a > b
function isVersionGreater(a, b) {
  const aAsArray = versionToArray(a)
  const bAsArray = versionToArray(b)
  let isGreater = false
  return aAsArray.reduce((isGreater, aValue, index) => isGreater || aValue > bAsArray[index], false)
}

function incrementVersion(version) {
  const asArray = versionToArray(version)
  asArray[asArray.length - 1]++
  return asArray.join('.')
}

function updatePackageJson(packageJson) {
  writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`)
}

function start() {
  const packageJson = require('../package.json')
  const npmVersion = fetchNpmVersion(packageJson.name)
  if (!isVersionGreater(packageJson.version, npmVersion)) {
    packageJson.version = incrementVersion(npmVersion)
    updatePackageJson(packageJson)
    console.log(`Project version updated to ${packageJson.version}`)
    return
  }
  console.log(`Project version (${packageJson.version}) is correct. No need to update it.`)
}

start()
