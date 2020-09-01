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

import * as beagle from '../src'
import exportations from './index.snapshot'

function serialize(data: any): any {
  if (Array.isArray(data)) return data.map(serialize)
  if (typeof data === 'object') {
    const keys = Object.keys(data)
    return keys.reduce((result, key) => ({ ...result, [key]: serialize(data[key]) }), {})
  }
  if (typeof data === 'function') return '__function__'
  return data
}

describe('Beagle', () => {
  it('should export keys', () => {
    expect(Object.keys(beagle)).toEqual(Object.keys(exportations))
  })

  it('should export values', () => {
    expect(serialize(beagle)).toEqual(exportations)
  })
})
