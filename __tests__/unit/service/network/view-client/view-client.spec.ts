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

import { RemoteView } from 'beagle-navigator/types'
import { HttpClient } from 'service/network/types'
import { URLBuilder } from 'service/network/url-builder/types'
import ViewClient from 'service/network/view-client'
import { createHttpResponse, sleep } from '../../../old-structure/utils/test-utils'
import { BeagleUIElement } from './../../../../../src/beagle-tree/types';

describe('ViewClient', () => {
  const urlBuilder: URLBuilder = { build: path => path }
  const screen = { _beagleComponent_: 'beagle:container' }
  const route: RemoteView = {
    url: 'https://test.com/home',
    httpAdditionalData: {
      body: { test: 1 },
      headers: { test: '2' },
      method: 'GET',
    }
  }
  const routePrefetch: RemoteView = {
    shouldPrefetch: true,
    url: 'https://test.com/home',
    httpAdditionalData: {
      body: { test: 1 },
      headers: { test: '2' },
      method: 'GET',
    }
  }

  const fallbackElement = {
    _beagleComponent_: 'beagle:container',
    children: [
      {
        _beagleComponent_: 'beagle:text',
        text: 'Fallback page'
      }
    ]
  } as BeagleUIElement

  const successfulHttpClient: HttpClient = {
    fetch: jest.fn(() => {
      return Promise.resolve(createHttpResponse({
        json: jest.fn(() => Promise.resolve(screen))
      }))
    })
  }

  beforeEach(() => {
    const fetchMock = successfulHttpClient.fetch as jest.Mock
    fetchMock.mockClear()
  })

  it('should fetch route', async () => {
    const viewClient = ViewClient.create(successfulHttpClient, urlBuilder)
    const result = await viewClient.fetch(route)
    expect(successfulHttpClient.fetch).toHaveBeenCalledWith(route.url, route.httpAdditionalData)
    expect(result).toBe(screen)
  })

  it('should throw error when fetch promise is rejected', async () => {
    const error = new Error('Test!')
    let errorCatch
    const httpClient: HttpClient = {
      fetch: () => Promise.reject(error)
    }
    const viewClient = ViewClient.create(httpClient, urlBuilder)
    try {
      await viewClient.fetch({ url: '' })
    } catch (e) {
      errorCatch = e
    } finally {
      expect(errorCatch).toBe(error)
    }
  })

  it('should throw error when response is not successful', async () => {
    let errorCatch: Error
    const httpClient: HttpClient = {
      fetch: jest.fn(() => {
        return Promise.resolve(createHttpResponse({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        }))
      })
    }
    const viewClient = ViewClient.create(httpClient, urlBuilder)
    try {
      await viewClient.fetch(route)
    } catch (e) {
      errorCatch = e as Error
    } finally {
      expect(errorCatch!.message).toBe('404: Not Found')
    }
  })

  it('should fallback when a request failed', async () => {
    const httpClient = {
      fetch: jest.fn((_, __) => Promise.resolve({ ok: false } as Response))
    } as HttpClient
    const viewClient = ViewClient.create(httpClient, urlBuilder)

    const route = {
      url: '/route',
      fallback: fallbackElement,
    }
    const response = await viewClient.fetch(route)

    expect(response).toEqual(fallbackElement)
  })

  it('should prefetch route', async () => {
    const viewClient = ViewClient.create(successfulHttpClient, urlBuilder)
    viewClient.fetch(routePrefetch)
    expect(successfulHttpClient.fetch).toHaveBeenCalledWith(routePrefetch.url, routePrefetch.httpAdditionalData)
    await sleep(50)
    const result = await viewClient.fetch(routePrefetch)
    expect(result).toBe(screen)
    expect(successfulHttpClient.fetch).toHaveBeenCalledTimes(2)
  })

  it('should invalidate prefetch result after use', async () => {
    const viewClient = ViewClient.create(successfulHttpClient, urlBuilder)
    viewClient.fetch(routePrefetch)
    await sleep(50)
    await viewClient.fetch(routePrefetch)
    await viewClient.fetch(routePrefetch)
    expect(successfulHttpClient.fetch).toHaveBeenCalledTimes(3)
  })

  it('should silently fail when prefetch fails', async () => {
    const httpClient: HttpClient = {
      fetch: jest.fn(() => Promise.reject(new Error('Test!')))
    }
    const viewClient = ViewClient.create(httpClient, urlBuilder)
    await sleep(50)
    try {
      await viewClient.fetch(route)
    } catch { }
    finally {
      expect(httpClient.fetch).toHaveBeenCalledTimes(1)
    }
  })
})
