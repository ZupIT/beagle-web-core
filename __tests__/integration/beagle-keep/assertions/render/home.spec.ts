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
import Tree from 'beagle-tree'
import { BeagleUIElement } from 'beagle-tree/types'
import setup from '../../backend/routes'
import createService from '../../frontend/service'
import { expectToMatchSnapshot } from '../../../../utils/snapshot'
import { enableLogging, disableLogging } from '../../../../utils/log'
import { whenCalledTimes } from '../../../../utils/function'

describe('Beagle Keep: render home', () => {
  enableLogging()
  setup()
  let render: jest.Mock
  const { service, createBeagleRemoteView } = createService()
  const {
    afterViewSnapshot,
    beforeRender,
    beforeStart,
    beforeViewSnapshot,
  } = service.getConfig().lifecycles! as Record<Lifecycle, jest.Mock>
  
  beforeAll(async () => {
    const result = await createBeagleRemoteView({ route: '/home' })
    render = result.render
  })

  afterAll(disableLogging)

  /**
   * The first render should be the loading component.
   */
  it('should render loading', async () => {
    const firstRenderedTree = render.mock.calls[0][0]
    await expectToMatchSnapshot(firstRenderedTree, 'loading')
  })

  /**
   * Three renders are expected:
   * - first: the loading component.
   * - second: the view itself (home), with an empty repeater (no children).
   * - third: the repeater is initialized and calls for a second render of the view home, now with
   * as many children as elements in its data source.
   */
  it('should do three full renders with no errors or warnings', async () => {
    await whenCalledTimes(render, 3)
    expect(beforeStart).toHaveBeenCalledTimes(3)
    expect(beforeViewSnapshot).toHaveBeenCalledTimes(3)
    expect(afterViewSnapshot).toHaveBeenCalledTimes(3)
    expect(beforeRender).toHaveBeenCalledTimes(3)
    expect(render).toHaveBeenCalledTimes(3)
    expect(globalMocks.log).not.toHaveBeenCalled()
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
    it('should match snapshot on before start', async () => {
      const home = beforeStart.mock.calls[1][0]
      await expectToMatchSnapshot(home, 'home.before-start')
    })

    /**
     * Expected difference from the previous lifecycle (beforeStart): ids for every component;
     * menu.items transformed to menu.children. Containers should have special ids according to
     * their beforeStart lifecycle.
     */
    it('should match snapshot on before view snapshot', async () => {
      const home = beforeViewSnapshot.mock.calls[1][0]
      await expectToMatchSnapshot(home, 'home.before-after-view-snapshot')
    })

    /**
     * Expected difference from the previous lifecycle (beforeViewSnapshot): none. For the home,
     * there should be no difference in the views received by beforeViewSnapshot and
     * afterViewSnapshot.
     */
    it('should match snapshot on after view snapshot', async () => {
      const home = afterViewSnapshot.mock.calls[1][0]
      await expectToMatchSnapshot(home, 'home.before-after-view-snapshot')
    })

    /**
     * Expected differences from the previous lifecycle (afterViewSnapshot):
     * - every button should also have the property isSubmit.
     * - actions should have been transformed into functions.
     * - expressions should have been assigned real values.
     * - styles should have been translated to camel-case css.
     */
    it('should match snapshot on before render', async () => {
      const home = beforeRender.mock.calls[1][0]
      await expectToMatchSnapshot(home, 'home.before-render')
    })

    /**
     * The tree here is fully processed and ready to be rendered.
     * Expected difference from the the last lifecycle (beforeRender): every container should have
     * { style: { color: '#FFF' } }.
     */
    it('should render home for the first time', async () => {
      const home = render.mock.calls[1][0]
      await expectToMatchSnapshot(home, 'home')
    })
  })

  /**
   * Tests the second render of the view home. This second render is triggered by the component
   * "repeater" via the viewContentManager. Here, the repeater should have content, its children
   * should have been calculated according to the template and data source.
   */
  describe('Second render of home (repeater with content)', () => {
    beforeAll(async () => {
      await whenCalledTimes(render, 3)
    })

    function getViewWithAnEmptyRepeater(view: BeagleUIElement) {
      const emptyRepeaterView = Tree.clone(view)
      const emptyRepeater = Tree.findByType(emptyRepeaterView, 'custom:repeater')[0]
      delete emptyRepeater.children
      return emptyRepeaterView
    }

    async function shouldMatchRepeaterAndLastRenderSnapshots(
      mockFn: jest.Mock,
      pathSuffix: string,
    ) {
      const home = mockFn.mock.calls[2][0]
      const repeater = Tree.findByType(home, 'custom:repeater')[0]
      const homeWithEmptyRepeater = getViewWithAnEmptyRepeater(home)
      await expectToMatchSnapshot(homeWithEmptyRepeater, `home${pathSuffix}`)
      await expectToMatchSnapshot(repeater, `home.repeater${pathSuffix}`)
    }

    /**
     * Only the repeater is being altered in this render. The rest of the view doesn't need to go
     * through the beforeRender process again, i.e. the tree received by this lifecycle must be only
     * the repeater component.
     * 
     * In this lifecycle, the only component with an id must be the repeater itself, that has been
     * assigned an id in the first render.
     */
    it('should match snapshot on before start', async () => {
      const repeater = beforeStart.mock.calls[2][0]
      await expectToMatchSnapshot(repeater, 'home.repeater.before-start')
    })

    /**
     * Expected difference from the previous lifecycle (beforeStart): ids for every component.
     */
    it('should match snapshot on before view snapshot', async () => {
      const repeater = beforeViewSnapshot.mock.calls[2][0]
      await expectToMatchSnapshot(repeater, 'home.repeater.before-after-view-snapshot')
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
    it('should match snapshot on after view snapshot', () => (
      shouldMatchRepeaterAndLastRenderSnapshots(afterViewSnapshot, '.before-after-view-snapshot')
    ))

    /**
     * Expected differences in the repeater from the previous lifecycle (afterViewSnapshot):
     * - actions in children (not in the template) should have been transformed into functions.
     * - expressions in children (not in the template) should have been assigned real values.
     * - styles in children (not in the template) should have been translated to camel-case css.
     * 
     * The rest of the tree should be equal to the snapshot of the first render in the same
     * lifecycle (home.before-render).
     */
    it('should match snapshot on before render', () => (
      shouldMatchRepeaterAndLastRenderSnapshots(beforeRender, '.before-render')
    ))

    /**
     * The tree here is fully processed and ready to be rendered.
     * Expected difference in the repeater from the the last lifecycle (beforeRender): every
     * container should have { style: { color: '#FFF' } }.
     * 
     * The rest of the tree should be equal to the snapshot of the first render (home).
     */
    it('should render home for the second time, now with the list of notes', () => (
      shouldMatchRepeaterAndLastRenderSnapshots(render, '')
    ))
  })
})
