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
import { BeagleView } from 'beagle-view/types'
import formatActionRecord from './actions'
import { AnalyticsConfig, AnalyticsProvider, AnalyticsRecord } from './types'

function createAnalyticsService(provider?: AnalyticsProvider) {
  let sessionPromise: Promise<void>
  let configPromise: Promise<AnalyticsConfig>

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

  async function createActionRecord(
    action: BeagleAction,
    eventName: string,
    component: IdentifiableBeagleUIElement,
    beagleView: BeagleView) {

    if (!provider) return
    await sessionPromise
    const config = await configPromise

    const isActionDisabled = action.analytics && action.analytics.enable === false
    const isActionEnabled = action.analytics && action.analytics.enable === true
    const isActionEnabledInConfig = config.actions[action._beagleAction_]
    const shouldGenerateAnalytics = provider && (isActionEnabled || (!isActionDisabled && isActionEnabledInConfig))

    if (shouldGenerateAnalytics) {
      const record = formatActionRecord(action, eventName, config, component, beagleView)
      provider.createRecord(record)
    }
  }

  async function start() {
    if (!provider) return
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