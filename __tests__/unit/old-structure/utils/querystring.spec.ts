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

import UrlUtils from 'utils/url'

describe('Utils Query String', () => {

  it('should create a querystring', () => {
    const qs = UrlUtils.createQueryString({ param1: 'param1', param2: 'param2' })
    expect(qs).toEqual('?param1=param1&param2=param2')
  })

  it('should return empty string for empty object', () => {
    const qs1 = UrlUtils.createQueryString({})
    expect(qs1).toEqual('')
    // @ts-ignore
    const qs2 = UrlUtils.createQueryString()
    expect(qs2).toEqual('')
  })

  it('should encode uri correctly', () => {
    const qs = UrlUtils.createQueryString({ param: '/param' })
    expect(qs).toEqual('?param=%2Fparam')
  })
})
