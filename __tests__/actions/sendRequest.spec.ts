import nock from 'nock'
import sendRequest from '../../src/actions/sendRequest'
import { createBeagleViewMock } from '../utils/test-utils'
import beagleHttpClient from '../../src/BeagleHttpClient'
import UrlBuilder from '../../src/UrlBuilder'

const domain = 'http://beagle.test.com'
const path = '/url-builder'
const element = { _beagleComponent_: 'container', id: 'container' }

beforeEach(() => {
  UrlBuilder.setBaseUrl(domain)
})

describe('Actions: beagle:sendRequest', () => {
  beagleHttpClient.setFetchFunction(fetch)

  it('should send request using the UrlBuilder', async () => {
    nock(domain).get(path).reply(200)
    const originalBuild = UrlBuilder.build
    UrlBuilder.build = jest.fn(() => `${domain}${path}`)
    const beagleView = createBeagleViewMock()

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: 'myUrl',
        method: 'get',
      },
      beagleView,
      element,
      executeAction: jest.fn()
    })

    expect(UrlBuilder.build).toHaveBeenCalledWith('myUrl')
    expect(nock.isDone()).toBe(true)
    nock.cleanAll()
    UrlBuilder.build = originalBuild
  })

  it('should use get as default method', async () => {
    nock(domain).get(path).reply(200)
    const beagleView = createBeagleViewMock()

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
    nock.cleanAll()
  })

  it('should send request with correct method, headers and data', async () => {
    const beagleView = createBeagleViewMock()
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
    nock.cleanAll()
  })

  it('should run onSuccess', async () => {
    const response = { name: 'Sylvanas', lastname: 'Windrunner', city: 'Undercity (Lordaeron)' }
    nock(domain).get(path).reply(200, JSON.stringify(response))
    const beagleView = createBeagleViewMock()
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
    nock.cleanAll()
  })

  it('should run onError and log the error when it occurs before sending the request', async() => {
    UrlBuilder.setBaseUrl(undefined)
    const beagleView = createBeagleViewMock()
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
    const beagleView = createBeagleViewMock()
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
    nock.cleanAll()
  })

  it('should use a simple string when response is not a json', async () => {
    const response = '{ field: \'name\', error: \'name is required\' }'
    nock(domain).get(path).reply(200, response)
    const beagleView = createBeagleViewMock()
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
    nock.cleanAll()
  })

  it('should run onFinish after successful request', async () => {
    nock(domain).get(path).reply(200)
    const beagleView = createBeagleViewMock()
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
    nock.cleanAll()
  })

  it('should run onFinish after request with error', async () => {
    nock(domain).get(path).reply(500)
    const beagleView = createBeagleViewMock()
    const executeAction = jest.fn()
    const onFinish = { _beagleAction_: 'beagle:alert', message: 'Finish!' }

    const originalLogError = console.error
    console.error = jest.fn()

    await sendRequest({
      action: {
        _beagleAction_: 'beagle:sendRequest',
        url: `${domain}${path}`,
        onFinish,
      },
      beagleView,
      element,
      executeAction,
    })

    expect(nock.isDone()).toBe(true)
    expect(executeAction).toHaveBeenCalledWith(onFinish)
    nock.cleanAll()
    console.error = originalLogError
  })
})
