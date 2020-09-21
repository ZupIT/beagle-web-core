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
import home from '../views/home'
import details from '../views/details'
import labels from '../views/labels'

export const path = '/view'

const views = { home, details, labels }

function get(name: keyof typeof views) {
  nock(url).get(`${path}/${name}`).reply(200, views[name]).persist()
}

export default function setup() {
  get('home')
  get('details')
  get('labels')
}
