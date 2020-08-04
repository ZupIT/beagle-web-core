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

function removePrefix(str: string, prefix: string) {
  return str.replace(new RegExp(`^${prefix}`), '')
}

function addPrefix(str: string, prefix: string) {
  return  (!str || str[0] !== prefix) ? `${prefix}${str}` : str
}

function removeSuffix(str: string, suffix: string) {
  return str.replace(new RegExp(`${suffix}$`), '')
}

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
