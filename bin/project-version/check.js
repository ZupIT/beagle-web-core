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

  if (isVersionGreater(packageJson.version, npmVersion)) {
    console.log(`Project version (${packageJson.version}) is correct!`)
    return process.exit(0)
  }

  console.log(`Project version (${packageJson.version}) is incorrect! It should be greater than the current version on NPM (${npmVersion}).`)
  process.exit(1)
}

start()
