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

import BeagleError, { isBeagleError } from 'error/BeagleError'
import BeagleNetworkError from 'error/BeagleNetworkError'
import { createHttpResponse } from './old-structure/utils/test-utils'

describe('Error', () => {
  it('should be Beagle Error', () => {
    const error = new BeagleError('error')
    expect(isBeagleError(error)).toBe(true)
  })

  it('should not be Beagle Error', () => {
    const error = new Error('error')
    expect(isBeagleError(error)).toBe(false)
  })

  it('should get serializable', () => {
    const error = new BeagleError('error')
    expect(error.getSerializableError()).toEqual({ message: expect.stringContaining('error') })
  })

  describe('BeagleNetworkError', () => {
    it('should create BeagleNetworkError with extended message', () => {
      const error = new BeagleNetworkError('/test', 'Additional message.')
      expect(error.message.endsWith('. Additional message.')).toBe(true)
      expect(error.response).toBeUndefined()
    })

    it('should create BeagleNetworkError with response', () => {
      const response = createHttpResponse()
      const error = new BeagleNetworkError('/test', response)
      expect(error.message.endsWith('/test.')).toBe(true)
      expect(error.response).toBe(response)
    })

    it('should get serializable with only message', async () => {
      const error = new BeagleNetworkError('/test', 'Additional message.')
      const serializable = await error.getSerializableError()
      expect(serializable).toEqual({ message: expect.stringContaining('Additional message.') })
    })

    it('should get serializable with JSON response', async () => {
      const response = createHttpResponse()
      const responseJson = { cause: 'Internal Server Error' }
      response.text = () => Promise.resolve(JSON.stringify(responseJson))
      response.json = () => Promise.resolve(responseJson)

      const error = new BeagleNetworkError('/test', response)
      const serializable = await error.getSerializableError()

      expect(serializable).toEqual({
        message: expect.stringContaining('network error'),
        response: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          type: response.type,
          redirected: response.redirected,
          url: response.url,
          headers: response.headers,
          text: JSON.stringify(responseJson),
          json: responseJson,
        }
      })
    })

    it('should get serializable with text response', async () => {
      const response = createHttpResponse()
      const responseText = 'Internal Server Error'
      response.text = () => Promise.resolve(responseText)
      response.json = () => Promise.reject()

      const error = new BeagleNetworkError('/test', response)
      const serializable = await error.getSerializableError()

      expect(serializable).toEqual({
        message: expect.stringContaining('network error'),
        response: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          type: response.type,
          redirected: response.redirected,
          url: response.url,
          headers: response.headers,
          text: responseText,
          json: undefined,
        }
      })
    })
  })
})
