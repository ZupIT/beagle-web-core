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
import { setupHomeActionsTest, getNoteItem } from './utils'

describe('Beagle Keep: actions: home: note list', () => {
  const { createRemoteViewAndWaitInitialRendering } = setupHomeActionsTest()

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
      expect(JSON.stringify(viewAfterChangeToTheGlobalContext))
        .toEqual(JSON.stringify(originalView))
    })

    it('should remove the note from the list', () => {
      const allNotes: FullNote[] = viewBeforeDeletingNote.context!.value.notes
      const allIds = allNotes.map(note => note.id)
      const renderedNotes = Tree.findByType(viewAfterDeletingNote, 'custom:note')
      const renderedIds = renderedNotes.map(renderedNote => renderedNote.noteId)
      expect(allIds.length - renderedIds.length).toBe(1)
      expect(allIds.filter(id => id !== removedNoteId)).toEqual(renderedIds)
    })

    it('should remove the note from the database', () => {
      expect(getNoteById(removedNoteId)).toBeUndefined()
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

  describe('should not remove note (error case)', () => {
    // do the same as the success case, but prepare the backend to respond with an error
    /* wait for 4 renders: 1: changes the dataset of the repeater; 2: the repeater notices the
    change and recalculates its children; 3: because of the error, the item is returned to the
    dataset; 4: the repeater notices the change and recalculate its children. */

    it.todo('should do 4 renders with no warnings or errors')

    /* we already tested the removal of the note and the call to the backend in the previous test
    suit (should remove note). We won't test these again */

    it.todo('should show a error feedback via the custom action "custom:feedback"')

    it.todo('should rollback the change to the list of notes by reinserting the removed item')
  })
})
