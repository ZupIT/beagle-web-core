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

/**
 * Removes a prefix from the string.
 * 
 * @param str the string to have the `prefix` removed from
 * @param prefix the prefix to remove from the string
 * @returns the string without the prefix
 */
function removePrefix(str: string, prefix: string) {
  return str.replace(new RegExp(`^${prefix}`), '')
}

/**
 * Adds a single character to start of the string if the string doesn't yet start with this
 * character.
 * 
 * @param str the string to add the prefix character to
 * @param prefix the single character to add as prefix
 * @returns the resulting string
 */
function addPrefix(str: string, prefix: string) {
  return  (!str || str[0] !== prefix) ? `${prefix}${str}` : str
}

/**
 * Removes a suffix from the string.
 * 
 * @param str the string to have the `suffix` removed from
 * @param suffix the suffix to remove from the string
 * @returns the string without the suffix
 */
function removeSuffix(str: string, suffix: string) {
  return str.replace(new RegExp(`${suffix}$`), '')
}

/**
 * Transforms the first letter of the string into an uppercase letter.
 * 
 * @param str the string to capitalize
 * @returns the resulting string
 */
function capitalizeFirstLetter(str: string): string {
  if (!str.length) return str
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export default {
  removePrefix,
  addPrefix,
  removeSuffix,
  capitalizeFirstLetter,
}
