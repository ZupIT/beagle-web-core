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

/**
 * Creates a query parameter string according to a <key, value> map.
 * 
 * Example: for the input `{ name: 'Shallan Davar', 'birth place': 'Jah Keved' }`, the result
 * would be `?name=Shallan%20Davar&birth%20place=Jah%20Keved`.
 * 
 * @param data the <key, value> map
 * @returns the query string
 */
function createQueryString(data: Record<string, string>) {
  if (!data || !Object.keys(data).length) return ''
  const keys = Object.keys(data)
  const params = keys.map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
  
  return `?${params.join('&')}`
}

export default {
  createQueryString,
}
