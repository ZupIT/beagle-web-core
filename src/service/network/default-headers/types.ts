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

import { HttpMethod } from 'service/network/types'

export interface BeagleDefaultHeaders {
  'beagle-platform': 'WEB',
  'beagle-hash'?: string,
}

export interface DefaultHeaders {
  /**
   * Gets the beagle headers for the given url/method pair. Beware, this function is asynchronous,
   * i.e. it returns a promise and not the headers directly.
   * 
   * @param url the url to get the headers for
   * @param method the http method the url will be called with
   * @param body
   * @returns a promise that resolves to a <key, value> map with the headers
   */
  get: (url: string, method: HttpMethod, body: any) => Promise<BeagleDefaultHeaders | {}>,
}
