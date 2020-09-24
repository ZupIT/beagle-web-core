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

import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import setup from '../../../backend/routes'
import createService from '../../../frontend/service'
import { enableLogging, disableLogging } from '../../../utils/log'
import { whenCalledTimes } from '../../../utils/function'

export function setupHomeActionsTest() {
  enableLogging()
  setup()
  const { createBeagleRemoteView } = createService()

  afterAll(disableLogging)

  /**
   * These tests must start after the initial rendering. As seen in the rendering tests, the home is
   * rendered three times before it becomes stable. This function will be called before every test
   * suit. Here, besides creating the beagle remote view, we wait for the first three renders to
   * finish and clear the mocks.
   */
  async function createRemoteViewAndWaitInitialRendering() {
    const { render, view } = await createBeagleRemoteView({ route: '/home' })
    await whenCalledTimes(render, 3)
    const tree = render.mock.calls[2][0]
    render.mockClear()
    globalMocks.log.mockClear()
    return {
      tree: tree as IdentifiableBeagleUIElement,
      beagleView: view,
      render,
    }
  }

  return { createRemoteViewAndWaitInitialRendering }
}
