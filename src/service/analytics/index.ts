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
  let config: AnalyticsConfig | null
  let queue: (ActionRecordParams | ScreenRecordParams)[] = []
  let createActionRecord: ((params: ActionRecordParams) => Promise<void>) // eslint-disable-line prefer-const
  let createScreenRecord: ((params: ScreenRecordParams) => Promise<void>) // eslint-disable-line prefer-const
  
  function addToQueue(record: ActionRecordParams | ScreenRecordParams) {
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

  async function createAnalyticsRecordsInQueue() {
    const promisesList: Promise<void>[] = []
    if (!provider) return
    hasStarted = true
    queue.forEach(item => {
      const actionRecord = (item as ActionRecordParams).action
      if (actionRecord){
        promisesList.push(createActionRecord(item as ActionRecordParams))
        
      } else {
       promisesList.push(createScreenRecord(item as ScreenRecordParams))
      }
    })
    await Promise.all(promisesList)
    hasStarted = false
    queue = []
  }
  
  createScreenRecord = async function (params: ScreenRecordParams) {
    if (!provider) return
    if (config == null) return addToQueue(params)
    const { platform, route } = params

    if (config && !config.enableScreenAnalytics) return
    const record: AnalyticsRecord = {
      type: 'screen',
      platform: `WEB ${platform}`,
      timestamp: Math.round(Date.now() / 1000),
    }

    if (route && 'screen' in route) record.screenId = route.screen.identifier || route.screen.id
    else record.screen = route.url

    provider.createRecord(record)

    if (!hasStarted && queue.length > 0){
      createAnalyticsRecordsInQueue()
    }
  }

  createActionRecord = async function (params: ActionRecordParams) {
    if (!provider) return
    const { action, eventName, component, platform, route } = params
    config = provider.getConfig()

    if (config == null) return addToQueue(params)
    const isActionEnabledInPayload = action.analytics
    const isActionEnabledInConfig = config && config.actions[action._beagleAction_]
    const shouldGenerateAnalytics = (isActionEnabledInPayload || isActionEnabledInConfig)
 
    if (shouldGenerateAnalytics && config) {
      const record = formatActionRecord({
        action,
        eventName,
        component,
        platform,
        route,
      }, config)
      provider.createRecord(record)
    }

    if (!hasStarted && queue.length > 0){
      createAnalyticsRecordsInQueue()
    }
  }


  function start() {
    if (!provider) return
    const startupResult = provider.getConfig()
    config = startupResult
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
