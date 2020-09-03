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

import { BeagleUIElement } from 'beagle-tree/types'
import { BeagleConfig } from 'service/beagle-service/types'
import logger from 'logger'

export function updateMiddlewaresInConfiguration(config: BeagleConfig<any>) {
  if (config.middlewares) {
    logger.warn('Middlewares are deprecated. Consider using lifecycles instead.')
    config.lifecycles = config.lifecycles || {}
    const originalBeforeViewSnapshot = config.lifecycles.beforeViewSnapshot
    config.lifecycles.beforeViewSnapshot = (viewTree) => {
      let result = originalBeforeViewSnapshot ? originalBeforeViewSnapshot(viewTree) : viewTree
      if (!result) result = viewTree 
      config.middlewares!.forEach((middleware) => {
        result = middleware(result as BeagleUIElement<any>)
      })
  
      return result
    }
  }
}
