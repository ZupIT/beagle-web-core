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

import { BeagleNavigationAction } from 'index'
import logger from 'logger'
import { flatten } from 'lodash'
import NavigationActions from 'action/navigation'

const lowerCaseNavigationActions = Object.keys(NavigationActions).map(key => key.toLowerCase())

function findNavigationActions(data: any, shouldIgnoreComponents = true): BeagleNavigationAction[] {
  if (!data || typeof data !== 'object' || (shouldIgnoreComponents && data._beagleComponent_)) {
    return []
  }

  if (Array.isArray(data)) return flatten(data.map(item => findNavigationActions(item)))

  let result: BeagleNavigationAction[] = []
  const isNavigationAction = (
    typeof data._beagleAction_ === 'string'
    && lowerCaseNavigationActions.includes(data._beagleAction_.toLowerCase())
  )
  if (isNavigationAction) result.push(data)
  const keys = Object.keys(data)
  keys.forEach(key => result = [...result, ...findNavigationActions(data[key])])

  return result
}

function validateUrl(url?: string) {
  if (!url) return false
  const isDynamic = !!url.match(/@\{.+\}/)
  if (isDynamic) logger.warn(`Dynamic URLs cannot be pre-fetched: ${url}`)
  return !isDynamic
}

export { findNavigationActions, validateUrl }
