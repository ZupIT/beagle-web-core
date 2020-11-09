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
import PreFetcher from 'service/network/pre-fetcher'
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
    const preFetcher = PreFetcher.create(vc)
    await preFetcher.fetch(successUrl)
    expect(vc.load).toHaveBeenCalledWith(expect.objectContaining({
      url: successUrl,
      onChangeTree: expect.any(Function),
    }))
  })

  it('should reject promise when pre-fetch fails', () => {
    const vc = createViewClient()
    const preFetcher = PreFetcher.create(vc)
    expect(preFetcher.fetch(errorUrl)).rejects.toEqual(expect.any(Error))
  })

  it('should recover pre-fetched view', async () => {
    const vc = createViewClient()
    const preFetcher = PreFetcher.create(vc)
    await preFetcher.fetch(successUrl)
    const preFetchedView = await preFetcher.recover(successUrl)
    expect(preFetchedView).toEqual(view)
  })

  it('should reject promise when trying to recover view that has not pre-fetched', () => {
    const vc = createViewClient()
    const preFetcher = PreFetcher.create(vc)
    expect(preFetcher.recover('/my-view')).rejects.toEqual(expect.any(Error))
  })

  it('should reject promise when trying to recover view that failed to pre-fetch', async () => {
    const vc = createViewClient()
    const preFetcher = PreFetcher.create(vc)
    let fetchError: Error | null = null
    let recoverError: Error | null = null

    try {
      await preFetcher.fetch(errorUrl)
    } catch (e) {
      fetchError = e
    }

    try {
      await preFetcher.recover(errorUrl)
    } catch (e) {
      recoverError = e
    }

    expect(recoverError).not.toBe(null)
    expect(recoverError).toBe(fetchError)
  })

  it('should wait corresponding fetch to finish while recovering a view', async () => {
    const vc = createViewClientMock({
      load: jest.fn(({ onChangeTree }) => {
        return new Promise(resolve => setTimeout(() => {
          onChangeTree(view)
          resolve()
        }, 50))
      })
    })

    const preFetcher = PreFetcher.create(vc)
    preFetcher.fetch('/my-view')
    const recoveredView = await preFetcher.recover('/my-view')
    expect(recoveredView).toBe(view)
  })

  it('should not use previous pre-fetch result when pre-fetch fails', async () => {
    const vc = createViewClient()
    const preFetcher = PreFetcher.create(vc)
    let view: BeagleUIElement | null = null 

    // successful pre-fetch
    await preFetcher.fetch(successUrl)

    // unsuccessful pre-fetch
    vc.load = () => Promise.reject(error)
    try {
      await preFetcher.fetch(successUrl)
    } catch {}

    // should not use the result of the previous successful pre-fetch
    try {
      view = await preFetcher.recover(successUrl)
    } catch {}

    expect(view).toBe(null)
  })
})
