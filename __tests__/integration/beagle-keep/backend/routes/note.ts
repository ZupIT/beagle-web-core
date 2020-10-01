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

import nock from 'nock'
import { url, paths } from '../../constants'
import { getNotes, addNote, editNote, getNoteById, removeNoteById } from '../database/notes'

export const path = paths.note

let error = ''

function checkError() {
  if (error) {
    const message = error
    error = ''
    return [500, { message }]
  }
}

function list() {
  nock(url).get(path).reply(() => {
    const error = checkError()
    if (error) return error

    return [200, getNotes()]
  }).persist()
}

function get() {
  const regex = new RegExp(`^${path}/([^/]+)$`)
  nock(url).get(regex).reply(function(uri) {
    const error = checkError()
    if (error) return error

    const [_, id] = uri.match(regex)!
    const result = getNoteById(parseInt(id))
    return [200, result]
  }).persist()
}

function edit() {
  nock(url).put(path).reply(function(uri, requestBody) {
    const error = checkError()
    if (error) return error

    const note = JSON.parse(requestBody.toString())
    const result = editNote(note)
    return [200, result]
  }).persist()
}

function create() {
  nock(url).post(path).reply(function(uri, requestBody) {
    const error = checkError()
    if (error) return error

    const note = JSON.parse(requestBody.toString())
    const result = addNote(note)
    return [200, result]
  }).persist()
}

function remove() {
  const regex = new RegExp(`${path}/([^/]+)`)
  nock(url).delete(regex).reply(function(uri) {
    const error = checkError()
    if (error) return error

    const [fullMatch, id] = uri.match(regex)!
    removeNoteById(parseInt(id))
    return [200]
  }).persist()
}

/**
 * Makes the next request to the notes endpoint to fail.
 * 
 * @param message the error message 
 */
export function simulateError(message: string) {
  error = message
}

export default function setup() {
  list()
  get()
  edit()
  create()
  remove()
}
