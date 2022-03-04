
/*
  * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

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
