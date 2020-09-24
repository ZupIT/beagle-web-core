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

import Tree from 'beagle-tree'
import { BeagleUIElement } from 'beagle-tree/types'
import { BeagleConfig } from 'service/beagle-service/types'
import setup from '../../backend/routes'
import createService from '../../frontend/service'
import { expectToMatchSnapshot } from '../../utils/snapshot'
import { enableLogging, disableLogging } from '../../utils/log'
import { whenCalledTimes } from '../../utils/function'

/**
 * The view labels is way too similar to the view home, and, since we already tested home
 * thoroughly, we'll only test the final renders and not lifecycle by lifecycle.
 */
describe('Beagle Keep: render labels', () => {
  enableLogging()
  setup()
  let render: jest.Mock
  /* this config prevents the loading component from being rendered. We tested this component
  already when rendering the home page. It also allow us to test a default navigation
  controller. */
  const config: Partial<BeagleConfig<any>> = {
    navigationControllers: {
      main: {
        default: true,
        shouldShowLoading: false,
      }
    }
  }
  const { createBeagleRemoteView } = createService(config)
  
  beforeAll(async () => {
    const result = await createBeagleRemoteView({ route: '/labels' })
    render = result.render
  })

  afterAll(disableLogging)

  function getViewWithAnEmptyRepeater(view: BeagleUIElement) {
    const emptyRepeaterView = Tree.clone(view)
    const emptyRepeater = Tree.findByType(emptyRepeaterView, 'custom:repeater')[0]
    delete emptyRepeater.children
    return emptyRepeaterView
  }

  /**
   * Two renders are expected:
   * - first: the view itself (labels), with an empty repeater (no children).
   * - second: the repeater is initialized and calls for a second render of the view labels, now
   * with as many children as elements in its data source.
   */
  it('should do two full renders with no errors or warnings', async () => {
    await whenCalledTimes(render, 2)
    expect(render).toHaveBeenCalledTimes(2)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  /**
   * Tests the first render of the view labels. The important point here is that nothing under the
   * repeater's template should be processed. The repeater will only have children in the second
   * render of the view.
   */
  it('should render labels for the first time', async () => {
    const labels = render.mock.calls[0][0]
    await expectToMatchSnapshot(labels, 'labels')
  })

  /**
   * Tests the second render of the view labels. This second render is triggered by the component
   * "repeater" via the viewContentManager. Here, the repeater should have content, its children
   * should have been calculated according to the template and data source.
   * 
   * The rest of the tree should be exactly the same as the first render.
   */
  it('should render labels for the second time, now with the list of labels', async () => {
    const labels = render.mock.calls[1][0]
    const repeater = Tree.findByType(labels, 'custom:repeater')[0]
    const labelsWithEmptyRepeater = getViewWithAnEmptyRepeater(labels)
    await expectToMatchSnapshot(labelsWithEmptyRepeater, 'labels')
    await expectToMatchSnapshot(repeater, `labels.repeater`)
  })
})
