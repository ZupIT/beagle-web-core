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
import BeagleService from 'service/beagle-service'

// todo: move to the beagle-service test suit
describe.only('BeagleHttpClient', () => {
  const url = 'http://test.com'

  beforeEach(() => {
    nock.cleanAll()
  })

  it('should use window.fetch as default fetch function', async () => {
    const { httpClient } = BeagleService.create({ baseUrl: '', components: {} })
    const path = '/example'
    nock(url).get(path).reply(200, { status: 'OK' })
    const response = await httpClient.fetch(url + path, {})
    expect(await response.json()).toEqual({ status: 'OK' })
    expect(nock.isDone()).toBe(true)
  })

  it('should use custom fetch function', async () => {
    const fetchData = jest.fn()
    const { httpClient } = BeagleService.create({ baseUrl: '', components: {}, fetchData })
    await httpClient.fetch(url, {})
    expect(fetchData).toHaveBeenCalledWith(url, {})
  })
})
