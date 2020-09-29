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
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import setup from '../../../backend/routes'
import { enableLogging, disableLogging } from '../../../../../utils/log'
import { RenderingResult, renderDetailsView } from '../../utils'

/**
 * This page is very different from details and labels, so we'll test every lifecycle again.
 * Here we test the "create note" mode of the view "details".
 */
describe('Beagle Keep: render details (create note)', () => {
  let renderedTrees: RenderingResult
  enableLogging()
  setup()
  
  beforeAll(async () => {
    renderedTrees = await renderDetailsView()
  })

  afterAll(disableLogging)

  /**
   * Two renders are expected:
   * - first: the view details, with a loading overlay.
   * - second: the same view after the onInit from the root container is run. The onInit will call
   * a setContext action, which will trigger a new render. Since the second render is triggered by
   * a setContext, only a partial render is expected and a not full render, i.e., every lifecycle
   * before the view snapshot is not run.
   */
  it('should do one full render and one partial render with no errors or warnings', () => {
    expect(renderedTrees.beforeStart.length).toBe(1)
    expect(renderedTrees.beforeViewSnapshot.length).toBe(1)
    expect(renderedTrees.afterViewSnapshot.length).toBe(2)
    expect(renderedTrees.beforeRender.length).toBe(2)
    expect(renderedTrees.render.length).toBe(2)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  describe('first render of details', () => {
    /**
     * Should start rendering the details page. The snapshot here is raw, just the way the server
     * sent it.
     */
    it('should match snapshot on before start', () => {
      expect(renderedTrees.beforeStart[0]).toMatchSnapshot()
    })

    /**
     * Expected difference from the previous lifecycle (beforeStart): ids for every component.
     * Containers should have special ids according to their beforeStart lifecycle.
     */
    it('should match snapshot on before view snapshot', () => {
      expect(renderedTrees.beforeViewSnapshot[0]).toMatchSnapshot()
    })

    /**
     * Expected difference from the previous lifecycle (beforeViewSnapshot): this page has inputs
     * which are created by the backend with the property "model". "model" is not understood by
     * Beagle, so there's a beforeViewSnapshot lifecycle for text inputs and text areas that
     * transforms the "model" property into a "value" expression and an "onChange" event, which
     * Beagle can understand. Since this transformation occurred in beforeViewSnapshot, the tree
     * received by the lifecycle afterViewSnapshot must have these changes.
     */
    it('should match snapshot on after view snapshot', () => {
      expect(renderedTrees.afterViewSnapshot[0]).toMatchSnapshot()
    })

    /**
     * Expected differences from the previous lifecycle (afterViewSnapshot):
     * - every button should also have the property isSubmit.
     * - actions should have been transformed into functions.
     * - expressions should have been assigned real values.
     * - styles should have been translated to camel-case css.
     */
    it('should match snapshot on before render', () => {
      expect(renderedTrees.beforeRender[0]).toMatchSnapshot()
    })

    /**
     * The tree here is fully processed and ready to be rendered.
     * Expected difference from the previous lifecycle (beforeRender): every container should have
     * { style: { color: '#FFF' } }.
     */
    it('should render details for the first time', () => {
      expect(renderedTrees.render[0]).toMatchSnapshot()
    })
  })

  /**
   * The only difference from the second render to the first is that "isVisible" in the component
   * "custom:loadingOverlay" will be false instead of true.
   */
  describe('second render of details (partial). Hides the loading.', () => {
    function loadingOverlayShouldBeInvisible(details: IdentifiableBeagleUIElement) {
      const loadingOverlay = Tree.findByType(details, 'custom:loadingOverlay')[0]
      expect(loadingOverlay.isVisible).toBe(false)
    }

    function shouldBeTheSameAsPreviousExcludingLoadingOverlayVisibility(
      current: IdentifiableBeagleUIElement,
      previous: IdentifiableBeagleUIElement,
    ) {
      const currentWithoutChanges = Tree.clone(current)
      const loadingOverlay = Tree.findByType(currentWithoutChanges, 'custom:loadingOverlay')[0]
      currentWithoutChanges.context!.value.isLoading = true
      loadingOverlay.isVisible = true
      expect(JSON.stringify(currentWithoutChanges)).toEqual(JSON.stringify(previous))
    }

    /**
     * At this time, the only difference from the previous render is the context, where isLoading is
     * now false.
     */
    it('afterViewSnapshot: isLoading in the context should be false', () => {
      const details = renderedTrees.afterViewSnapshot[1]
      expect(details.context!.value.isLoading).toBe(false)
    })

    it(
      'afterViewSnapshot: with the exception of the context, the rest of the tree should be the same as the last afterViewSnapshot',
      () => {
        const detailsWithoutChanges = Tree.clone(renderedTrees.afterViewSnapshot[1])
        detailsWithoutChanges.context!.value.isLoading = true
        expect(detailsWithoutChanges).toEqual(renderedTrees.afterViewSnapshot[0])
      },
    )

    /**
     * In comparison to the last beforeRender, there are two differences:
     * - isLoading, in the context is false, as seen in the last lifecycle (afterViewSnapshot)
     * - the property "isVisible" from the component "custom:loadingOverlay" is resolved to false.
     */
    it('beforeRender: loading overlay should be invisible', () => {
      const details = renderedTrees.beforeRender[1]
      loadingOverlayShouldBeInvisible(details)
    })

    it(
      'beforeRender: with the exception of the visibility of the loading overlay, the rest of the tree should be the same as the last beforeRender',
      () => {
        const current = renderedTrees.beforeRender[1]
        const previous = renderedTrees.beforeRender[0]
        shouldBeTheSameAsPreviousExcludingLoadingOverlayVisibility(current, previous)
      },
    )

    /**
     * Same differences to the last render as the previous lifecycle (beforeRender)
     */
    it('render: loading overlay should be invisible', () => {
      const details = renderedTrees.render[1]
      loadingOverlayShouldBeInvisible(details)
    })

    it(
      'render: with the exception of the visibility of the loading overlay, the rest of the tree should be the same as the last render',
      () => {
        const current = renderedTrees.render[1]
        const previous = renderedTrees.render[0]
        shouldBeTheSameAsPreviousExcludingLoadingOverlayVisibility(current, previous)
      },
    )
  })
})
