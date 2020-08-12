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

function createMapOfKeys(values: Record<string, any>) {
  const keys = Object.keys(values)
  return keys.reduce((result, key) => ({ ...result, [key.toLowerCase()]: key }), {})
}

const getLowercaseMapOfKeys = (() => {
  const memo: Map<Record<string, any>, Record<string, any>> = new Map()

  return (components: Record<string, any>) => {
    if (!memo.has(components)) memo.set(components, createMapOfKeys(components))
    return memo.get(components)
  }
})()

function getValueByCaseInsensitiveKey(values: Record<string, any>, name: string) {
  const lowercaseKeyMap = getLowercaseMapOfKeys(values) || {}
  const originalKey = lowercaseKeyMap[(name as string).toLowerCase()]
  return values[originalKey]
}

function getOriginalKeyByCaseInsensitiveKey(values: Record<string, any>, name: string) {
  const lowercaseKeyMap = getLowercaseMapOfKeys(values) || {}
  const originalKey = lowercaseKeyMap[(name as string).toLowerCase()]
  return originalKey
}

export default {
  getValueByCaseInsensitiveKey,
  getOriginalKeyByCaseInsensitiveKey,
}
