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
import { getLabels, addLabel, editLabel, removeLabelById } from '../database/labels'

const path = paths.label

const endpoint = createPersistentEndpoint(url)

function list() {
  endpoint.get(path, getLabels)
}

function edit() {
  endpoint.put(path, ({ requestBody }) => {
    const label = JSON.parse(requestBody.toString())
    return editLabel(label)
  })
}

function create() {
  endpoint.post(path, ({ requestBody }) => {
    const label = JSON.parse(requestBody.toString())
    return addLabel(label)
  })
}

function remove() {
  const regex = new RegExp(`${path}/([^/]+)`)
  endpoint.delete(regex, ({ url }) => {
    const [fullMatch, id] = url.match(regex)!
    removeLabelById(parseInt(id))
  })
}

/**
 * Makes the next request to the label endpoint to fail.
 *
 * @param message the error message
 */
export function simulateError(message: string) {
  endpoint.simulateError(message)
}

export default function setup() {
  list()
  edit()
  create()
  remove()
}
