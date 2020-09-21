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
import { url } from '../../constants'
import { getLabels, addLabel, editLabel, removeLabelById } from '../database/labels'

export const path = '/label'

function list() {
  nock(url).get(path).reply(200, getLabels()).persist()
}

function edit() {
  nock(url).put(path).reply(function(uri, requestBody) {
    const label = JSON.parse(requestBody.toString())
    const result = editLabel(label)
    return [200, result]
  }).persist()
}

function create() {
  nock(url).post(path).reply(function(uri, requestBody) {
    const label = JSON.parse(requestBody.toString())
    const result = addLabel(label)
    return [200, result]
  }).persist()
}

function remove() {
  const regex = new RegExp(`${path}/([^/]+)`)
  nock(url).delete(regex).reply(function(uri) {
    const [fullMatch, id] = uri.match(regex)!
    removeLabelById(parseInt(id))
    return [200]
  }).persist()
}

export default function setup() {
  list()
  edit()
  create()
  remove()
}
