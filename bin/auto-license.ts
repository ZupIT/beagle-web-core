/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { readFile, writeFile } from 'fs/promises'
import glob from 'glob-promise'
import { difference } from 'lodash'

const whitelist = ['**/*.js', '**/*.ts', '**/*.yml']
const blacklist = ['node_modules/**/*.*', 'coverage/**/*.*', 'dist/**/*.*']
const headerIdentifier = /^\s*(\*|#) Copyright 2020/gm

interface HeaderShape {
  firstLine: string,
  middleLinePrefix: string,
  lastLine: string,
}

const jsHeaderShape: HeaderShape = {
  firstLine: '/*',
  middleLinePrefix: ' * ',
  lastLine: ' */\n'
}

const defaultHeaderShape: HeaderShape = {
  firstLine: '#',
  middleLinePrefix: '  # ',
  lastLine: '#\n'
}

async function getFiles() {
  const whitelistedFiles = (await Promise.all(whitelist.map(pattern => glob(pattern)))).flat()
  const blacklistedFiles = (await Promise.all(blacklist.map(pattern => glob(pattern)))).flat()
  return difference(whitelistedFiles, blacklistedFiles)
}

function createHeader(filename: string, header: string) {
  const shape = (filename.endsWith('.js') || filename.endsWith('.ts')) ? jsHeaderShape : defaultHeaderShape
  const middleLines = header.split('\n').map(l => `${shape.middleLinePrefix}${l}`).join('\n')
  return `${shape.firstLine}\n${middleLines}\n${shape.lastLine}\n`
}

async function addHeaderIfNoneIsPresent(filename: string, header: string) {
  const content = await readFile(filename, { encoding: 'utf8' })
  const hasHeader = !!content.match(headerIdentifier)
  if (hasHeader) return
  const contentWithHeader = `${createHeader(filename, header)}${content}`
  await writeFile(filename, contentWithHeader)
  console.log(`Added header to: ${filename}`)
}

async function start() {
  const header = await readFile('./bin/header.txt', { encoding: 'utf8' })
  const files = await getFiles()
  await Promise.all(files.map(f => addHeaderIfNoneIsPresent(f, header)))
}

start()
