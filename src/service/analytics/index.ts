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

import { BeagleView } from 'index'
import formatActionRecord from './actions'
import { AnalyticsProvider, AnalyticsRecord, ActionRecordParams, ScreenRecordParams, ScreenAnalyticsRecord } from './types'

function createAnalyticsService(provider?: AnalyticsProvider) {

  async function createScreenRecord(params: ScreenRecordParams) {
    if (!provider) return
    const config = provider.getConfig()
    const { platform, route, currentTree } = params

    if (config && !config.enableScreenAnalytics) return
    const record: ScreenAnalyticsRecord = {
      type: 'screen',
      platform: `WEB ${platform}`,
      timestamp: Date.now()
    }

    if (route) {

      if ('screen' in route)
        record.screen = route.screen.identifier || route.screen.id

      if ('url' in route)
        record.screen = route.url

      /* The backend allows us to create the root component as a ScreenComponent, 
      which means sometimes the root id might be an identifier
      this is deprecated and will be removed in version 2.0 */
      record.rootId = currentTree.identifier || currentTree.id
    }

    provider.createRecord(record)

  }

  async function createActionRecord(params: ActionRecordParams) {
    if (!provider) return
    const { action, eventName, component, platform, route } = params
    const config = provider.getConfig()

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
  }

  return {
    createScreenRecord,
    createActionRecord,
  }
}

export default {
  create: createAnalyticsService,
}
