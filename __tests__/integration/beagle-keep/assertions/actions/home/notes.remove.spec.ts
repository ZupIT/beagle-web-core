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
import { whenCalledTimes } from '../../../../../utils/function'
import { FullNote, getNoteById, resetNotes } from '../../../backend/database/notes'
import { simulateError } from '../../../backend/routes/note'
import { setupHomeActionsTest, getNoteItem } from './utils'

describe('Beagle Keep: actions: home: note list', () => {
  const { createRemoteViewAndWaitInitialRendering } = setupHomeActionsTest()

  async function renderHomeAndDeleteNote(numberOfRenders: number) {
    const { render, tree, beagleView } = await createRemoteViewAndWaitInitialRendering()
    const noteItem = getNoteItem(tree, 2)
    const removedNoteId = noteItem.noteId
    noteItem.onRemove()
    await whenCalledTimes(render, numberOfRenders)
    const viewAfterHidingNote = render.mock.calls[0][0]
    const viewAfterResponse = render.mock.calls[1][0]
    const viewAfterRemovingNote = render.mock.calls.length >= 3
      ? render.mock.calls[2][0]
      : undefined

    return {
      render,
      removedNoteId,
      beagleView,
      viewBeforeHidingNote: tree,
      viewAfterHidingNote,
      viewAfterResponse,
      viewAfterRemovingNote,
    }
  }

  type DeleteResult = (
    ReturnType<typeof renderHomeAndDeleteNote> extends Promise<infer T> ? T : never
  )

  function shouldHideNote(result: DeleteResult) {
    const allNotes = Tree.findByType(result.viewAfterHidingNote, 'custom:note')
    const hiddenNotes = allNotes.filter(note => note.style!.display === 'none')
    expect(hiddenNotes.length).toBe(1)
    expect(hiddenNotes[0].noteId).toBe(result.removedNoteId)
  }

  async function shouldShowFeedback(result: DeleteResult, action: any) {
    const config = result.beagleView.getBeagleService().getConfig()
    const actionHandler = config.customActions!['custom:feedback'] as jest.Mock
    await whenCalledTimes(actionHandler, 1)
    expect(actionHandler).toHaveBeenCalledTimes(1)
    expect(actionHandler).toHaveBeenCalledWith(expect.objectContaining({ action }))
    actionHandler.mockClear()
  }

  describe('should remove note', () => {
    let result: DeleteResult

    beforeAll(async () => {
      /* three renders: first: the note is hidden from the list. Second: after the backend responds
      with success, the note is removed from the data source of the repeater via the setContext
      action. Third: the repeater will notice the change and call a re-render to update its
      children. */
      result = await renderHomeAndDeleteNote(3)
    })

    afterAll(() => result.beagleView.destroy())

    it('should do 3 renders with no warnings or errors', () => {
      expect(result.render).toHaveBeenCalledTimes(3)
      expect(globalMocks.log).not.toHaveBeenCalled()
    })

    it('should hide the note in the list', () => shouldHideNote(result))

    it('should remove the note from the database', () => {
      expect(getNoteById(result.removedNoteId)).toBeUndefined()
    })

    it('should remove the note from the list', () => {
      const allNotes: FullNote[] = result.viewBeforeHidingNote.context!.value.notes
      const allIds = allNotes.map(note => note.id)
      const renderedNotes = Tree.findByType(result.viewAfterRemovingNote!, 'custom:note')
      const renderedIds = renderedNotes.map(renderedNote => renderedNote.noteId)

      expect(allIds.length - renderedIds.length).toBe(1)
      expect(allIds.filter(id => id !== result.removedNoteId)).toEqual(renderedIds)
    })

    it('should show a success feedback via the custom action "custom:feedback"', async () => {
      await shouldShowFeedback(result, {
        _beagleAction_: 'custom:feedback',
        type: 'success',
        text: 'Note removed successfully!',
      })
    })
  })

  describe('should not remove note (error case)', () => {
    let result: DeleteResult

    beforeAll(async () => {
      globalMocks.log.mockClear()
      resetNotes()
      simulateError('simulated error')
      /* two renders: first: the note is hidden from the list. Second: as soon as teh request fails,
      the note is made visible again. */
      result = await renderHomeAndDeleteNote(2)
    })

    afterAll(() => result.beagleView.destroy())

    it('should do 2 renders with no warnings and 1 error', () => {
      expect(result.render).toHaveBeenCalledTimes(2)
      expect(globalMocks.log).toHaveBeenCalledTimes(1)
      expect(globalMocks.log).toHaveBeenCalledWith('error', new Error('Beagle: network error 500 while trying to access DELETE https://keep.beagle.io/note/2.'))
    })

    it('should hide the note in the list', () => shouldHideNote(result))

    it('should not remove the note from the database', () => {
      expect(getNoteById(result.removedNoteId)).toBeDefined()
    })

    it('should show an error feedback via the custom action "custom:feedback"', async () => {
      await shouldShowFeedback(result, {
        _beagleAction_: 'custom:feedback',
        type: 'error',
        text: 'Connection error. Couldn\'t remove the note. 500: simulated error',
      })
    })

    it('should rollback the changes, making the note visible again', () => {
      expect(JSON.stringify(result.viewAfterResponse))
        .toEqual(JSON.stringify(result.viewBeforeHidingNote))
    })
  })
})
