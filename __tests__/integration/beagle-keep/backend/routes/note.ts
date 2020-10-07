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

import { createPersistentEndpoint } from '../../../../utils/nock'
import { url, paths } from '../../constants'
import { getNotes, addNote, editNote, getNoteById, removeNoteById } from '../database/notes'

export const path = paths.note
const endpoint = createPersistentEndpoint(url)

function list() {
  endpoint.get(path, getNotes)
}

function get() {
  const regex = new RegExp(`^${path}/([^/]+)$`)
  endpoint.get(regex, ({ url }) => {
    const [_, id] = url.match(regex)!
    return getNoteById(parseInt(id))!
  })
}

function edit() {
  endpoint.put(path, ({ requestBody }) => {
    const note = JSON.parse(requestBody.toString())
    return editNote(note)
  })
}

function create() {
  endpoint.post(path, ({ requestBody }) => {
    const note = JSON.parse(requestBody.toString())
    return addNote(note)
  })
}

function remove() {
  const regex = new RegExp(`${path}/([^/]+)`)
  endpoint.delete(regex, ({ url }) => {
    const [fullMatch, id] = url.match(regex)!
    removeNoteById(parseInt(id))
  })
}

/**
 * Makes the next request to the note endpoint to fail.
 * 
 * @param message the error message 
 */
export function simulateError(message: string) {
  endpoint.simulateError(message)
}

export default function setup() {
  list()
  get()
  edit()
  create()
  remove()
}
