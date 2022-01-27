/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import defaultWebController from 'beagle-navigator/default-web-controller'
import { createBeagleViewMock } from '../old-structure/utils/test-utils'

describe('Default navigation controller for web applications', () => {
  it('should render the loading component', () => {
    const view = createBeagleViewMock()
    const loadingComponent = { _beagleComponent_: 'custom:loading' }
    defaultWebController.onLoading(view, jest.fn())
    expect(view.getRenderer().doFullRender).toHaveBeenCalledWith(loadingComponent)
  })

  it('should complete the navigation on loading', () => {
    const view = createBeagleViewMock()
    const completeNavigation = jest.fn()
    defaultWebController.onLoading(view, completeNavigation)
    expect(completeNavigation).toHaveBeenCalled()
  })

  it('should render the error component with details and retry option', () => {
    const view = createBeagleViewMock()
    const error = new Error('test')
    const retry = jest.fn()
    const errorComponent = { _beagleComponent_: 'custom:error', errors: [error], retry }
    defaultWebController.onError(view, error, retry, jest.fn())
    expect(view.getRenderer().doFullRender).toHaveBeenCalledWith(errorComponent)
  })

  it('should render the resulting UI', () => {
    const view = createBeagleViewMock()
    const result = { _beagleComponent_: 'beagle:container' }
    defaultWebController.onSuccess(view, result)
    expect(view.getRenderer().doFullRender).toHaveBeenCalledWith(result)
  })
})
