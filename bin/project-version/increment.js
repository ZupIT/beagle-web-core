const { writeFileSync } = require('fs')
const { versionToArray, fetchNpmVersion, getPackageJson } = require('./utils')

function incrementVersion(version) {
  const asArray = versionToArray(version)
  asArray[asArray.length - 1]++
  return asArray.join('.')
}

function updatePackageJson(packageJson) {
  writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`)
}

function start() {
  const packageJson = getPackageJson()
  const npmVersion = fetchNpmVersion(packageJson.name)
  packageJson.version = incrementVersion(npmVersion)
  updatePackageJson(packageJson)
  console.log(${packageJson.version})
}

start()
