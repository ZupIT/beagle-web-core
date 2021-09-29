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

import BeagleView from 'beagle-view'
import * as Renderer from 'beagle-view/render'
import { createBeagleServiceMock } from '../old-structure/utils/test-utils'

describe('Beagle View', () => {
  describe('general behavior', () => {
    it('should disable css on renderer', () => {
      const originalCreateRenderer = Renderer.default.create
      Renderer.default.create = jest.fn()
      const beagleService = createBeagleServiceMock({
        getConfig: () => ({
          baseUrl: '',
          components: {},
          platform: 'Test',
          disableCssTransformation: true,
        }),
      })
      BeagleView.create(beagleService)
      expect(Renderer.default.create).toHaveBeenCalledWith(
        expect.objectContaining({ disableCssTransformation: true }),
      )
      Renderer.default.create = originalCreateRenderer
    })
  })
})
