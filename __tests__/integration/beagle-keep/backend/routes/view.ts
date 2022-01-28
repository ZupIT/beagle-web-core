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

import { createPersistentEndpoint } from '../../../../utils/nock'
import { url, paths } from '../../constants'
import home from '../views/home'
import templatedHome from '../views/templated-home'
import details from '../views/details'
import labels from '../views/labels'

export const path = paths.view
const endpoint = createPersistentEndpoint(url)

const views = { home, templatedHome, details, labels }

function get(name: keyof typeof views) {
  endpoint.get(`${path}/${name}`, () => views[name])
}

/**
 * Makes the next request to the view endpoint to fail.
 *
 * @param message the error message
 */
export function simulateError(message: string) {
  endpoint.simulateError(message)
}

export default function setup() {
  get('home')
  get('templatedHome')
  get('details')
  get('labels')
}
