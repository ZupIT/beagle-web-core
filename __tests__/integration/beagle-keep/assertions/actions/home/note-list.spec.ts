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
import { takeSnapshot } from '../../../../../utils/snapshot'
import { FullNote, getNoteById } from '../../../backend/database/notes'
import { url, paths } from '../../../constants'
import { setupHomeActionsTest } from './utils'

describe('Beagle Keep: actions: home: note list', () => {
  const { createRemoteViewAndWaitInitialRendering } = setupHomeActionsTest()

  function getNoteItem(tree: IdentifiableBeagleUIElement, index = 0) {
    return Tree.findByType(tree, 'custom:note')[index]
  }

  describe('should select a note and navigate to its details', () => {
    let renderFn: jest.Mock
    let beagleView: BeagleView
    let selectedNote: FullNote
    const renderedTrees: Record<string, IdentifiableBeagleUIElement> = {}

    beforeAll(async () => {
      const { render, tree, beagleView: bView } = await createRemoteViewAndWaitInitialRendering()
      renderFn = render
      beagleView = bView
      const noteItem = getNoteItem(tree)
      noteItem.onSelect()
      selectedNote = getNoteById(noteItem.noteId)!
      /* 5 renders: first: since the global context has been modified, the view will get
      re-rendered, even if nothing uses the global context in this view (should we improve this?);
      second: navigation starts and replaces the current view by a loading component; third: view
      "details" with an empty form and a loading overlay; fourth: the form receives the details of
      the note as the values for its fields; fifth: the loading overlay is removed. */
      await whenCalledTimes(render, 5)
      renderedTrees.loading = render.mock.calls[1][0]
      renderedTrees.details = render.mock.calls[4][0]
    })

    afterAll(() => beagleView.destroy())

    it('should do 5 renders with no warnings or errors', () => {
      expect(renderFn).toHaveBeenCalledTimes(5)
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

  describe('should remove note', () => {
    let renderFn: jest.Mock
    let beagleView: BeagleView
    let removedNoteId: number
    let originalView: IdentifiableBeagleUIElement
    let viewAfterChangeToTheGlobalContext: IdentifiableBeagleUIElement
    let viewBeforeDeletingNote: IdentifiableBeagleUIElement
    let viewAfterDeletingNote: IdentifiableBeagleUIElement

    beforeAll(async () => {
      const { render, tree, beagleView: bView } = await createRemoteViewAndWaitInitialRendering()
      renderFn = render
      beagleView = bView
      const noteItem = getNoteItem(tree, 2)
      globalMocks.fetch.mockClear()
      noteItem.onRemove()
      removedNoteId = noteItem.noteId
      /* two renders: first: the note is removed from the data source of the repeater via the
      setContext action; second: the repeater will notice the change and call a re-render to update
      its children. */
      await whenCalledTimes(render, 2)
      viewBeforeDeletingNote = tree
      viewAfterDeletingNote = render.mock.calls[1][0]
    })

    afterAll(() => beagleView.destroy())

    it('should do 2 renders with no warnings or errors', () => {
      expect(renderFn).toHaveBeenCalledTimes(2)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('changes to the global context should not alter the view', () => {
      expect(viewAfterChangeToTheGlobalContext).toEqual(originalView)
    })

    it('should remove the note from the list', () => {
      const allNotes: FullNote[] = viewBeforeDeletingNote.context!.value.notes
      const allIds = allNotes.map(note => note.id)
      const renderedNotes = Tree.findByType(viewAfterDeletingNote, 'custom:note')
      const renderedIds = renderedNotes.map(renderedNote => renderedNote.noteId)
      expect(allIds.length - renderedIds.length).toBe(1)
      expect(allIds.filter(id => id !== removedNoteId)).toEqual(renderedIds)
    })

    it('should have called the backend service to remove the note', () => {
      expect(globalMocks.fetch).toHaveBeenCalledWith(
        `${url}${paths.note}/${removedNoteId}`,
        expect.objectContaining({ method: expect.stringMatching(/delete/i) }),
      )
    })

    it('should show a success feedback via the custom action "custom:feedback"', async () => {
      const config = beagleView.getBeagleService().getConfig()
      const actionHandler = config.customActions!['custom:feedback'] as jest.Mock
      await whenCalledTimes(actionHandler, 1)
      expect(actionHandler).toHaveBeenCalledTimes(1)
      expect(actionHandler).toHaveBeenCalledWith(expect.objectContaining({
        action: {
          _beagleAction_: 'custom:feedback',
          type: 'success',
          text: 'Note removed successfully!',
        }
      }))
    })
  })

  describe('should click the button "create note" and navigate to details in create mode', () => {
    let renderFn: jest.Mock
    let beagleView: BeagleView
    const renderedTrees: Record<string, IdentifiableBeagleUIElement> = {}

    beforeAll(async () => {
      const { render, tree, beagleView: bView } = await createRemoteViewAndWaitInitialRendering()
      renderFn = render
      beagleView = bView
      /* we set a value to the selected note to test if when the button to create a note is
      pressed, it correctly sets the selected note back to null/undefined. This wil generate a
      re-render. */
      beagleView.getBeagleService().globalContext.set(1, 'selectedNote')
      const createNoteButton = Tree.findById(tree, 'create-note')!
      createNoteButton.onPress()
      /* 5 renders: first and second: since the global context has been modified twice, the view
      will get re-rendered twice, even if nothing uses the global context in this view (should we
      improve this?); third: navigation starts and replaces the current view by a loading component;
      fourth: view "details" with an empty form and a loading overlay; fifth: the loading overlay is
      removed. */
      await whenCalledTimes(render, 5)
      renderedTrees.original = tree
      renderedTrees.afterFirstChangeToTheGlobalContext = render.mock.calls[0][0]
      renderedTrees.afterSecondChangeToTheGlobalContext = render.mock.calls[1][0]
      renderedTrees.loading = render.mock.calls[2][0]
      renderedTrees.details = render.mock.calls[4][0]
    })

    afterAll(() => beagleView.destroy())

    it('should do 5 renders with no warnings or errors', () => {
      expect(renderFn).toHaveBeenCalledTimes(5)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('changes to the global context should not alter the view', () => {
      expect(takeSnapshot(renderedTrees.afterFirstChangeToTheGlobalContext))
        .toEqual(takeSnapshot(renderedTrees.original))
      expect(takeSnapshot(renderedTrees.afterSecondChangeToTheGlobalContext))
        .toEqual(takeSnapshot(renderedTrees.afterFirstChangeToTheGlobalContext))
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
