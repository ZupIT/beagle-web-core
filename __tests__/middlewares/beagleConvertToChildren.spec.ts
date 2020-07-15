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

/**
 * fixme: should follow the new organization and test Renderer/Component.ts. Maybe it would be
 * better not to couple this with the utils "Tree".
 */

import {  treeWithChild, treeWithChildAndChildren, treeTestChild } from '../mocks'
import { clone } from '../../src/utils/tree-manipulation'
import Component from '../../src/Renderer/Component'
import Tree from '../../src/utils/Tree'

describe('ChildToChildren Middleware', () => {
  it('should transform child attributes to children attributes', () => {
    const mock = clone(treeWithChild)
    Tree.forEach(mock, component => Component.formatChildrenProperty(component))
    expect(mock).toEqual(treeTestChild)
  })

  it('should return same tree when no child is found', () => {
    const mock = clone(treeTestChild)
    Tree.forEach(mock, component => Component.formatChildrenProperty(component))
    expect(mock).toEqual(treeTestChild)
  })

  it('should return only one children attribute when both child and children are found', () => {
    const mock = clone(treeWithChildAndChildren)
    Tree.forEach(mock, component => Component.formatChildrenProperty(component))
    expect(mock).toEqual(treeTestChild)
  })

  /* fixme: lazy component should not be part of the core rendering process anymore. Must be
   * implemented as a lifecycle. */
  // it('should transform lazycomponent attribute', () => {
  //   const parsedTree = beagleConvertToChildrenMiddleware(treeWithLazyComponent)
  //   expect(parsedTree).toEqual(treeWithLazyComponentParsed)
  // })

  // it('should return same tree when no lazycomponent is found', () => {
  //   const parsedTree = beagleConvertToChildrenMiddleware(treeTestChild)
  //   expect(parsedTree).toEqual(treeTestChild)
  // })

  // it('should replace initialState and child on the same tree', () => {
  //   const parsedTree = beagleConvertToChildrenMiddleware(treeWithLazyComponentAndChild)
  //   expect(parsedTree).toEqual(treeWithLazyComponentAndChildParsed)
  // })

  // it('should ignore case insensitive and parse', () => {
  //   const parsedTree = beagleConvertToChildrenMiddleware(lazyComponentWithCaseInsensitive)
  //   expect(parsedTree).toEqual(parsedlazyComponentWithCaseInsensitive)
  // })
})
