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
import setup from '../../backend/routes'
import { RenderingResult, renderHomeView, getRepeater, getViewWithAnEmptyRepeater } from '../utils'

describe('Beagle Keep: render home', () => {
  let renderedTrees: RenderingResult
  setup()
  
  beforeAll(async () => {
    renderedTrees = await renderHomeView()
  })

  /**
   * Three renders are expected:
   * - first: the loading component.
   * - second: the view itself (home), with an empty repeater (no children).
   * - third: the repeater is initialized and calls for a second render of the view home, now with
   * as many children as elements in its data source.
   */
  it('should do three full renders with no errors or warnings', () => {
    expect(renderedTrees.beforeStart.length).toBe(3)
    expect(renderedTrees.beforeViewSnapshot.length).toBe(3)
    expect(renderedTrees.afterViewSnapshot.length).toBe(3)
    expect(renderedTrees.beforeRender.length).toBe(3)
    expect(renderedTrees.render.length).toBe(3)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  /**
   * The first render should be the loading component.
   */
  it('should render loading', () => {
    const firstRenderedTree = renderedTrees.render[0]
    expect(firstRenderedTree).toMatchSnapshot()
  })

  /**
   * Tests the first render of the view home. The important point here is that nothing under the
   * repeater's template should be processed. The repeater will only have children in the second
   * render of the view.
   */
  describe('First render of home (empty repeater)', () => {
    /**
     * After rendering the loading component and fetching the view, should start rendering the home
     * page. The snapshot here is raw, just the way the server sent it.
     */
    it('should match snapshot on before start', () => {
      expect(renderedTrees.beforeStart[1]).toMatchSnapshot()
    })

    /**
     * Expected difference from the previous lifecycle (beforeStart): ids for every component;
     * menu.items transformed to menu.children. Containers should have special ids according to
     * their beforeStart lifecycle.
     */
    it('should match snapshot on before view snapshot', () => {
      expect(renderedTrees.beforeViewSnapshot[1]).toMatchSnapshot()
    })

    /**
     * Expected difference from the previous lifecycle (beforeViewSnapshot): none. For the home,
     * there should be no difference in the views received by beforeViewSnapshot and
     * afterViewSnapshot.
     */
    it('should match snapshot on after view snapshot', () => {
      expect(renderedTrees.afterViewSnapshot[1]).toMatchSnapshot()
    })

    /**
     * Expected differences from the previous lifecycle (afterViewSnapshot):
     * - every button should also have the property isSubmit.
     * - actions should have been transformed into functions.
     * - expressions should have been assigned real values.
     * - styles should have been translated to camel-case css.
     */
    it('should match snapshot on before render', () => {
      expect(renderedTrees.beforeRender[1]).toMatchSnapshot()
    })

    /**
     * The tree here is fully processed and ready to be rendered.
     * Expected difference from the the last lifecycle (beforeRender): every container should have
     * { style: { color: '#FFF' } }.
     */
    it('should render home for the first time', () => {
      expect(renderedTrees.render[1]).toMatchSnapshot()
    })
  })

  /**
   * Tests the second render of the view home. This second render is triggered by the component
   * "repeater" via the viewContentManager. Here, the repeater should have content, its children
   * should have been calculated according to the template and data source.
   */
  describe('Second render of home (repeater with content)', () => {
    function shouldBeTheSameAsPreviousExcludingRepeater(
      current: BeagleUIElement,
      previous: BeagleUIElement,
    ) {
      const currentWithEmptyRepeater = getViewWithAnEmptyRepeater(current)
      expect(JSON.stringify(currentWithEmptyRepeater)).toEqual(JSON.stringify(previous))
    }

    function shouldBeTheSameAsPreviousExceptForRepeater(step: keyof RenderingResult) {
      const current = renderedTrees[step][2]
      const previous = renderedTrees[step][1]
      shouldBeTheSameAsPreviousExcludingRepeater(current, previous)
    }

    /**
     * Only the repeater is being altered in this render. The rest of the view doesn't need to go
     * through the beforeRender process again, i.e. the tree received by this lifecycle must be only
     * the repeater component.
     * 
     * In this lifecycle, the only component with an id must be the repeater itself, that has been
     * assigned an id in the first render.
     */
    it('should match snapshot on before start', () => {
      const repeater = renderedTrees.beforeStart[2]
      expect(repeater._beagleComponent_).toBe('custom:repeater')
      expect(repeater).toMatchSnapshot()
    })

    /**
     * Expected difference from the previous lifecycle (beforeStart): ids for every component.
     */
    it('should match snapshot on before view snapshot', () => {
      const repeater = renderedTrees.beforeViewSnapshot[2]
      expect(repeater._beagleComponent_).toBe('custom:repeater')
      expect(repeater).toMatchSnapshot()
    })

    /**
     * The view snapshot has been taken already, i.e. now the rendering process will work with
     * the entire tree and not just the part that has been modified.
     * 
     * In comparison with the same lifecycle in the first render, the only difference is the
     * repeater, so we test the repeater separately, but the rest of tree we test with the same
     * snapshot of the first render.
     * 
     * The repeater must be the same of the last lifecycle (beforeRender).
     */
    it('afterViewSnapshot: repeater must match snapshot', () => {
      const repeater = getRepeater(renderedTrees.afterViewSnapshot[2])
      expect(repeater).toMatchSnapshot()
    })

    it(
      'afterViewSnapshot: should be the same as the previous render, except for the repeater',
      () => shouldBeTheSameAsPreviousExceptForRepeater('afterViewSnapshot'),
    )

    /**
     * Expected differences in the repeater from the previous lifecycle (afterViewSnapshot):
     * - actions in children (not in the template) should have been transformed into functions.
     * - expressions in children (not in the template) should have been assigned real values.
     * - styles in children (not in the template) should have been translated to camel-case css.
     * 
     * The rest of the tree should be equal to the snapshot of the first render in the same
     * lifecycle (home.before-render).
     */
    it('beforeRender: repeater must match snapshot', () => {
      const repeater = getRepeater(renderedTrees.beforeRender[2])
      expect(repeater).toMatchSnapshot()
    })

    it(
      'beforeRender: should be the same as the previous render, except for the repeater',
      () => shouldBeTheSameAsPreviousExceptForRepeater('beforeRender'),
    )

    /**
     * The tree here is fully processed and ready to be rendered.
     * Expected difference in the repeater from the the last lifecycle (beforeRender): every
     * container should have { style: { color: '#FFF' } }.
     * 
     * The rest of the tree should be equal to the snapshot of the first render (home).
     */
    it('render: repeater must match snapshot', () => {
      const repeater = getRepeater(renderedTrees.render[2])
      expect(repeater).toMatchSnapshot()
    })

    it(
      'render: should be the same as the previous render, except for the repeater',
      () => shouldBeTheSameAsPreviousExceptForRepeater('render'),
    )
  })
})
