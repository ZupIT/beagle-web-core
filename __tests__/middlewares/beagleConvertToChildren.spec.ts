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
  treeWithChild, treeWithChildAndChildren, treeTestChild,
  treeWithLazyComponent, treeWithLazyComponentParsed,
  treeWithLazyComponentAndChild, treeWithLazyComponentAndChildParsed
} from '../mocks'
import beagleConvertToChildrenMiddleware from '../../src/middlewares/beagle-convert-to-children'

describe('ChildToChildren Middleware', () => {
  it('should transform child attributes to children attributes', () => {
    const parsedTree = beagleConvertToChildrenMiddleware(treeWithChild)
    expect(parsedTree).toEqual(treeTestChild)
  })

  it('should return same tree when no child s found', () => {
    const parsedTree = beagleConvertToChildrenMiddleware(treeTestChild)
    expect(parsedTree).toEqual(treeTestChild)
  })

  it('should return only one children attribute when child and children s found', () => {
    const parsedTree = beagleConvertToChildrenMiddleware(treeWithChildAndChildren)
    expect(parsedTree).toEqual(treeTestChild)
  })

  it('should transform lazycomponent attribute', () => {
    const parsedTree = beagleConvertToChildrenMiddleware(treeWithLazyComponent)
    expect(parsedTree).toEqual(treeWithLazyComponentParsed)
  })

  it('should return same tree when no lazycomponent is found', () => {
    const parsedTree = beagleConvertToChildrenMiddleware(treeTestChild)
    expect(parsedTree).toEqual(treeTestChild)
  })

  it('should replace initialState and child on the same tree', () => {
    const parsedTree = beagleConvertToChildrenMiddleware(treeWithLazyComponentAndChild)
    expect(parsedTree).toEqual(treeWithLazyComponentAndChildParsed)
  })
})
