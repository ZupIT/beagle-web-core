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

import { createQueryString } from '../src/utils/querystring'

describe('Utils Query String', () => {

  it('should create a querystring', () => {
    const qs = createQueryString({ param1: 'param1', param2: 'param2' })
    expect(qs).toEqual('param1=param1&param2=param2')
  })

  it('should return empty string for empty object', () => {
    const qs = createQueryString({})
    expect(qs).toEqual('')
  })

  it('should encode uri correctly', () => {
    const qs = createQueryString({ param: '/param' })
    expect(qs).toEqual('param=%2Fparam')
  })
})
