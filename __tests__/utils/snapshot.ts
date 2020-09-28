/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { BeagleUIElement } from 'beagle-tree/types'
import { readFile, writeFile } from 'fs'

const snapshotsDir = './__tests__/integration/beagle-keep/snapshots'

/**
 * Transforms the object into a serializable entity that can than be stored in a file. Basically, it
 * transforms every function into the string `"__function__"`, so it can also be used to compare
 * objects and we don't really care about what the functions actually do, just that they are
 * functions.
 * 
 * @param data the object to be transformed into a serializable version of itself 
 */
export function takeSnapshot(data: any): any {
  if (!data) return data
  if (Array.isArray(data)) return data.map(takeSnapshot)
  if (typeof data === 'object') {
    const keys = Object.keys(data)
    return keys.reduce((result, key) => ({
      ...result,
      [key]: takeSnapshot(data[key]),
    }), {})
  }
  if (typeof data === 'function') return '__function__'
  return data
}

function readSnapshotFile(path: string) {
  return new Promise((resolve) => {
    readFile(`${snapshotsDir}/${path}.json`, { encoding: 'utf-8' }, (err, data) => {
      if (err) resolve(null)
      else resolve(JSON.parse(data))
    })
  })
}

function writeSnapshotFile(snapshot: any, path: string) {
  return new Promise((resolve, reject) => {
    writeFile(
      `${snapshotsDir}/${path}.json`,
      `${JSON.stringify(snapshot, null, 2)}\n`,
      { encoding: 'utf-8' },
      (err) => {
        if (err) reject(err)
        else resolve()
      },
    )
  })
}

function validatePath(path: string) {
  if (!path.match(/^[a-z_\-\.\d]+$/)) {
    throw new Error(`Invalid path for snapshot "${path}". Please, use only lowercase letters, numbers, underlines (_), dashes (-) or points (.).`)
  }
}

export function getSnapshot(path: string) {
  validatePath(path)
  return readSnapshotFile(path)
}

export async function expectToMatchSnapshot(tree: BeagleUIElement, path: string) {
  validatePath(path)
  const snapshot = takeSnapshot(tree)
  const storedSnapshot = await readSnapshotFile(path)
  if (!storedSnapshot) await writeSnapshotFile(snapshot, path)
  else expect(snapshot).toEqual(storedSnapshot)
}
