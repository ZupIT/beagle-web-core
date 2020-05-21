import nock from 'nock'
import sendRequest from '../../src/actions/sendRequest'
import { createBeagleViewMock } from '../test-utils'
import { ActionHandlerParams } from '../../src/actions/types'
import beagleHttpClient from '../../src/BeagleHttpClient'

const domain = 'http://beagle.test.com'
const path = '/url-builder'
const element = { _beagleType_: 'container', id: 'container' }

describe('Actions: sendRequest', () => {
  beagleHttpClient.setFetchFunction(fetch)

  it('should send request using the UrlBuilder', async () => {
    nock(domain).get(path).reply(200)
    const urlBuilder = { build: jest.fn(() => `${domain}${path}`) }
    const beagleView = createBeagleViewMock({ getUrlBuilder: () => urlBuilder })

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: 'myUrl',
        method: 'get',
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(urlBuilder.build).toHaveBeenCalledWith('myUrl')
    expect(nock.isDone()).toBe(true)
    nock.cleanAll()
  })

  it('should use get as default method', async () => {
    nock(domain).get(path).reply(200)
    const beagleView = createBeagleViewMock()

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(nock.isDone()).toBe(true)
    nock.cleanAll()
  })

  it('should send request with correct method, headers and data', async () => {
    const beagleView = createBeagleViewMock()
    const headers = { myHeader: 'my-header-value' }
    const data = { name: 'Jaina', lastname: 'Proudmoore', city: 'Boralus' }

    nock(domain, { reqheaders: headers }).post(path, data).reply(200)

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
        method: 'post',
        headers,
        data,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(nock.isDone()).toBe(true)
    nock.cleanAll()
  })

  it('should run onSuccess', async () => {
    const response = { name: 'Sylvanas', lastname: 'Windrunner', city: 'Undercity (Lordaeron)' }
    nock(domain).get(path).reply(200, JSON.stringify(response))
    const beagleView = createBeagleViewMock()
    const handleAction = jest.fn()
    const onSuccess = { _actionType_: 'alert', message: 'Success!' }

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
        onSuccess,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(handleAction).toHaveBeenCalledWith<[ActionHandlerParams]>({
      action: onSuccess,
      beagleView,
      element,
      handleAction,
      eventContextHierarchy: [
        {
          id: 'onSuccess',
          value: {
            data: response,
            status: 200,
            statusText: 'OK',
          },
        },
      ],
    })

    nock.cleanAll()
  })

  it('should run onError and log the error when it occurs before sending the request', async() => {
    const errorMessage = 'Could not find a UrlBuilder'
    const beagleView = createBeagleViewMock({
      getUrlBuilder: () => {
        throw new Error(errorMessage)
      },
    })
  
    const handleAction = jest.fn()
    const onError = { _actionType_: 'alert', message: 'Error!' }
  
    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
        onError,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledWith<[ActionHandlerParams]>({
      action: onError,
      beagleView,
      element,
      handleAction,
      eventContextHierarchy: [
        {
          id: 'onError',
          value: {
            data: undefined,
            status: undefined,
            statusText: undefined,
            message: errorMessage,
          },
        },
      ],
    })

    expect(console.error).toHaveBeenCalled()
    console.error = originalLogError
  })

  it('should run onError and log the error when response has error status', async () => {
    const response = { field: 'name', error: 'name is required' }
    nock(domain).get(path).reply(500, JSON.stringify(response))
    const beagleView = createBeagleViewMock()
    const handleAction = jest.fn()
    const onError = { _actionType_: 'alert', message: 'Error!' }

    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
        onError,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(handleAction).toHaveBeenCalledWith<[ActionHandlerParams]>({
      action: onError,
      beagleView,
      element,
      handleAction,
      eventContextHierarchy: [
        {
          id: 'onError',
          value: {
            data: response,
            status: 500,
            statusText: 'Internal Server Error',
            message: 'Internal Server Error',
          },
        },
      ],
    })

    expect(console.error).toHaveBeenCalled()
    console.error = originalLogError
    nock.cleanAll()
  })

  it('should run onError when response body is an invalid json', async () => {
    const response = '{ field: \'name\', error: \'name is required\' }'
    nock(domain).get(path).reply(200, response)
    const beagleView = createBeagleViewMock()
    const handleAction = jest.fn()
    const onError = { _actionType_: 'alert', message: 'Error!' }

    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
        onError,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(handleAction).toHaveBeenCalledWith<[ActionHandlerParams]>({
      action: onError,
      beagleView,
      element,
      handleAction,
      eventContextHierarchy: [
        {
          id: 'onError',
          value: {
            data: response,
            status: 200,
            statusText: 'OK',
            message: 'Unexpected token f in JSON at position 2',
          },
        },
      ],
    })

    expect(console.error).toHaveBeenCalled()
    console.error = originalLogError
    nock.cleanAll()
  })

  it('should run onFinish after successful request', async () => {
    nock(domain).get(path).reply(200)
    const beagleView = createBeagleViewMock()
    const handleAction = jest.fn()
    const onFinish = { _actionType_: 'alert', message: 'Finish!' }

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
        onFinish,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(handleAction).toHaveBeenCalledWith<[ActionHandlerParams]>({
      action: onFinish,
      beagleView,
      element,
      handleAction,
      eventContextHierarchy: [],
    })

    nock.cleanAll()
  })

  it('should run onFinish after request with error', async () => {
    nock(domain).get(path).reply(500)
    const beagleView = createBeagleViewMock()
    const handleAction = jest.fn()
    const onFinish = { _actionType_: 'alert', message: 'Finish!' }

    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _actionType_: 'sendRequest',
        url: `${domain}${path}`,
        onFinish,
      },
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(handleAction).toHaveBeenCalledWith<[ActionHandlerParams]>({
      action: onFinish,
      beagleView,
      element,
      handleAction,
      eventContextHierarchy: [],
    })

    nock.cleanAll()
    console.error = originalLogError
  })
})
