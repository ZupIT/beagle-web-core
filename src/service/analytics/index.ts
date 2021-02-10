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
import { AnalyticsProvider, AnalyticsRecord, ActionRecordParams, ScreenRecordParams } from './types'

function createAnalyticsService(provider?: AnalyticsProvider) {
  const defaultMaxItems = 100
  let isConsumingQueue = false
  let queue: (ActionRecordParams | ScreenRecordParams)[] = []
  //eslint is disabled in the next lines because the typescript is not recognizing the variable attribution correctly
  let createActionRecord: ((params: ActionRecordParams) => Promise<void>) // eslint-disable-line prefer-const
  let createScreenRecord: ((params: ScreenRecordParams) => Promise<void>) // eslint-disable-line prefer-const
  
  function addToQueue(record: ActionRecordParams | ScreenRecordParams) {
    const maxItemsInQueue = (provider && provider.getMaximumItemsInQueue)  ? provider.getMaximumItemsInQueue() : defaultMaxItems
    if (queue.length >= maxItemsInQueue) {
      if (!isConsumingQueue) {
        logger.warn(`${maxItemsInQueue} analytics records are queued and waiting for the initial configuration of the AnalyticsProvider to conclude. 
        This is probably an error within your analytics provider. Why is getConfig() still returning null? From now on, some analytics records will 
        be lost. If you need to increase the maximum number of items the queue can support, implement getMaximumItemsInQueue() in your 
        AnalyticsProvider.`)
      }
      logger.error('size exceeded')
      queue.shift()
    }
    queue.push(record)
  }

  async function createAnalyticsRecordsInQueue() {
    if (!provider) return
    isConsumingQueue = true

    const promisesList = queue.map(item => 'action' in item ? createActionRecord(item) : createScreenRecord(item))

    await Promise.all(promisesList)
    isConsumingQueue = false
    queue = []
  }
  
  createScreenRecord = async function (params: ScreenRecordParams) {
    if (!provider) return
    const config = provider.getConfig()

    if (!config) return addToQueue(params)
    const { platform, route } = params

    if (config && !config.enableScreenAnalytics) return
    const record: AnalyticsRecord = {
      type: 'screen',
      platform: `WEB ${platform}`,
      timestamp: Date.now(),
    }

    if (route && 'screen' in route) record.screenId = route.screen.identifier || route.screen.id
    else record.screen = route.url

    provider.createRecord(record)

    if (!isConsumingQueue && queue.length > 0){
      createAnalyticsRecordsInQueue()
    }
  }

  createActionRecord = async function (params: ActionRecordParams) {
    if (!provider) return
    const { action, eventName, component, platform, route } = params
    const config = provider.getConfig()

    if (!config) return addToQueue(params)
    const isActionEnabledInPayload = !!action.analytics
    const isActionDisabledInPayload = action.analytics === false
    const isActionEnabledInConfig = config.actions[action._beagleAction_]
    const shouldGenerateAnalytics = (isActionEnabledInPayload || (!isActionDisabledInPayload && isActionEnabledInConfig))
    
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

    if (!isConsumingQueue && queue.length > 0){
      createAnalyticsRecordsInQueue()
    }
  }

  return {
    createScreenRecord,
    createActionRecord,
  }
}

export default {
  create: createAnalyticsService,
}
