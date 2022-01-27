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

/**
 * Gets the value for `key` in `object`. Using this function, `key` is case-insensitive, i.e,
 * `object[foo]`, `object[Foo]`, `object[fOo]` are all the same in the eyes of this function.
 * 
 * @param object the object to retrieve the value from
 * @param key the property key (case-insensitive)
 * @returns the value `object[key]` where `key` is case insensitive
 */
function getValueByCaseInsensitiveKey(object: Record<string, any>, key: string) {
  const lowercaseKeyMap = getLowercaseMapOfKeys(object) || {}
  const originalKey = lowercaseKeyMap[(key as string).toLowerCase()]
  return object[originalKey]
}

/**
 * Given an object and a key, finds if the object has the property `key`, but in this function, the
 * search is done in a case insensitive manner. If the key exists in the object, the original key
 * (case-sensitive) is returned, otherwise, undefined is returned.
 * 
 * Example: suppose an object with a property called `Name`. If this function is called with this
 * object and the second parameter `name` or `Name` or `nAMe`, the result will be `Name`, the
 * original name of the property.
 * 
 * @param object the object to retrieve the original key from
 * @param key the property key (case-insensitive)
 * @returns the original case-sensitive key
 */
function getOriginalKeyByCaseInsensitiveKey(object: Record<string, any>, key: string) {
  const lowercaseKeyMap = getLowercaseMapOfKeys(object) || {}
  const originalKey = lowercaseKeyMap[(key as string).toLowerCase()]
  return originalKey
}

export default {
  getValueByCaseInsensitiveKey,
  getOriginalKeyByCaseInsensitiveKey,
}
