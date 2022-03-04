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

import Tree from 'beagle-tree'
import { BeagleUIElement, IdentifiableBeagleUIElement } from 'beagle-tree/types'
import setup from '../../../backend/routes'
import { getNoteById } from '../../../backend/database/notes'
import { RenderingResult, renderDetailsView } from '../../utils'

const selectedNote = 1

/**
 * This page is very different from home and labels, so we'll test every lifecycle again.
 * Here we test the "view/edit note" mode of the view "details".
 */
describe('Beagle Keep: render details (edit note)', () => {
  let createNoteFirstRender: IdentifiableBeagleUIElement
  let editNoteResult: RenderingResult
  setup()
  
  beforeAll(async () => {
    createNoteFirstRender = (await renderDetailsView()).render[0]
    editNoteResult = await renderDetailsView(selectedNote)
  })

  /**
   * Three renders are expected. The first is a full render and the others are partial renders,
   * since they are triggered by setContext actions.
   * - first: the view details, with an empty form and a loading overlay.
   * - second: after the first render, the root container will run its onInit event. Since we have a
   * note in the global context, it will start loading it from the server. Once the request
   * succeeds, it will trigger a setContext, which will cause a new render, filling every field in
   * the form with the contents of the note.
   * - third: another setContext is triggered once the request finishes, it removes the loading
   * overlay, causing a new render. This is something we can, maybe, come up with a better solution.
   * Could we, somehow, combine the second and third render into a single one?
   */
  it('should do one full render and two partial renders with no errors or warnings', () => {
    expect(editNoteResult.beforeStart.length).toBe(1)
    expect(editNoteResult.beforeViewSnapshot.length).toBe(1)
    expect(editNoteResult.afterViewSnapshot.length).toBe(3)
    expect(editNoteResult.beforeRender.length).toBe(3)
    expect(editNoteResult.render.length).toBe(3)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  /**
   * The first render of details on view/edit mode is the same as the first render on create mode,
   * except for the ids. Since we already thoroughly tested this render in the test suit for the
   * creation mode, here we'll just check if the final tree of the first render of details:edit is
   * the same as the final tree of the first render of details:create.
   */
  it('first render of details:edit should be the same as details:create', () => {
    const editNoteTreeWithoutIds: BeagleUIElement = Tree.clone(editNoteResult.render[0])
    Tree.forEach(editNoteTreeWithoutIds, component => delete component.id)

    const createNoteTreeWithoutIds: BeagleUIElement = Tree.clone(createNoteFirstRender)
    Tree.forEach(createNoteTreeWithoutIds, component => delete component.id)

    expect(JSON.stringify(editNoteTreeWithoutIds)).toEqual(JSON.stringify(createNoteTreeWithoutIds))
  })

  /**
   * The difference from the second render to the first are:
   * - The context have values for the form field;
   * - The form fields themselves have values;
   * - The form has no errors, since every required field has a value.
   */
  describe('second render of labels (partial). Fills the form.', () => {
    function shouldHaveFormData(details: IdentifiableBeagleUIElement) {
      const note = getNoteById(selectedNote)!
      const titleField = Tree.findById(details, 'form:title')!
      const textField = Tree.findById(details, 'form:text')!
      expect(titleField.value).toBe(note.title)
      expect(textField.value).toBe(note.text)
      expect(titleField.error).toBeFalsy()
      expect(textField.error).toBeFalsy()
    }

    function shouldBeTheSameAsPreviousExcludingFormData(
      current: IdentifiableBeagleUIElement,
      previous: IdentifiableBeagleUIElement,
    ) {
      const currentWithoutFormData = Tree.clone(current)
      const oldContextData = previous.context!.value.data
      const newForm = Tree.findByType(currentWithoutFormData, 'beagle:simpleForm')[0]
      const oldForm = Tree.findByType(previous, 'beagle:simpleForm')[0]
      currentWithoutFormData.context!.value.data = oldContextData
      newForm.children = oldForm.children
      // we need to use takeSnapshot here so the functions in the trees can be considered the same
      expect(JSON.stringify(currentWithoutFormData)).toEqual(JSON.stringify(previous))
    }

    /**
     * At this time, the only difference is the context, where the values for the form fields are
     * not empty anymore and contain the data for the note.
     */
    it('afterViewSnapshot: should have context values', () => {
      const note = getNoteById(selectedNote)!
      const details = editNoteResult.afterViewSnapshot[1]
      const newContext = details.context!
      expect(newContext.value.data).toEqual({
        id: note.id,
        title: note.title,
        text: note.text,
        labels: note.labels,
      })
    })

    it(
      'afterViewSnapshot: with the exception of the context, should have the same tree as the previous afterViewSnapshot',
      () => {
        const details = Tree.clone(editNoteResult.afterViewSnapshot[1])
        const oldContextData = editNoteResult.afterViewSnapshot[0].context!.value.data
        details.context!.value.data = oldContextData
        expect(details).toEqual(editNoteResult.afterViewSnapshot[0])
      }
    )

    /**
     * In comparison to the first beforeRender, there are two differences:
     * - the context value, as seen in the previous lifecycle;
     * - the form fields, which now have values and don't have errors.
     */
    it('beforeRender: should have the note data in the form fields', () => {
      const details = editNoteResult.beforeRender[1]
      shouldHaveFormData(details)
    })

    it(
      'beforeRender: with the exception of the context and the form, should be the same as the beforeRender of the first render',
      () => shouldBeTheSameAsPreviousExcludingFormData(
        editNoteResult.beforeRender[1],
        editNoteResult.beforeRender[0],
      )
    )

    /**
     * Same differences to the last render as the previous lifecycle (beforeRender)
     */
    it('render: should have the note data in the form fields', () => {
      const details = editNoteResult.render[1]
      shouldHaveFormData(details)
    })

    it(
      'render: with the exception of the context and the form, should be the same as the first render',
      () => shouldBeTheSameAsPreviousExcludingFormData(
        editNoteResult.render[1],
        editNoteResult.render[0],
      )
    )
  })

  /**
   * The only difference from the third render to the second is that "isVisible" in the component
   * "custom:loadingOverlay" will be false instead of true.
   * 
   * Since we tested hiding the loading overlay already in the details.create test. Here we'll
   * just check if the final render is correct.
   */
  describe('third render of details (partial). Hides the loading.', () => {
    it('loading overlay should be invisible', () => {
      const details = editNoteResult.render[2]
      const loadingOverlay = Tree.findByType(details, 'custom:loadingOverlay')[0]
      expect(loadingOverlay.isVisible).toBe(false)
    })

    it(
      'with the exception of the visibility of the loading overlay, the rest of the tree should be the same as the previous render',
      () => {
        const details = Tree.clone(editNoteResult.render[2])
        const loadingOverlay = Tree.findByType(details, 'custom:loadingOverlay')[0]
        details.context!.value.isLoading = true
        loadingOverlay.isVisible = true
        expect(JSON.stringify(details)).toEqual(JSON.stringify(editNoteResult.render[1]))
      },
    )
  })
})
