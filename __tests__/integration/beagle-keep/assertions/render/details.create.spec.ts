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

import { Lifecycle } from 'service/beagle-service/types'
import { BeagleConfig } from 'service/beagle-service/types'
import Tree from 'beagle-tree'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import setup from '../../backend/routes'
import createService from '../../frontend/service'
import { expectToMatchSnapshot, takeSnapshot } from '../../../../utils/snapshot'
import { enableLogging, disableLogging } from '../../../../utils/log'
import { whenCalledTimes } from '../../../../utils/function'

/**
 * This page is very different from details and labels, so we'll test every lifecycle again.
 * Here we test the "create note" mode of the view "details".
 */
describe('Beagle Keep: render details (create note)', () => {
  enableLogging()
  setup()
  let render: jest.Mock
  /* this config prevents the loading component from being rendered. We tested this component
  already when rendering the details page. It also allow us to test a default navigation
  controller. */
  const config: Partial<BeagleConfig<any>> = {
    navigationControllers: {
      main: {
        default: true,
        shouldShowLoading: false,
      }
    }
  }
  const { service, createBeagleRemoteView } = createService(config)
  const {
    afterViewSnapshot,
    beforeRender,
    beforeStart,
    beforeViewSnapshot,
  } = service.getConfig().lifecycles! as Record<Lifecycle, jest.Mock>
  
  beforeAll(async () => {
    const result = await createBeagleRemoteView({ route: '/details' })
    render = result.render
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
  it('should do one full render and one partial render with no errors or warnings', async () => {
    await whenCalledTimes(render, 2)
    expect(beforeStart).toHaveBeenCalledTimes(1)
    expect(beforeViewSnapshot).toHaveBeenCalledTimes(1)
    expect(afterViewSnapshot).toHaveBeenCalledTimes(2)
    expect(beforeRender).toHaveBeenCalledTimes(2)
    expect(render).toHaveBeenCalledTimes(2)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  describe('first render of details', () => {
    /**
     * Should start rendering the details page. The snapshot here is raw, just the way the server
     * sent it.
     */
    it('should match snapshot on before start', async () => {
      const details = beforeStart.mock.calls[0][0]
      await expectToMatchSnapshot(details, 'details.before-start')
    })

    /**
     * Expected difference from the previous lifecycle (beforeStart): ids for every component.
     * Containers should have special ids according to their beforeStart lifecycle.
     */
    it('should match snapshot on before view snapshot', async () => {
      const details = beforeViewSnapshot.mock.calls[0][0]
      await expectToMatchSnapshot(details, 'details.before-view-snapshot')
    })

    /**
     * Expected difference from the previous lifecycle (beforeViewSnapshot): this page has inputs
     * which are created by the backend with the property "model". "model" is not understood by
     * Beagle, so there's a beforeViewSnapshot for text inputs and text areas that transforms the
     * "model" property into a "value" expression and an "onChange" event, which Beagle can
     * understand. Since this transformation occurred in beforeViewSnapshot, the tree received by
     * the lifecycle afterViewSnapshot must have these changes.
     */
    it('should match snapshot on after view snapshot', async () => {
      const details = afterViewSnapshot.mock.calls[0][0]
      await expectToMatchSnapshot(details, 'details.after-view-snapshot')
    })

    /**
     * Expected differences from the previous lifecycle (afterViewSnapshot):
     * - every button should also have the property isSubmit.
     * - actions should have been transformed into functions.
     * - expressions should have been assigned real values.
     * - styles should have been translated to camel-case css.
     */
    it('should match snapshot on before render', async () => {
      const details = beforeRender.mock.calls[0][0]
      await expectToMatchSnapshot(details, 'details.before-render')
    })

    /**
     * The tree here is fully processed and ready to be rendered.
     * Expected difference from the the last lifecycle (beforeRender): every container should have
     * { style: { color: '#FFF' } }.
     */
    it('should render details for the first time', async () => {
      const details = render.mock.calls[0][0]
      await expectToMatchSnapshot(details, 'details')
    })
  })

  /**
   * The only difference from the second render to the first is that "isVisible" in the component
   * "custom:loadingOverlay" will be false instead of true.
   */
  describe('second render of details (partial). Hides the loading.', () => {
    beforeAll(async () => {
      await whenCalledTimes(render, 2)
    })

    function loadingOverlayShouldBeInvisible(details: IdentifiableBeagleUIElement) {
      const loadingOverlay = Tree.findByType(details, 'custom:loadingOverlay')[0]
      expect(loadingOverlay.isVisible).toBe(false)
    }

    function shouldBeTheSameExcludingLoadingOverlayVisibility(fn: jest.Mock) {
      const details = Tree.clone(fn.mock.calls[1][0])
      const loadingOverlay = Tree.findByType(details, 'custom:loadingOverlay')[0]
      details.context.value.isLoading = true
      loadingOverlay.isVisible = true
      // we need to use takeSnapshot here so the functions in the trees can be considered the same
      expect(takeSnapshot(details)).toEqual(takeSnapshot(fn.mock.calls[0][0]))
    }

    /**
     * At this time, the only difference from the previous render is the context, where isLoading is
     * now false.
     */
    it('afterViewSnapshot: isLoading in the context should be false', () => {
      const details = afterViewSnapshot.mock.calls[1][0]
      expect(details.context.value.isLoading).toBe(false)
    })

    it(
      'afterViewSnapshot: with the exception of the context, the rest of the tree should be the same as the last afterViewSnapshot',
      () => {
        const details = Tree.clone(afterViewSnapshot.mock.calls[1][0])
        details.context.value.isLoading = true
        expect(details).toEqual(afterViewSnapshot.mock.calls[0][0])
      },
    )

    /**
     * In comparison to the last beforeRender, there are two differences:
     * - isLoading, in the context is false, as seen in the last lifecycle (afterViewSnapshot)
     * - the property "isVisible" from the component "custom:loadingOverlay" is resolved to false.
     */
    it('beforeRender: loading overlay should be invisible', () => {
      const details = beforeRender.mock.calls[1][0]
      loadingOverlayShouldBeInvisible(details)
    })

    it(
      'beforeRender: with the exception of the visibility of the loading overlay, the rest of the tree should be the same as the last beforeRender',
      () => shouldBeTheSameExcludingLoadingOverlayVisibility(beforeRender),
    )

    /**
     * Same differences to the last render as the previous lifecycle (beforeRender)
     */
    it('render: loading overlay should be invisible', () => {
      const details = render.mock.calls[1][0]
      loadingOverlayShouldBeInvisible(details)
    })

    it(
      'render: with the exception of the visibility of the loading overlay, the rest of the tree should be the same as the last render',
      () => shouldBeTheSameExcludingLoadingOverlayVisibility(render),
    )
  })
})
