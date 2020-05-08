const { versionToArray, fetchNpmVersion, getPackageJson } = require('./utils')

// true if a > b
function isVersionGreater(a, b) {
  const aAsArray = versionToArray(a)
  const bAsArray = versionToArray(b)
  let isGreater = false
  return aAsArray.reduce((isGreater, aValue, index) => isGreater || aValue > bAsArray[index], false)
}

function start() {
  const packageJson = getPackageJson()
  const npmVersion = fetchNpmVersion(packageJson.name)

  console.log(isVersionGreater(packageJson.version, npmVersion) ? 'true' : 'false')
}

start()
