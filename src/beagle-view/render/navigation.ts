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

import flatten from 'lodash/flatten'
import { BeagleUIElement } from 'beagle-tree/types'
import NavigationActions from 'action/navigation'
import { BeagleNavigationAction } from 'action/navigation/types'
import StringUtils from 'utils/string'
import { URLBuilder } from 'service/network/url-builder/types'
import { PreFetcher } from 'service/network/pre-fetcher/types'
import logger from 'logger'

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

async function preFetchWithWarning(preFetcher: PreFetcher, url: string) {
  try {
    await preFetcher.fetch(url)
  } catch (error) {
    logger.warn(error)
  }
}

async function preFetchViews(
  component: BeagleUIElement,
  urlBuilder: URLBuilder,
  preFetcher: PreFetcher,
) {
  const navigationActions = findNavigationActions(component, false)
  const promises: Promise<void>[] = []

  navigationActions.forEach((action: any) => {
    const shouldPrefetch = action.route && action.route.shouldPrefetch
    const isUrlValid = action.route && validateUrl(action.route.url)
    if (shouldPrefetch && isUrlValid) {
      const path = StringUtils.addPrefix(action.route.url, '/')
      const url = urlBuilder.build(path)
      promises.push(preFetchWithWarning(preFetcher, url))
    }
  })

  await Promise.all(promises)
}

export default {
  preFetchViews,
}
