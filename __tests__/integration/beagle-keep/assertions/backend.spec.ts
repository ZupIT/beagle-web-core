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

import { last, dropRight } from 'lodash'
import setup from '../backend/routes'
import { simulateError as simulateLabelError } from '../backend/routes/label'
import { simulateError as simulateNoteError } from '../backend/routes/note'
import { simulateError as simulateViewError } from '../backend/routes/view'
import { getLabels, resetLabels } from '../backend/database/labels'
import { getNotes, getNoteById, resetNotes } from '../backend/database/notes'
import { url, paths } from '../constants'

async function testErrorResponse(
  type: 'label' | 'note' | 'view',
  additionalPath = '',
  request?: any,
) {
  const simulateError = {
    label: simulateLabelError,
    note: simulateNoteError,
    view: simulateViewError,
  }

  simulateError[type]('test')
  const response = await fetch(`${url}${paths[type]}${additionalPath}`, request)
  const result = await response.json()
  expect(response.status).toBe(500)
  expect(result).toEqual({ message: 'test' })
}

/**
 * Before actually testing beagle, we should guarantee the backend we wrote actually works.
 */
describe('Beagle Keep: backend', () => {
  setup()

  describe('label', () => {
    afterEach(resetLabels)

    it('should get labels', async () => {
      const response = await fetch(`${url}${paths.label}`)
      const result = await response.json()
      expect(result).toEqual(getLabels())
    })

    it('should not get labels', () => testErrorResponse('label'))

    it('should edit label', async () => {
      const label = { ...getLabels()[0] }
      label.name = 'Edited'
      const request = { method: 'put', body: JSON.stringify(label) }
      const response = await fetch(`${url}${paths.label}`, request)
      const result = await response.json()
      expect(result).toEqual(label)
      const expectedLabels = getLabels()
      expectedLabels[0] = label
      expect(getLabels()).toEqual(expectedLabels)
    })

    it('should not edit label', () => testErrorResponse('label', '', { method: 'put' }))

    it('should create label', async () => {
      const originalLabels = [...getLabels()]
      const label = { name: 'new', id: '', color: '#000' }
      const request = { method: 'post', body: JSON.stringify(label) }
      const response = await fetch(`${url}${paths.label}`, request)
      const result = await response.json()
      const expectedResult = { ...label, id: originalLabels.length }
      expect(result).toEqual(expectedResult)
      expect(getLabels()).toEqual([...originalLabels, expectedResult])
    })

    it('should not create label', () => testErrorResponse('label', '', { method: 'post' }))

    it('should remove label', async () => {
      const originalLabels = [...getLabels()]
      const request = { method: 'delete' }
      await fetch(`${url}${paths.label}/${last(originalLabels)!.id}`, request)
      expect(getLabels()).toEqual(dropRight(originalLabels))
    })

    it('should not remove label', () => testErrorResponse('label', '/0', { method: 'delete' }))
  })

  describe('note', () => {
    afterEach(resetNotes)

    it('should get notes', async () => {
      const response = await fetch(`${url}${paths.note}`)
      const result = await response.json()
      expect(result).toEqual(getNotes())
    })

    it('should not get notes', () => testErrorResponse('note'))

    it('should get note by id', async () => {
      const response = await fetch(`${url}${paths.note}/0`)
      const result = await response.json()
      expect(result).toEqual({ ...getNotes()[0], text: expect.any(String) })
    })

    it('should not get note by id', () => testErrorResponse('note', '/0'))

    it('should edit note', async () => {
      const note = { ...getNoteById(0)! }
      note.title = 'Edited'
      const request = { method: 'put', body: JSON.stringify(note) }
      const response = await fetch(`${url}${paths.note}`, request)
      const result = await response.json()
      expect(result).toEqual(note)
      expect(getNoteById(0)).toEqual(note)
    })

    it('should not edit note', () => testErrorResponse('note', '', { method: 'put' }))

    it('should create note', async () => {
      const originalNotes = [...getNotes()]
      const note = { title: 'new', id: '', text: 'blah', labels: [getLabels()[0]] }
      const request = { method: 'post', body: JSON.stringify(note) }
      const response = await fetch(`${url}${paths.note}`, request)
      const result = await response.json()
      const expectedResult = { ...note, id: originalNotes.length }
      expect(result).toEqual(expectedResult)
      expect(getNotes()).toEqual([...originalNotes, expectedResult])
    })

    it('should not create note', () => testErrorResponse('note', '', { method: 'post' }))

    it('should remove note', async () => {
      const originalNotes = [...getNotes()]
      const request = { method: 'delete' }
      await fetch(`${url}${paths.note}/${last(originalNotes)!.id}`, request)
      expect(getNotes()).toEqual(dropRight(originalNotes))
    })

    it('should not remove note', () => testErrorResponse('note', '/0', { method: 'delete' }))
  })

  describe('view', () => {
    async function shouldGetView(viewPath: string) {
      const response = await fetch(`${url}${paths.view}${viewPath}`)
      const view = await response.json()
      expect(view._beagleComponent_).toBeDefined()
    }

    it('should get home', () => shouldGetView('/home'))

    it('should not get home', () => testErrorResponse('view', '/home'))

    it('should get templated home', () => shouldGetView('/templatedHome'))

    it('should not get templated home', () => testErrorResponse('view', '/templatedHome'))

    it('should get details', () => shouldGetView('/details'))

    it('should not get details', () => testErrorResponse('view', '/details'))

    it('should get labels', () => shouldGetView('/labels'))

    it('should not get labels', () => testErrorResponse('view', '/labels'))
  })
})
