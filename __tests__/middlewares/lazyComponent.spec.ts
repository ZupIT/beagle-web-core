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

import { 
  treeTestChild,
  treeWithLazyComponent,
  treeWithLazyComponentParsed,
  treeWithLazyComponentAndChild,
  treeWithLazyComponentAndChildParsed,
  lazyComponentWithCaseInsensitive,
  parsedlazyComponentWithCaseInsensitive,
} from '../mocks'
import beagleLazyComponentMiddleware from '../../src/legacy/lazyComponent'

describe('LazyComponentMiddleware', () => {
  it('should transform lazycomponent attribute', () => {
    const parsedTree = beagleLazyComponentMiddleware(treeWithLazyComponent)
    expect(parsedTree).toEqual(treeWithLazyComponentParsed)
  })

  it('should return same tree when no lazycomponent is found', () => {
    const parsedTree = beagleLazyComponentMiddleware(treeTestChild)
    expect(parsedTree).toEqual(treeTestChild)
  })

  it('should replace initialState and child on the same tree', () => {
    const parsedTree = beagleLazyComponentMiddleware(treeWithLazyComponentAndChild)
    expect(parsedTree).toEqual(treeWithLazyComponentAndChildParsed)
  })

  it('should ignore case insensitive and parse', () => {
    const parsedTree = beagleLazyComponentMiddleware(lazyComponentWithCaseInsensitive)
    expect(parsedTree).toEqual(parsedlazyComponentWithCaseInsensitive)
  })
})
