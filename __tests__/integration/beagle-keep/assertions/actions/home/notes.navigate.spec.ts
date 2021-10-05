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
import { whenCalledTimes } from '../../../../../utils/function'
import { FullNote, getNoteById } from '../../../backend/database/notes'
import { whenNextNavigation } from '../../utils'
import { setupHomeActionsTest, getNoteItem } from './utils'

describe('Beagle Keep: actions: home: note list', () => {
  const { createRemoteViewAndWaitInitialRendering } = setupHomeActionsTest()

  describe('should select a note and navigate to its details', () => {
    let firstRouteRenderFn: jest.Mock
    let secondRouteRenderFn: jest.Mock
    let beagleViews: BeagleView[] = []
    let selectedNote: FullNote
    const renderedTrees: Record<string, IdentifiableBeagleUIElement> = {}

    beforeAll(async () => {
      const {
        render,
        tree,
        beagleView: bView,
        widgetRef,
      } = await createRemoteViewAndWaitInitialRendering()
      firstRouteRenderFn = render
      beagleViews.push(bView)
      const noteItem = getNoteItem(tree)
      const nextNavigation = whenNextNavigation(bView.getNavigator()!)
      noteItem.onSelect()
      selectedNote = getNoteById(noteItem.noteId)!
      // waits for the next navigation to complete
      await nextNavigation
      // gets the widget corresponding to the new route
      const newWidget = widgetRef.current
      beagleViews.push(newWidget.view)
      secondRouteRenderFn = newWidget.render
      /* 4 renders: first: navigation starts and replaces the current view by a loading component;
      second: view "details" with an empty form and a loading overlay; third: the form receives the
      details of the note as the values for its fields; fourth: the loading overlay is removed. */
      await whenCalledTimes(secondRouteRenderFn, 4)
      renderedTrees.loading = secondRouteRenderFn.mock.calls[0][0]
      renderedTrees.details = secondRouteRenderFn.mock.calls[3][0]
    })

    afterAll(() => beagleViews.forEach(v => v.destroy()))

    /* Expect 1 render corresponding to the modification in the global context. Even if the global
    context doesn't affect the current tree, it gets re-rendered, should we improve this? */
    it('should do 1 render in the first route with no warnings or errors', () => {
      expect(firstRouteRenderFn).toHaveBeenCalledTimes(1)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('should do 4 renders in the second route with no warnings or errors', () => {
      expect(secondRouteRenderFn).toHaveBeenCalledTimes(4)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('should show loading', async () => {
      expect(renderedTrees.loading._beagleComponent_).toBe('custom:loading')
      expect(renderedTrees.loading.children).toBeUndefined()
    })

    it('should remove the loading and display the details of the selected note', () => {
      expect(Tree.findByType(renderedTrees.details, 'custom:loading').length).toBe(0)
      const titleField = Tree.findById(renderedTrees.details, 'form:title')
      const textField = Tree.findById(renderedTrees.details, 'form:text')
      expect(titleField).toBeTruthy()
      expect(textField).toBeTruthy()
      expect(titleField!.value).toBe(selectedNote.title)
      expect(textField!.value).toBe(selectedNote.text)
    })
  })

  describe('should click the button "create note" and navigate to details in create mode', () => {
    let firstRouteRenderFn: jest.Mock
    let secondRouteRenderFn: jest.Mock
    let beagleViews: BeagleView[] = []
    const renderedTrees: Record<string, IdentifiableBeagleUIElement> = {}

    beforeAll(async () => {
      const {
        render,
        tree,
        beagleView: bView,
        widgetRef,
      } = await createRemoteViewAndWaitInitialRendering()
      firstRouteRenderFn = render
      beagleViews.push(bView)
      /* we set a value to the selected note to test if when the button to create a note is
      pressed, it correctly sets the selected note back to null/undefined. This wil generate a
      re-render. */
      bView.getBeagleService().globalContext.set(1, 'selectedNote')
      const createNoteButton = Tree.findById(tree, 'create-note')!
      const nextNavigation = whenNextNavigation(bView.getNavigator()!)
      createNoteButton.onPress()
      // waits for the next navigation to complete
      await nextNavigation
      // gets the widget corresponding to the new route
      const newWidget = widgetRef.current
      beagleViews.push(newWidget.view)
      secondRouteRenderFn = newWidget.render
      /* 3 renders: first: navigation starts and replaces the current view by a loading component;
      second: view "details" with an empty form and a loading overlay; third: the loading overlay is
      removed. */
      await whenCalledTimes(secondRouteRenderFn, 3)
      renderedTrees.original = tree
      renderedTrees.afterFirstChangeToTheGlobalContext = firstRouteRenderFn.mock.calls[0][0]
      renderedTrees.afterSecondChangeToTheGlobalContext = firstRouteRenderFn.mock.calls[1][0]
      renderedTrees.loading = secondRouteRenderFn.mock.calls[0][0]
      renderedTrees.details = secondRouteRenderFn.mock.calls[2][0]
    })

    afterAll(() => beagleViews.forEach(v => v.destroy()))

    /* since the global context has been modified twice, the view will get re-rendered twice, even
    if nothing uses the global context in this view. Should we improve this? */
    it('should do 2 renders in the first route with no warnings or errors', () => {
      expect(firstRouteRenderFn).toHaveBeenCalledTimes(2)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('should do 3 renders in the second route with no warnings or errors', () => {
      expect(secondRouteRenderFn).toHaveBeenCalledTimes(3)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('changes to the global context should not alter the view', () => {
      expect(JSON.stringify(renderedTrees.afterFirstChangeToTheGlobalContext))
        .toEqual(JSON.stringify(renderedTrees.original))
      expect(JSON.stringify(renderedTrees.afterSecondChangeToTheGlobalContext))
        .toEqual(JSON.stringify(renderedTrees.afterFirstChangeToTheGlobalContext))
    })

    it('should show loading', async () => {
      expect(renderedTrees.loading._beagleComponent_).toBe('custom:loading')
      expect(renderedTrees.loading.children).toBeUndefined()
    })

    it('should remove the loading and display the create note view', () => {
      expect(Tree.findByType(renderedTrees.details, 'custom:loading').length).toBe(0)
      const titleField = Tree.findById(renderedTrees.details, 'form:title')
      const textField = Tree.findById(renderedTrees.details, 'form:text')
      expect(titleField).toBeTruthy()
      expect(textField).toBeTruthy()
      expect(titleField!.value).toBe('')
      expect(textField!.value).toBe('')
    })
  })
})
