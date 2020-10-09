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

type OperationType = 'get' | 'put' | 'post' | 'delete'
type EndpointPath = string | RegExp
type EndpointResponse = (request: { url: string, requestBody: nock.Body }) => (
  Record<string, any> | void
)

export function createPersistentEndpoint(url: string, delay = 50) {
  let error = ''

  function checkError() {
    if (error) {
      const message = error
      error = ''
      return [500, { message }]
    }
  }

  function simulateError(message: string) {
    error = message
  }

  function createOperation(type: OperationType, path: EndpointPath, response: EndpointResponse) {
    nock(url)[type](path).delay(delay).reply(function(url, requestBody) {
      const error = checkError()
      if (error) return error
      
      const result = response({ url, requestBody })
      return [200, result]
    }).persist()
  }

  return {
    simulateError,
    get: (path: EndpointPath, resp: EndpointResponse) => createOperation('get', path, resp),
    put: (path: EndpointPath, resp: EndpointResponse) => createOperation('put', path, resp),
    post: (path: EndpointPath, resp: EndpointResponse) => createOperation('post', path, resp),
    delete: (path: EndpointPath, resp: EndpointResponse) => createOperation('delete', path, resp),
  }
}
