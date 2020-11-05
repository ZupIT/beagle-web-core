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

import { BeagleAction } from 'action/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { LocalView, RemoteView } from 'beagle-view/navigator/types'
import { AnalyticsConfig, AnalyticsProvider } from './types'
import analyticsUtils from './utils'

function createAnalyticsService(provider?: AnalyticsProvider) {
  let sessionPromise: Promise<void>
  let configPromise: Promise<AnalyticsConfig>
  console.log('CREATING ANALYTICS SERVICE')

  async function createScreenRecord(route: LocalView | RemoteView, platform?: string) {
    if (!provider) return
    console.log('CREATING ANALYTICS SCREEN RECORD')
    await sessionPromise
    const config = await configPromise
    if (!config.enableScreenAnalytics) return
    provider.createRecord({
      type: 'screen',
      platform: `WEB ${platform}`,
      url: 'url' in route && route.url,
      screenId: 'screen' in route && route.screen,
    })
  }

  async function createActionRecord(
    action: BeagleAction,
    eventName: string,
    component: IdentifiableBeagleUIElement,
    platform?: string) {

    if (!provider) return
    await sessionPromise
    const config = await configPromise
    const shouldRecordThisAction = config.actions[action._beagleAction_] && action.analytics?.enable !== false
    const isActionAnalyticsEnabled = action.analytics?.enable
    if (isActionAnalyticsEnabled || shouldRecordThisAction) {
      const record = analyticsUtils.formatActionRecord(action, eventName, config, component, platform)
      provider.createRecord(record)
    }
    console.log(action)

  }

  async function start() {
    if (!provider) return
    console.log('STARTING ANALYTICS SERVICE')
    sessionPromise = provider.startSession()
    configPromise = provider.getConfig()
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
