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
import { BeagleView } from 'beagle-view/types'
import { FullNote } from '../../../backend/database/notes'
import { whenCalledTimes } from '../../../../../utils/function'
import { setupHomeActionsTest } from './utils'
import { whenNextNavigation } from '../../utils'

describe('Beagle Keep: actions: home: menu', () => {
  const { createRemoteViewAndWaitInitialRendering } = setupHomeActionsTest()

  function getMenuItems(tree: IdentifiableBeagleUIElement) {
    return {
      notes: Tree.findById(tree, 'menu:notes')!,
      labels: Tree.findById(tree, 'menu:labels')!,
      personal: Tree.findById(tree, 'menu:label:0')!,
    }
  }

  describe('should navigate to the view "labels" when the menu item "labels" is pressed', () => {
    let secondRouteRenderFn: jest.Mock
    let beagleViews: BeagleView[] = []
    const renderedTrees: Record<string, IdentifiableBeagleUIElement> = {}

    beforeAll(async () => {
      const { tree, beagleView: bView, widgetRef } = await createRemoteViewAndWaitInitialRendering()
      beagleViews.push(bView)
      const { labels } = getMenuItems(tree)
      const nextNavigation = whenNextNavigation(bView.getNavigator()!)
      labels.onPress()
      // waits for the next navigation to complete
      await nextNavigation
      // gets the widget corresponding to the new route
      const newWidget = widgetRef.current
      beagleViews.push(newWidget.view)
      secondRouteRenderFn = newWidget.render
      // first: loading; second: labels with empty repeater; third: labels with list of labels
      await whenCalledTimes(secondRouteRenderFn, 3)
      renderedTrees.loading = secondRouteRenderFn.mock.calls[0][0]
      renderedTrees.labels = secondRouteRenderFn.mock.calls[2][0]
    })

    afterAll(() => beagleViews.forEach(v => v.destroy()))

    it('should do 3 renders with no warnings or errors', () => {
      expect(secondRouteRenderFn).toHaveBeenCalledTimes(3)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('should show loading', async () => {
      expect(renderedTrees.loading._beagleComponent_).toBe('custom:loading')
      expect(renderedTrees.loading.children).toBeUndefined()
    })

    it('should replace the loading by the view "labels"', () => {
      expect(Tree.findByType(renderedTrees.labels, 'custom:loading').length).toBe(0)
      expect(Tree.findById(renderedTrees.labels, 'label-list')).toBeTruthy()
    })
  })

  describe('should not navigate to labels (error case) and then, retry', () => {
    /* do the same as the previous test suit, but before clicking the button, prepare the backend
    to respond with an error */

    it.todo('should do 2 renders with no warning and 3 errors')

    it.todo('should show the error component with the errors that occurred')

    it.todo('should retry and successfully load the view labels')
  })

  describe('should filter notes by label', () => {
    let renderFn: jest.Mock
    let beagleView: BeagleView
    const renderedTrees: Record<string, IdentifiableBeagleUIElement> = {}

    /**
     * The following process applies the filter "personal" by clicking the menu item "personal"
     * and then remove it by clicking the menu item "notes".
     */
    beforeAll(async () => {
      const { render, tree, beagleView: bView } = await createRemoteViewAndWaitInitialRendering()
      renderFn = render
      beagleView = bView
      renderedTrees.original = tree

      // click "personal" to filter the notes by the label "personal"
      const { personal } = getMenuItems(renderedTrees.original)
      personal.onPress()
      /* we wait 2 renders here because the first one will alter the data source of the repeater
      (list of notes). When the repeater detects the change, it will trigger the second render to
      change its content. */
      await whenCalledTimes(render, 2)
      renderedTrees.filteredByPersonal = render.mock.calls[1][0]

      // click "notes" to remove the filter
      const { notes } = getMenuItems(renderedTrees.filteredByPersonal)
      notes.onPress()
      // we wait two more renders for the same reason as before
      await whenCalledTimes(render, 4)
      renderedTrees.unfiltered = render.mock.calls[3][0]
    })

    afterAll(() => beagleView.destroy())

    it('should do 4 renders with no warnings or errors', () => {
      expect(renderFn).toHaveBeenCalledTimes(4)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('should filter by the label "personal"', async () => {
      const allNotes: FullNote[] = renderedTrees.filteredByPersonal.context!.value.notes
      const personalNotes = allNotes.filter(
        ({ labels }) => !!labels.find(({ id }) => id === 0),
      )
      const renderedNotes = Tree.findByType(renderedTrees.filteredByPersonal, 'custom:note')

      expect(allNotes.length).toBeGreaterThan(personalNotes.length)
      expect(renderedNotes.length).toBe(personalNotes.length)
    })

    it('should remove the filter', async () => {
      const allNotes: FullNote[] = renderedTrees.unfiltered.context!.value.notes
      const renderedNotes = Tree.findByType(renderedTrees.unfiltered, 'custom:note')

      expect(renderedNotes.length).toBe(allNotes.length)
    })
  })
})
