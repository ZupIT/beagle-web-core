import * as nock from 'nock'
import beagleHttpClient from "../src/BeagleHttpClient"
/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/
import { RequestOptions } from "../src/types"

describe('BeagleHttpClient', () => {
    const url = 'http://test.com'

    beforeEach(() => {
        nock.cleanAll()
    })

    it('should assign the function parameter as the context fetch function', async () => {
        const fetchFunc = jest.fn((url: string, options: RequestOptions) => fetch(url,{...options, headers: {...options.headers}}))
        beagleHttpClient.setFetchFunction(fetchFunc)
        await beagleHttpClient.fetch(url, {})
        expect(fetchFunc).toHaveBeenCalledWith(url, {})
        expect(nock.isDone()).toBe(true)
    })

    it('should have a fetch function as default', async () => {
        const path = '/example'
        nock(url).get(path).reply(200, { status: 'OK'})
        const response = await beagleHttpClient.fetch(url + path, {})
        expect(await response.json()).toEqual({ status: 'OK' })
        expect(nock.isDone()).toBe(true)
    })

    it('should load from server with parameters options', async () => {
        const path = '/example';
        nock(url, { reqheaders: { test: 'test'}})
            .post(path, (body) => body.test ).reply(200, { status: 'OK'})
        const body = new URLSearchParams()
        body.set('test', 'test')
        const parametersOptions = { body, headers: { test: 'test'}, method: 'post'}
        const fetchFunc = jest.fn((url: string, options: RequestOptions) => fetch(url, {...options}))
        beagleHttpClient.setFetchFunction(fetchFunc)
        await  beagleHttpClient.fetch(url + path, parametersOptions)
        expect(fetchFunc).toHaveBeenCalledWith(url + path, parametersOptions)
    })
})
