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
import logger from 'logger'
import { BeagleAction } from 'action/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { LocalView, RemoteView, Route } from 'beagle-view/navigator/types'
import formatActionRecord from './actions'
import { AnalyticsConfig, AnalyticsProvider, AnalyticsRecord } from './types'
import { StaticPromise, createStaticPromise } from './../../utils/promise'

function createAnalyticsService(provider?: AnalyticsProvider) {
  let sessionPromise: Promise<void>
  let configPromise: Promise<AnalyticsConfig>
  let maximumItemsInQueue: number
  let isResolved = false
  const queue: StaticPromise<AnalyticsConfig>[] = []

  async function createScreenRecord(route: LocalView | RemoteView, platform?: string) {
    if (!provider) return
    await sessionPromise
    const config = await configPromise

    if (!config.enableScreenAnalytics) return

    const record: AnalyticsRecord = {
      type: 'screen',
      platform: `WEB ${platform}`,
    }

    if ('screen' in route) record.screenId = route.screen.identifier || route.screen.id
    else record.url = route.url

    provider.createRecord(record)
  }

  function getConfig() {
    const staticPromise = createStaticPromise<AnalyticsConfig>()
    Promise.all([sessionPromise, configPromise]).then(([_, config]) => staticPromise.resolve(config))
    return staticPromise
  }

  async function enqueueAndGetConfig() {
    if (queue.length >= maximumItemsInQueue) {
      if (!isResolved) {
        logger.warn(`${maximumItemsInQueue} analytics records are queued and waiting for the initial configuration of the AnalyticsProvider to conclude.`)
      }
      const oldest = queue.shift()
      oldest && oldest.reject('size exceeded')
    }
    const configPromise = getConfig()
    queue.push(configPromise)
    return await configPromise.promise
  }

  async function createActionRecord(
    action: BeagleAction,
    eventName: string,
    component: IdentifiableBeagleUIElement,
    platform: string,
    route: Route) {

    if (!provider) return
    const config = await enqueueAndGetConfig()
    isResolved = true

    const isActionDisabled = action.analytics && action.analytics.enable === false
    const isActionEnabled = action.analytics && action.analytics.enable === true
    const isActionEnabledInConfig = config.actions[action._beagleAction_]
    const shouldGenerateAnalytics = (isActionEnabled || (!isActionDisabled && isActionEnabledInConfig))

    if (shouldGenerateAnalytics) {
      const record = formatActionRecord(action, eventName, config, component, platform, route)
      provider.createRecord(record)
    }
  }

  function start() {
    if (!provider) return
    sessionPromise = provider.startSession()
    configPromise = provider.getConfig()
    maximumItemsInQueue = (provider.getMaximumItemsInQueue && provider.getMaximumItemsInQueue()) || 100
  }

  start()

  return {
    createScreenRecord,
    createActionRecord,
  }
}

export default {
  create: createAnalyticsService,
}
