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

import mapKeys from 'lodash/mapKeys'
import defaultActionHandlers from 'action'
import ComponentMetadata from 'metadata/parser'
import { ExtractedMetadata } from 'metadata/types'
import { updateMiddlewaresInConfiguration } from 'legacy/middlewares'
import BeagleError from 'error/BeagleError'
import defaultOperations from 'operation'
import logger from 'logger'
import { BeagleConfig, LifecycleHookMap, Operation } from './types'


function checkPrefix(items: Record<string, any>) {
  mapKeys(items, (value, key: string) => {
    if (!key.startsWith('custom:') && !key.startsWith('beagle:')) {
      throw new BeagleError(
        `Please check your config. The ${key} is not a valid name. Yours components or actions should always start with "beagle:" if it\'s overwriting a default component or an action, "custom:" if it\'s a custom component or an action`,
      )
    }
  })
}

function getLifecycleHookMap(
  globalLifecycleHooks: BeagleConfig<any>['lifecycles'],
  componentLifecycleHooks: ExtractedMetadata['lifecycles'],
): LifecycleHookMap {
  return {
    beforeStart: {
      components: componentLifecycleHooks.beforeStart,
      global: globalLifecycleHooks && globalLifecycleHooks.beforeStart,
    },
    beforeViewSnapshot: {
      components: componentLifecycleHooks.beforeViewSnapshot,
      global: globalLifecycleHooks && globalLifecycleHooks.beforeViewSnapshot,
    },
    afterViewSnapshot: {
      components: componentLifecycleHooks.afterViewSnapshot,
      global: globalLifecycleHooks && globalLifecycleHooks.afterViewSnapshot,
    },
    beforeRender: {
      components: componentLifecycleHooks.beforeRender,
      global: globalLifecycleHooks && globalLifecycleHooks.beforeRender,
    },
  }
}

function checkOperationNames(operations?: Record<string, Operation>) {
  if (!operations) return
  Object.keys(operations).forEach((key: string) => {
    if (defaultOperations[key as keyof typeof defaultOperations])
      logger.warn(`You are overriding a default operation "${key}"`)

    const match = key.match(/^\w*[A-z_]+\w*$/)
    if (!match)
      throw new BeagleError(`Operation names must have only letters, numbers and the character _. An operation name must have at least one character and must never be comprised of only numbers. "${key}"`)

  })
}

function update(config: BeagleConfig<any>) {
  // todo: remove with version 2.0
  updateMiddlewaresInConfiguration(config)
}

function validate(config: BeagleConfig<any>) {
  checkPrefix(config.components)
  checkOperationNames(config.customOperations)
  config.customActions && checkPrefix(config.customActions)
}

function process(config: BeagleConfig<any>) {
  const actionHandlers = { ...defaultActionHandlers, ...config.customActions }
  const operationHandlers = { ...defaultOperations, ...config.customOperations }
  const componentMetadata = ComponentMetadata.extract(config.components)
  const lifecycleHooks = getLifecycleHookMap(config.lifecycles, componentMetadata.lifecycles)
  return { actionHandlers, lifecycleHooks, childrenMetadata: componentMetadata.children, operationHandlers }
}

export default {
  update,
  validate,
  process,
}
