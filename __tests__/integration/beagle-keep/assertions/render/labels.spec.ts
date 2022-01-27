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

import setup from '../../backend/routes'
import {
  RenderingResult,
  renderLabelsView,
  getRepeater,
  getViewWithAnEmptyRepeater,
} from '../utils'

/**
 * The view labels is way too similar to the view home, and, since we already tested home
 * thoroughly, we'll only test the final renders and not lifecycle by lifecycle.
 */
describe('Beagle Keep: render labels', () => {
  let renderedTrees: RenderingResult
  setup()
  
  beforeAll(async () => {
    renderedTrees = await renderLabelsView()
  })

  /**
   * Two renders are expected:
   * - first: the view itself (labels), with an empty repeater (no children).
   * - second: the repeater is initialized and calls for a second render of the view labels, now
   * with as many children as elements in its data source.
   */
  it('should do two full renders with no errors or warnings', () => {
    expect(renderedTrees.render.length).toBe(2)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  /**
   * Tests the first render of the view labels. The important point here is that nothing under the
   * repeater's template should be processed. The repeater will only have children in the second
   * render of the view.
   */
  it('should render labels for the first time', () => {
    expect(renderedTrees.render[0]).toMatchSnapshot()
  })

  /**
   * Tests the second render of the view labels. This second render is triggered by the component
   * "repeater" via the viewContentManager. Here, the repeater should have content, its children
   * should have been calculated according to the template and data source.
   * 
   * The rest of the tree should be exactly the same as the first render.
   */
  it('should render labels for the second time, now with the list of labels', () => {
    const labels = renderedTrees.render[1]
    const repeater = getRepeater(labels)
    expect(repeater).toMatchSnapshot()
  })

  /**
   * The rest of the tree should be exactly the same as the first render.
   */
  it('second render should be the same as the first, except for the repeater', () => {
    const current = renderedTrees.render[1]
    const previous = renderedTrees.render[0]
    const labelsWithEmptyRepeater = getViewWithAnEmptyRepeater(current)
    expect(JSON.stringify(labelsWithEmptyRepeater)).toEqual(JSON.stringify(previous))
  })
})
