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
import sendRequest from 'action/send-request'
import { createBeagleServiceMock, createBeagleViewMock } from '../utils/test-utils'

const domain = 'http://beagle.test.com'
const path = '/url-builder'
const element = { _beagleComponent_: 'container', id: 'container' }

describe('Actions: beagle:sendRequest', () => {
  const httpClient = { fetch }
  const urlBuilder = { build: jest.fn((value: string) => `${domain}${value}`) }
  const beagleService = createBeagleServiceMock({ httpClient, urlBuilder })
  const beagleView = createBeagleViewMock({ getBeagleService: () => beagleService })

  beforeEach(() => {
    urlBuilder.build.mockClear()
    nock.cleanAll()
  })

  it('should send request using the UrlBuilder', async () => {
    nock(domain).get(path).reply(200)

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        method: 'get',
      },
      beagleView,
      element,
      executeAction: jest.fn()
    })

    expect(urlBuilder.build).toHaveBeenCalledWith(path)
    expect(nock.isDone()).toBe(true)
  })

  it('should use get as default method', async () => {
    nock(domain).get(path).reply(200)

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
      },
      beagleView,
      element,
      executeAction: jest.fn()
    })

    expect(nock.isDone()).toBe(true)
  })

  it('should send request with correct method, headers and data', async () => {
    const headers = { myHeader: 'my-header-value' }
    const data = { name: 'Jaina', lastname: 'Proudmoore', city: 'Boralus' }

    nock(domain, { reqheaders: headers }).post(path, data).reply(200)

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        method: 'post',
        headers,
        data,
      },
      beagleView,
      element,
      executeAction: jest.fn()
    })

    expect(nock.isDone()).toBe(true)
  })

  it('should run onSuccess', async () => {
    const response = { name: 'Sylvanas', lastname: 'Windrunner', city: 'Undercity (Lordaeron)' }
    nock(domain).get(path).reply(200, JSON.stringify(response))
    const executeAction = jest.fn()
    const onSuccess = { _beagleAction_: 'beagle:alert', message: 'Success!' }

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        onSuccess,
      },
      beagleView,
      element,
      executeAction,
    })

    const expectedImplicitContext = {
      id: 'onSuccess',
      value: {
        data: response,
        status: 200,
        statusText: 'OK',
      },
    }

    expect(nock.isDone()).toBe(true)
    expect(executeAction).toHaveBeenCalledWith(
      onSuccess,
      expectedImplicitContext.id,
      expectedImplicitContext.value,
    )
  })

  it('should run onError and log the error when it occurs before sending the request', async() => {
    const beagleService = createBeagleServiceMock({ httpClient })
    const beagleView = createBeagleViewMock({ getBeagleService: () => beagleService })
    const executeAction = jest.fn()
    const onError = { _beagleAction_: 'beagle:alert', message: 'Error!' }
  
    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        onError,
      },
      element,
      executeAction,
      beagleView,
    })

    const expectedImplicitContext = {
      id: 'onError',
      value: {
        data: undefined,
        status: undefined,
        statusText: undefined,
        message: 'Only absolute URLs are supported',
      },
    }

    expect(executeAction).toHaveBeenCalledWith(
      onError,
      expectedImplicitContext.id,
      expectedImplicitContext.value,
    )

    expect(console.error).toHaveBeenCalled()
    console.error = originalLogError
  })

  it('should run onError and log the error when response has error status', async () => {
    const response = { field: 'name', error: 'name is required' }
    nock(domain).get(path).reply(500, JSON.stringify(response))
    const executeAction = jest.fn()
    const onError = { _beagleAction_: 'beagle:alert', message: 'Error!' }

    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        onError,
      },
      beagleView,
      element,
      executeAction,
    })

    const expectedImplicitContext = {
      id: 'onError',
      value: {
        data: response,
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Internal Server Error',
      },
    }

    expect(nock.isDone()).toBe(true)
    expect(executeAction).toHaveBeenCalledWith(
      onError,
      expectedImplicitContext.id,
      expectedImplicitContext.value,
    )
    expect(console.error).toHaveBeenCalled()
    console.error = originalLogError
  })

  it('should use a simple string when response is not a json', async () => {
    const response = '{ field: \'name\', error: \'name is required\' }'
    nock(domain).get(path).reply(200, response)
    const executeAction = jest.fn()
    const onSuccess = { _beagleAction_: 'beagle:alert', message: 'Success!' }

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        onSuccess,
      },
      beagleView,
      element,
      executeAction,
    })

    const expectedImplicitContext = {
      id: 'onSuccess',
      value: {
        data: response,
        status: 200,
        statusText: 'OK',
      },
    }

    expect(nock.isDone()).toBe(true)
    expect(executeAction).toHaveBeenCalledWith(
      onSuccess,
      expectedImplicitContext.id,
      expectedImplicitContext.value,
    )
  })

  it('should run onFinish after successful request', async () => {
    nock(domain).get(path).reply(200)
    const executeAction = jest.fn()
    const onFinish = { _beagleAction_: 'beagle:alert', message: 'Finish!' }

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        onFinish,
      },
      beagleView,
      element,
      executeAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(executeAction).toHaveBeenCalledWith(onFinish)
  })

  it('should run onFinish after request with error', async () => {
    nock(domain).get(path).reply(500)
    const executeAction = jest.fn()
    const onFinish = { _beagleAction_: 'beagle:alert', message: 'Finish!' }

    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: path,
        onFinish,
      },
      beagleView,
      element,
      executeAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(executeAction).toHaveBeenCalledWith(onFinish)
    console.error = originalLogError
  })
})
