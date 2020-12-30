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
import { AnalyticsConfig, AnalyticsProvider, AnalyticsRecord ,ActionRecordParams} from './types'


function createAnalyticsService(provider?: AnalyticsProvider) {
  let hasStarted = false
  let configPromise: Promise<AnalyticsConfig>
  let sessionPromise: Promise<void>

  async function createScreenRecord(params: ActionRecordParams) {
   
    if(!hasStarted) return addToQueue({ type: 'action', params })
    const { action, eventName, component, platform, route } = params
    
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

  function addToQueue(record) {

  }
  
  function createAnalyticsRecordsInQueue(){
    
  }


  // async function enqueueAndGetConfig() {
  //   if (queue.length >= maximumItemsInQueue) {
  //     if (!isResolved) {
  //       logger.warn(`${maximumItemsInQueue} analytics records are queued and waiting for the initial configuration of the AnalyticsProvider to conclude.`)
  //     }
  //     const oldest = queue.shift()
  //     oldest && oldest.reject('size exceeded')
  //   }
  //   const configPromise = getConfig()
  //   queue.push(configPromise)
  //   return await configPromise.promise
  // }

  async function createActionRecord(params: ActionRecordParams) {
    
    if(!hasStarted) return addToQueue({ type: 'action', params })
    const { action, eventName, component, platform, route } = params
    
    if (!provider) return
    await sessionPromise
    const config = await configPromise

    const isActionDisabled = action.analytics && action.analytics.enable === false
    const isActionEnabled = action.analytics && action.analytics.enable === true
    const isActionEnabledInConfig = config.actions[action._beagleAction_]
    const shouldGenerateAnalytics = (isActionEnabled || (!isActionDisabled && isActionEnabledInConfig))

    if (shouldGenerateAnalytics) {
      const record = formatActionRecord(action, eventName, config, component, platform, route)
      provider.createRecord(record)
    }
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
