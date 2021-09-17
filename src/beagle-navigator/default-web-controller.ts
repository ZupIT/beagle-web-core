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

import { BeagleUIElement, ErrorComponentParams } from 'beagle-tree/types'
import { NavigationController } from './types'

const loadingComponentName = 'custom:loading'
const errorComponentName = 'custom:error'

const defaultWebController: NavigationController = {
  onLoading: (view, completeNavigation) => {
    const component: BeagleUIElement = { _beagleComponent_: loadingComponentName }
    view.getRenderer().doFullRender(component)
    completeNavigation()
  },
  onError: (view, error, retry) => {
    const component: BeagleUIElement & ErrorComponentParams = {
      _beagleComponent_: errorComponentName,
      errors: [error],
      retry,
    }
    view.getRenderer().doFullRender(component)
  },
  onSuccess: (view, screen) => {
    view.getRenderer().doFullRender(screen)
  },
}

export default defaultWebController
