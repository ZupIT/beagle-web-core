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

import { BeagleUIElement } from 'beagle-tree/types'
import PreFetchService from 'service/network/pre-fetch'
import { ViewClient } from 'service/network/view-client/types'
import { createViewClientMock } from '../../old-structure/utils/test-utils'

describe('Pre fetch service', () => {
  const successUrl = '/success'
  const errorUrl = '/error'
  const error = new Error()
  const view: BeagleUIElement = { _beagleComponent_: 'beagle:text', text: 'Hello World!' }

  function createViewClient(): ViewClient {
    return createViewClientMock({
      load: jest.fn(async ({ url, onChangeTree }) => {
        if (url === successUrl) onChangeTree(view)
        else throw [error]
      })
    })
  }

  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  it('should pre-fetch view', async () => {
    const vc = createViewClient()
    const preFetchService = PreFetchService.create(vc)
    await preFetchService.fetch(successUrl)
    expect(vc.load).toHaveBeenCalledWith(expect.objectContaining({
      url: successUrl,
      onChangeTree: expect.any(Function),
    }))
  })

  it('should log warning when pre-fetch fails', async () => {
    const error = new Error()
    const vc = createViewClient()
    const preFetchService = PreFetchService.create(vc)
    await preFetchService.fetch(errorUrl)
    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String), error)
  })

  it('should recover pre-fetched view', async () => {
    const vc = createViewClient()
    const preFetchService = PreFetchService.create(vc)
    await preFetchService.fetch(successUrl)
    expect(preFetchService.recover(successUrl)).toEqual(view)
  })

  it('should get null when trying to recover view that was not pre-fetched', () => {
    const vc = createViewClient()
    const preFetchService = PreFetchService.create(vc)
    expect(preFetchService.recover('/my-view')).toBe(null)
  })

  it('should get null when trying to recover view that failed to pre-fetch', async () => {
    const vc = createViewClient()
    const preFetchService = PreFetchService.create(vc)
    await preFetchService.fetch(errorUrl)
    expect(preFetchService.recover(errorUrl)).toBe(null)
  })
})
