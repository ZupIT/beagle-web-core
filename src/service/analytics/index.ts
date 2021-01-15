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
import formatActionRecord from './actions'
import { AnalyticsConfig, AnalyticsProvider, AnalyticsRecord, ActionRecordParams, ScreenRecordParams } from './types'

function createAnalyticsService(provider?: AnalyticsProvider) {
  const defaultMaxItems = 100
  let hasStarted = false
  let config: AnalyticsConfig
  let queue: (ActionRecordParams | ScreenRecordParams)[] = []
 
  function addToQueue(record: any) {
    const maxItemsInQueue = (provider && provider.getMaximumItemsInQueue)  ? provider.getMaximumItemsInQueue() : defaultMaxItems
    if (queue.length >= maxItemsInQueue) {
      if (!hasStarted) {
        logger.warn(`${maxItemsInQueue} analytics records are queued and waiting for the initial configuration of the AnalyticsProvider to conclude.`)
      }
      logger.error('size exceeded')
      queue.shift()
    }
    queue.push(record)
  }

  async function createScreenRecord(params: ScreenRecordParams) {
    if (!provider) return
    if (!hasStarted) return addToQueue({ type: 'action', params })
    const { platform, route } = params

    if (!config.enableScreenAnalytics) return
    const record: AnalyticsRecord = {
      type: 'screen',
      platform: `WEB ${platform}`,
    }

    if ('screen' in route) record.screenId = route.screen.identifier || route.screen.id
    else record.screen = route.url

    provider.createRecord(record)
  }

  async function createActionRecord(params: ActionRecordParams) {
    if (!provider) return
    if (!hasStarted) return addToQueue({ type: 'action', params })
    const { action, eventName, component, platform, route } = params
    const isActionDisabled = action.analytics && action.analytics.enable === false
    const isActionEnabled = action.analytics && action.analytics.enable === true
    const isActionEnabledInConfig = config.actions[action._beagleAction_]
    const shouldGenerateAnalytics = (isActionEnabled || (!isActionDisabled && isActionEnabledInConfig))

    if (shouldGenerateAnalytics) {
      const record = formatActionRecord({
        action,
        eventName,
        component,
        platform,
        route,
      }, config)
      provider.createRecord(record)
    }
  }

  async function createAnalyticsRecordsInQueue() {
    const promisesList: Promise<void>[] = []
    queue.forEach(item => {
      const actionRecord = (item as ActionRecordParams).action
      if (actionRecord){
        promisesList.push(createActionRecord(item as ActionRecordParams))
      } else {
        promisesList.push(createScreenRecord(item as ScreenRecordParams))
      }
    })
    await Promise.all(promisesList)
    queue = []
  }

  async function start() {
    if (!provider) return
    const startupResult = await Promise.all([provider.startSession(), provider.getConfig()])
    config = startupResult[1]
    hasStarted = true
    createAnalyticsRecordsInQueue()
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
