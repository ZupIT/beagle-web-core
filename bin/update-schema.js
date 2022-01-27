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

const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

function getUrlToSchema(fileContent) {
  const schemaUrl = fileContent.match(/schemaUrl:\s*['"]([^'"]+)['"]/)
  const baseUrl = fileContent.match(/baseUrl:\s*['"]([^'"]+)['"]/)
  const url = (schemaUrl && schemaUrl[1]) || (baseUrl && baseUrl[1] && `${baseUrl[1]}/schema.ts`)
  return url
}

async function loadContentsFromUrl(url) {
  const response = await fetch(url)
  return response.text()
}

function writeSchemaToFile(configPath, schema, url) {
  const schemaPath = `${path.dirname(configPath)}/schema.ts`
  fs.writeFileSync(schemaPath, schema)
  console.info(`Updated file "${schemaPath}" with schema at "${url}"`)
}

async function processConfigurationFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, { encoding: 'utf8' })
    const url = getUrlToSchema(content)
    if (!url) throw new Error(`Error: can\'t find schemaUrl or baseUrl in ${filePath}`)
    const schema = await loadContentsFromUrl(url)
    writeSchemaToFile(filePath, schema, url)
  } catch (error) {
    console.error(error)
  }
}

function start() {
  const configFilesValue = process.env.CONFIG_FILES
  if (!configFilesValue) {
    console.error('Error while updating server driven ui schemas: no configuration files have been provided. Example of call: CONFIG_FILES=./src/sdui/config.ts yarn update-sdui-schema.')
    return
  }
  const files = configFilesValue.split(' ')
  files.forEach(processConfigurationFile)
}

start()
